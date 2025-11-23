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
from PIL import Image, ImageOps
import urllib.request
import urllib.error
import json as jsonlib
from pathlib import Path

# Cấu hình ứng dụng
app = Flask(__name__, static_folder='public', static_url_path='')
app.config['UPLOAD_FOLDER'] = 'public/image/genai'
app.config['VIDEO_UPLOAD_FOLDER'] = 'public/video/genai'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv'}
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB để hỗ trợ video

PROMPTS_FILE = 'public/data/prompts.json'
CATEGORIES_FILE = 'public/data/category.json'
PROMPTS_VIP_FILE = 'private/prompts_vip.json'

def load_env_from_file():
    try:
        env_path = Path('private/.env')
        if env_path.exists() and env_path.is_file():
            with env_path.open('r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith('#'):
                        continue
                    if '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip()
                        if k and v and not os.environ.get(k):
                            os.environ[k] = v
    except Exception:
        pass

# Nạp .env ngay khi module được import
load_env_from_file()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def is_video_file(filename):
    video_extensions = {'mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in video_extensions

def is_image_file(filename):
    image_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in image_extensions

def load_data(filename):
    if not os.path.exists(filename) or os.path.getsize(filename) == 0:
        return []
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def compress_image(image_path, target_size_mb=1):
    """
    Nén ảnh để đảm bảo kích thước file dưới target_size_mb MB.
    
    Args:
        image_path (str): Đường dẫn đến file ảnh
        target_size_mb (float): Kích thước mục tiêu tính bằng MB (mặc định 1MB)
    
    Returns:
        bool: True nếu nén thành công, False nếu có lỗi
    """
    try:
        target_size_bytes = target_size_mb * 1024 * 1024
        
        # Mở ảnh
        with Image.open(image_path) as img:
            # Chuyển đổi sang RGB nếu cần (để hỗ trợ PNG với alpha channel)
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Tự động xoay ảnh theo EXIF orientation
            img = ImageOps.exif_transpose(img)
            
            # Lấy kích thước file hiện tại
            current_size = os.path.getsize(image_path)
            
            # Nếu file đã nhỏ hơn target size thì không cần nén
            if current_size <= target_size_bytes:
                return True
            
            # Tính toán chất lượng ban đầu
            quality = 95
            
            # Thử nén với các mức chất lượng khác nhau
            while quality > 10:
                # Lưu ảnh tạm với chất lượng hiện tại
                temp_path = image_path + '.temp'
                img.save(temp_path, 'JPEG', quality=quality, optimize=True)
                
                # Kiểm tra kích thước
                temp_size = os.path.getsize(temp_path)
                
                if temp_size <= target_size_bytes:
                    # Thay thế file gốc bằng file đã nén
                    os.replace(temp_path, image_path)
                    return True
                else:
                    # Xóa file tạm và giảm chất lượng
                    os.remove(temp_path)
                    quality -= 5
            
            # Nếu vẫn không đạt được kích thước mong muốn, thử resize ảnh
            original_width, original_height = img.size
            scale_factor = 0.9
            
            while scale_factor > 0.3:
                new_width = int(original_width * scale_factor)
                new_height = int(original_height * scale_factor)
                
                resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                temp_path = image_path + '.temp'
                resized_img.save(temp_path, 'JPEG', quality=85, optimize=True)
                
                temp_size = os.path.getsize(temp_path)
                
                if temp_size <= target_size_bytes:
                    os.replace(temp_path, image_path)
                    return True
                else:
                    os.remove(temp_path)
                    scale_factor -= 0.1
            
            # Nếu vẫn không thể nén đủ nhỏ, sử dụng chất lượng thấp nhất
            img.save(image_path, 'JPEG', quality=10, optimize=True)
            return True
            
    except Exception as e:
        print(f"Lỗi khi nén ảnh {image_path}: {str(e)}")
        return False

def update_category_counts():
    """Cập nhật số lượng prompts cho mỗi category."""
    try:
        categories = load_data(CATEGORIES_FILE)
        prompts = load_data(PROMPTS_FILE)
        
        # Đếm số prompts cho mỗi category
        category_counts = {}
        for prompt in prompts:
            category = prompt.get('category', '')
            if category:
                category_counts[category] = category_counts.get(category, 0) + 1
        
        # Cập nhật count cho mỗi category
        for category in categories:
            if isinstance(category, dict):
                category_name = category.get('name', '')
                category['count'] = category_counts.get(category_name, 0)
        
        save_data(CATEGORIES_FILE, categories)
        return True
    except Exception as e:
        print(f"Error updating category counts: {e}")
        return False

@app.route('/')
def index():
    """Trang chủ hiển thị danh sách các prompts."""
    prompts = load_data(PROMPTS_FILE)
    prompts_sorted = []
    if isinstance(prompts, list):
        try:
            prompts_sorted = sorted(prompts, key=lambda p: p.get('id', 0), reverse=True)
        except Exception:
            prompts_sorted = prompts
    recent_prompts = prompts_sorted[:12] if isinstance(prompts_sorted, list) else []
    return render_template('index.html', prompts=prompts_sorted, recent_prompts=recent_prompts)

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
        
        media_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"{uuid.uuid4()}.{file.filename.rsplit('.', 1)[1].lower()}")
                
                if is_video_file(file.filename):
                    # Lưu video
                    file_path = os.path.join(app.config['VIDEO_UPLOAD_FOLDER'], filename)
                    file.save(file_path)
                    media_path = f"/video/genai/{filename}"
                elif is_image_file(file.filename):
                    # Lưu ảnh
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(file_path)
                    # Nén ảnh nếu cần thiết
                    compress_image(file_path)
                    media_path = f"/image/genai/{filename}"

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
            "imagePath": media_path,
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
                "imagePath": media_path,
                "category": category
            }
            prompts.append(public_prompt)
            save_data(PROMPTS_FILE, prompts)
        
        # Cập nhật count cho categories
        update_category_counts()
        return redirect(url_for('add_prompt', saved='1'))
    saved = request.args.get('saved')
    return render_template('add.html', categories=categories, saved=saved)

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
                
                if is_video_file(file.filename):
                    # Lưu video
                    file_path = os.path.join(app.config['VIDEO_UPLOAD_FOLDER'], filename)
                    file.save(file_path)
                    prompt_to_edit['imagePath'] = f"/video/genai/{filename}"
                elif is_image_file(file.filename):
                    # Lưu ảnh
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(file_path)
                    # Nén ảnh nếu cần thiết
                    compress_image(file_path)
                    prompt_to_edit['imagePath'] = f"/image/genai/{filename}"

        save_data(PROMPTS_FILE, prompts)
        # Cập nhật count cho categories
        update_category_counts()
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
        # Cập nhật count cho categories
        update_category_counts()
    return redirect(url_for('index'))

@app.route('/categories', methods=['GET', 'POST'])
def manage_categories():
    """Quản lý các category."""
    categories = load_data(CATEGORIES_FILE)
    if request.method == 'POST':
        new_category_name = request.form['new_category']
        category_description = request.form.get('category_description', '')
        category_color = request.form.get('category_color', '#667eea')
        category_icon = request.form.get('category_icon', 'folder')
        
        if new_category_name:
            # Kiểm tra xem category đã tồn tại chưa
            existing_names = []
            for cat in categories:
                if isinstance(cat, dict):
                    existing_names.append(cat.get('name', ''))
                else:
                    existing_names.append(cat)
            
            if new_category_name not in existing_names:
                # Tạo ID mới
                max_id = 0
                for cat in categories:
                    if isinstance(cat, dict) and 'id' in cat:
                        max_id = max(max_id, cat['id'])
                
                # Thêm category mới với cấu trúc đầy đủ
                new_category = {
                    "id": max_id + 1,
                    "name": new_category_name,
                    "description": category_description or f"Category {new_category_name}",
                    "count": 0,
                    "color": category_color,
                    "icon": category_icon
                }
                categories.append(new_category)
                save_data(CATEGORIES_FILE, categories)
                # Cập nhật count sau khi thêm category
                update_category_counts()
        return redirect(url_for('manage_categories'))
    return render_template('categories.html', categories=categories)

@app.route('/delete_category/<string:category_name>')
def delete_category(category_name):
    """Xóa một category."""
    categories = load_data(CATEGORIES_FILE)
    updated_categories = []
    
    for cat in categories:
        if isinstance(cat, dict):
            if cat.get('name') != category_name:
                updated_categories.append(cat)
        else:
            if cat != category_name:
                updated_categories.append(cat)
    
    save_data(CATEGORIES_FILE, updated_categories)
    # Cập nhật count cho categories
    update_category_counts()
    return redirect(url_for('manage_categories'))

@app.route('/toggle_vip/<int:prompt_id>', methods=['POST'])
def toggle_vip(prompt_id):
    """Chuyển đổi trạng thái VIP của prompt."""
    prompts = load_data(PROMPTS_FILE)
    prompts_vip = load_data(PROMPTS_VIP_FILE)
    
    # Tìm prompt trong file public
    prompt_public = next((p for p in prompts if p['id'] == prompt_id), None)
    if not prompt_public:
        return jsonify({'success': False, 'message': 'Không tìm thấy prompt!'})
    
    # Kiểm tra xem prompt có phải VIP không (prompt = "liên hệ admin")
    is_currently_vip = prompt_public['prompt'] == "liên hệ admin"
    
    if is_currently_vip:
        # Chuyển từ VIP sang thường
        # Tìm prompt đầy đủ trong file VIP
        prompt_vip = next((p for p in prompts_vip if p['id'] == prompt_id), None)
        if prompt_vip:
            # Copy prompt đầy đủ từ VIP sang public
            prompt_public['prompt'] = prompt_vip['prompt']
            save_data(PROMPTS_FILE, prompts)
            return jsonify({'success': True, 'message': 'Đã chuyển prompt từ VIP sang thường!'})
        else:
            return jsonify({'success': False, 'message': 'Không tìm thấy dữ liệu VIP tương ứng!'})
    else:
        # Chuyển từ thường lên VIP
        # Copy toàn bộ prompt vào file VIP
        prompt_vip_exists = next((p for p in prompts_vip if p['id'] == prompt_id), None)
        if not prompt_vip_exists:
            prompts_vip.append(prompt_public.copy())
            save_data(PROMPTS_VIP_FILE, prompts_vip)
        
        # Thay đổi prompt trong file public thành "liên hệ admin"
        prompt_public['prompt'] = "liên hệ admin"
        save_data(PROMPTS_FILE, prompts)
        return jsonify({'success': True, 'message': 'Đã chuyển prompt lên VIP!'})

@app.route('/upload_to_github', methods=['POST'])
def upload_to_github():
    """Upload prompts.json và category.json lên GitHub repository."""
    try:
        # Kiểm tra xem có file cần upload không
        if not os.path.exists(PROMPTS_FILE) or not os.path.exists(CATEGORIES_FILE):
            return jsonify({'success': False, 'message': 'Không tìm thấy file dữ liệu để upload!'})
        
        # Thực hiện git add, commit và push
        commands = [
            ['git', 'add', PROMPTS_FILE, CATEGORIES_FILE, 'public/image/genai/', 'public/video/genai/'],
            ['git', 'commit', '-m', 'Update prompts, categories data and genai images/videos'],
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

@app.route('/api/chat', methods=['POST'])
def api_chat():
    try:
        data = request.get_json(silent=True) or {}
        user_query = (data.get('userQuery') or '').strip()
        system_instruction = (data.get('systemInstruction') or '').strip()

        api_key = os.environ.get('GOOGLE_API_KEY') or os.environ.get('GEMINI_API_KEY') or os.environ.get('GENAI_API_KEY')
        if not api_key:
            return jsonify({'ok': False, 'error': 'missing_api_key', 'text': 'Máy chủ chưa cấu hình API key.'}), 501
        model_name = os.environ.get('MODEL_NAME', 'gemini-2.0-flash')
        endpoint = f'https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent'
        payload = {
            'contents': [
                {'role': 'user', 'parts': [{'text': user_query or 'Hi'}]}
            ]
        }
        if system_instruction:
            payload['systemInstruction'] = {
                'role': 'system',
                'parts': [{'text': system_instruction}]
            }

        req = urllib.request.Request(
            url=endpoint,
            data=jsonlib.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'X-goog-api-key': api_key
            },
            method='POST'
        )

        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                raw = resp.read().decode('utf-8')
                j = jsonlib.loads(raw)
        except urllib.error.HTTPError as e:
            try:
                raw = e.read().decode('utf-8')
                j = jsonlib.loads(raw)
            except Exception:
                j = {'error': f'http_error_{e.code}'}

        text = ''
        try:
            candidates = j.get('candidates') or []
            if candidates:
                parts = ((candidates[0].get('content') or {}).get('parts')) or []
                if parts:
                    text = parts[0].get('text') or ''
        except Exception:
            text = ''

        if not text:
            text = (j.get('error') or {}).get('message') or 'Không nhận được phản hồi từ mô hình.'

        return jsonify({'ok': True, 'text': text})
    except Exception as e:
        return jsonify({'ok': False, 'error': 'server_error', 'text': f'Lỗi máy chủ: {str(e)}'}), 500

@app.route('/api/config', methods=['GET'])
def api_config():
    model_name = os.environ.get('MODEL_NAME', 'gemini-2.0-flash')
    return jsonify({'modelName': model_name})

@app.route('/aise', methods=['GET'])
def go_aise():
    return redirect('/AI%20Software%20Engineer%202025.html', code=302)

@app.route('/hethongthongminh.id.vn', methods=['GET'])
def alias_root():
    return redirect('https://hethongthongminh.id.vn/', code=302)

@app.route('/hethongthongminh.id.vn/<path:sub>', methods=['GET'])
def alias_path(sub):
    return redirect(f'https://hethongthongminh.id.vn/{sub}', code=302)

@app.route('/api/debug/env_key', methods=['GET'])
def debug_env_key():
    g = os.environ.get('GOOGLE_API_KEY') or ''
    gm = os.environ.get('GEMINI_API_KEY') or ''
    gn = os.environ.get('GENAI_API_KEY') or ''
    present = bool(g or gm or gn)
    return jsonify({'present': present, 'GOOGLE_API_KEY_len': len(g), 'GEMINI_API_KEY_len': len(gm), 'GENAI_API_KEY_len': len(gn)})

@app.route('/api/debug/cwd', methods=['GET'])
def debug_cwd():
    try:
        cwd = os.getcwd()
        env_path = str(Path('private/.env').resolve())
        exists = Path('private/.env').exists()
        return jsonify({'cwd': cwd, 'env_path': env_path, 'env_exists': exists})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/rsvp', methods=['POST'])
def rsvp_api():
    data = request.get_json(silent=True) or {}
    entry = {
        'name': data.get('name') or '',
        'email': data.get('email') or '',
        'attending': bool(data.get('attending')),
        'message': data.get('message') or '',
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }
    try:
        path = os.path.join('public', 'data', 'rsvps.json')
        os.makedirs(os.path.dirname(path), exist_ok=True)
        rows = []
        if os.path.exists(path) and os.path.getsize(path) > 0:
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    rows = json.load(f)
                if not isinstance(rows, list):
                    rows = []
            except Exception:
                rows = []
        rows.append(entry)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(rows, f, ensure_ascii=False, indent=2)
        return jsonify({'success': True, 'message': 'RSVP saved'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Internal Server Error', 'error': str(e)}), 500

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

@app.route('/admin/vip_prompts')
def admin_vip_prompts():
    """Route admin để xem toàn bộ prompt VIP."""
    try:
        with open('private/ad_view_prompt.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Admin page not found", 404

@app.route('/private/prompts_vip.json')
def serve_vip_prompts():
    """Route để serve file prompts_vip.json cho trang admin."""
    try:
        with open(PROMPTS_VIP_FILE, 'r', encoding='utf-8') as f:
            return f.read(), 200, {'Content-Type': 'application/json'}
    except FileNotFoundError:
        return "[]", 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    load_env_from_file()
    if not os.path.exists('public/image/genai'):
        os.makedirs('public/image/genai')
    if not os.path.exists('public/video/genai'):
        os.makedirs('public/video/genai')
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
    port = int(os.environ.get('PORT', '54321'))
    host = os.environ.get('HOST', '127.0.0.1')
    app.run(host=host, port=port, debug=True, use_reloader=False)
