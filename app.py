import os
import json
import subprocess
import base64
import threading
import time
import signal
import sys
from flask import Flask, request, render_template, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
import uuid

# Cấu hình ứng dụng
app = Flask(__name__, static_folder='public', static_url_path='')
app.config['UPLOAD_FOLDER'] = 'public/image/genai'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1 MB

PROMPTS_FILE = 'public/data/prompts.json'
CATEGORIES_FILE = 'public/data/category.json'
PROMPTS_VIP_FILE = 'private/prompts_vip.json'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def load_data(filename):
    if not os.path.exists(filename) or os.path.getsize(filename) == 0:
        return []
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

@app.route('/')
def index():
    """Trang chủ hiển thị danh sách các prompts."""
    prompts = load_data(PROMPTS_FILE)
    return render_template('index.html', prompts=prompts)

@app.route('/add', methods=['GET', 'POST'])
def add_prompt():
    """Thêm mới một prompt."""
    categories_data = load_data(CATEGORIES_FILE)
    # Chỉ lấy tên category thay vì toàn bộ object
    categories = [cat['name'] if isinstance(cat, dict) else cat for cat in categories_data]
    if request.method == 'POST':
        title = request.form['title']
        prompt_text = request.form['prompt']
        category = request.form['category']
        is_public = 'is_public' in request.form  # Checkbox được tick hay không
        
        image_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"{uuid.uuid4()}.{file.filename.rsplit('.', 1)[1].lower()}")
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_path = f"/image/genai/{filename}"

        # Lấy ID mới từ cả hai file để đảm bảo không trùng
        prompts = load_data(PROMPTS_FILE)
        prompts_vip = load_data(PROMPTS_VIP_FILE)
        all_ids = [p['id'] for p in prompts] + [p['id'] for p in prompts_vip]
        new_id = max(all_ids) + 1 if all_ids else 1
        
        # Tạo prompt đầy đủ
        full_prompt = {
            "id": new_id,
            "title": title,
            "prompt": prompt_text,
            "imagePath": image_path,
            "category": category
        }
        
        if is_public:
            # Nếu công khai, lưu đầy đủ vào prompts.json
            prompts.append(full_prompt)
            save_data(PROMPTS_FILE, prompts)
        else:
            # Nếu riêng tư, lưu đầy đủ vào prompts_vip.json
            prompts_vip.append(full_prompt)
            save_data(PROMPTS_VIP_FILE, prompts_vip)
            
            # Và lưu thông tin cơ bản với prompt="liên hệ admin" vào prompts.json
            public_prompt = {
                "id": new_id,
                "title": title,
                "prompt": "liên hệ admin",
                "imagePath": image_path,
                "category": category
            }
            prompts.append(public_prompt)
            save_data(PROMPTS_FILE, prompts)
        
        return redirect(url_for('index'))
    return render_template('add.html', categories=categories)

@app.route('/edit/<int:prompt_id>', methods=['GET', 'POST'])
def edit_prompt(prompt_id):
    """Sửa một prompt hiện có."""
    prompts = load_data(PROMPTS_FILE)
    prompt_to_edit = next((p for p in prompts if p['id'] == prompt_id), None)
    categories_data = load_data(CATEGORIES_FILE)
    # Chỉ lấy tên category thay vì toàn bộ object
    categories = [cat['name'] if isinstance(cat, dict) else cat for cat in categories_data]

    if not prompt_to_edit:
        return "Prompt not found!", 404

    if request.method == 'POST':
        prompt_to_edit['title'] = request.form['title']
        prompt_to_edit['prompt'] = request.form['prompt']
        prompt_to_edit['category'] = request.form['category']
        
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                if prompt_to_edit['imagePath'] and os.path.exists(prompt_to_edit['imagePath'][1:]):
                    os.remove(prompt_to_edit['imagePath'][1:])
                
                filename = secure_filename(f"{uuid.uuid4()}.{file.filename.rsplit('.', 1)[1].lower()}")
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                prompt_to_edit['imagePath'] = f"/image/genai/{filename}"

        save_data(PROMPTS_FILE, prompts)
        return redirect(url_for('index'))
    return render_template('edit.html', prompt=prompt_to_edit, categories=categories)

@app.route('/delete/<int:prompt_id>')
def delete_prompt(prompt_id):
    """Xóa một prompt."""
    prompts = load_data(PROMPTS_FILE)
    prompt_to_delete = next((p for p in prompts if p['id'] == prompt_id), None)
    if prompt_to_delete:
        if prompt_to_delete['imagePath'] and os.path.exists(prompt_to_delete['imagePath'][1:]):
            os.remove(prompt_to_delete['imagePath'][1:])
        prompts = [p for p in prompts if p['id'] != prompt_id]
        save_data(PROMPTS_FILE, prompts)
    return redirect(url_for('index'))

@app.route('/categories', methods=['GET', 'POST'])
def manage_categories():
    """Quản lý các category."""
    categories = load_data(CATEGORIES_FILE)
    if request.method == 'POST':
        new_category = request.form['new_category']
        if new_category and new_category not in categories:
            categories.append(new_category)
            save_data(CATEGORIES_FILE, categories)
        return redirect(url_for('manage_categories'))
    return render_template('categories.html', categories=categories)

@app.route('/delete_category/<string:category_name>')
def delete_category(category_name):
    """Xóa một category."""
    categories = load_data(CATEGORIES_FILE)
    if category_name in categories:
        categories.remove(category_name)
        save_data(CATEGORIES_FILE, categories)
    return redirect(url_for('manage_categories'))

@app.route('/upload_to_github', methods=['POST'])
def upload_to_github():
    """Upload prompts.json và category.json lên GitHub repository."""
    try:
        # Kiểm tra xem có file cần upload không
        if not os.path.exists(PROMPTS_FILE) or not os.path.exists(CATEGORIES_FILE):
            return jsonify({'success': False, 'message': 'Không tìm thấy file dữ liệu để upload!'})
        
        # Thực hiện git add, commit và push
        commands = [
            ['git', 'add', PROMPTS_FILE, CATEGORIES_FILE, 'public/image/genai/'],
            ['git', 'commit', '-m', 'Update prompts, categories data and genai images'],
            ['git', 'push', 'origin', 'main']
        ]
        
        for cmd in commands:
            result = subprocess.run(cmd, capture_output=True, text=True, cwd='.')
            if result.returncode != 0:
                return jsonify({
                    'success': False, 
                    'message': f'Lỗi khi thực hiện lệnh {" ".join(cmd)}: {result.stderr}'
                })
        
        return jsonify({
            'success': True, 
            'message': 'Đã upload thành công lên GitHub!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Lỗi không mong muốn: {str(e)}'
        })

# Global variable để lưu server process
server_process = None

@app.route('/api/server/start', methods=['POST'])
def start_server():
    """API endpoint để khởi động server."""
    global server_process
    try:
        if server_process and server_process.poll() is None:
            return jsonify({'success': False, 'message': 'Server đã đang chạy!'})
        
        # Khởi động server trong subprocess
        server_process = subprocess.Popen([
            sys.executable, 'app.py'
        ], cwd=os.getcwd())
        
        return jsonify({
            'success': True, 
            'message': 'Server đã được khởi động thành công!',
            'pid': server_process.pid
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Lỗi khi khởi động server: {str(e)}'
        })

@app.route('/api/server/stop', methods=['POST'])
def stop_server():
    """API endpoint để dừng server."""
    global server_process
    try:
        if server_process and server_process.poll() is None:
            server_process.terminate()
            server_process.wait(timeout=5)
            server_process = None
            return jsonify({
                'success': True, 
                'message': 'Server đã được dừng!'
            })
        else:
            return jsonify({
                'success': False, 
                'message': 'Server không đang chạy!'
            })
        
    except subprocess.TimeoutExpired:
        server_process.kill()
        server_process = None
        return jsonify({
            'success': True, 
            'message': 'Server đã được force stop!'
        })
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Lỗi khi dừng server: {str(e)}'
        })

@app.route('/api/server/status', methods=['GET'])
def server_status():
    """API endpoint để kiểm tra trạng thái server."""
    global server_process
    try:
        is_running = server_process and server_process.poll() is None
        
        return jsonify({
            'success': True,
            'running': is_running,
            'pid': server_process.pid if is_running else None,
            'message': 'Server đang chạy' if is_running else 'Server không chạy'
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Lỗi khi kiểm tra trạng thái: {str(e)}'
        })

@app.route('/api/server/restart', methods=['POST'])
def restart_server():
    """API endpoint để restart server."""
    try:
        # Dừng server trước
        stop_result = stop_server()
        if not stop_result.get_json().get('success', False):
            return jsonify({
                'success': False, 
                'message': 'Không thể dừng server để restart!'
            })
        
        # Đợi một chút
        time.sleep(2)
        
        # Khởi động lại
        start_result = start_server()
        return start_result
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Lỗi khi restart server: {str(e)}'
        })

@app.route('/admin/29029003/upson')
def admin_server_control():
    """Route admin để quản lý server."""
    return app.send_static_file('admin-server-control.html')

if __name__ == '__main__':
    if not os.path.exists('public/image/genai'):
        os.makedirs('public/image/genai')
    if not os.path.exists('private'):
        os.makedirs('private')
    if not os.path.exists(PROMPTS_FILE):
        os.makedirs(os.path.dirname(PROMPTS_FILE), exist_ok=True)
        with open(PROMPTS_FILE, 'w', encoding='utf-8') as f:
            f.write('[]')
    if not os.path.exists(CATEGORIES_FILE):
        os.makedirs(os.path.dirname(CATEGORIES_FILE), exist_ok=True)
        with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
            f.write('[]')
    if not os.path.exists(PROMPTS_VIP_FILE):
        os.makedirs(os.path.dirname(PROMPTS_VIP_FILE), exist_ok=True)
        with open(PROMPTS_VIP_FILE, 'w', encoding='utf-8') as f:
            f.write('[]')
    app.run(debug=True)