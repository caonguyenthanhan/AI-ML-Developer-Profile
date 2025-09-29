import os
import json
from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
import uuid

# Cấu hình ứng dụng
app = Flask(__name__, static_folder='public', static_url_path='')
app.config['UPLOAD_FOLDER'] = 'public/image'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1 MB

PROMPTS_FILE = 'public/data/prompts.json'
CATEGORIES_FILE = 'public/data/category.json'

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
    categories = load_data(CATEGORIES_FILE)
    if request.method == 'POST':
        title = request.form['title']
        prompt_text = request.form['prompt']
        category = request.form['category']
        
        image_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"{uuid.uuid4()}.{file.filename.rsplit('.', 1)[1].lower()}")
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_path = f"/image/{filename}"

        prompts = load_data(PROMPTS_FILE)
        new_id = max([p['id'] for p in prompts]) + 1 if prompts else 1
        new_prompt = {
            "id": new_id,
            "title": title,
            "prompt": prompt_text,
            "imagePath": image_path,
            "category": category
        }
        prompts.append(new_prompt)
        save_data(PROMPTS_FILE, prompts)
        return redirect(url_for('index'))
    return render_template('add.html', categories=categories)

@app.route('/edit/<int:prompt_id>', methods=['GET', 'POST'])
def edit_prompt(prompt_id):
    """Sửa một prompt hiện có."""
    prompts = load_data(PROMPTS_FILE)
    prompt_to_edit = next((p for p in prompts if p['id'] == prompt_id), None)
    categories = load_data(CATEGORIES_FILE)

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
                prompt_to_edit['imagePath'] = f"/image/{filename}"

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

if __name__ == '__main__':
    if not os.path.exists('public/image'):
        os.makedirs('public/image')
    if not os.path.exists(PROMPTS_FILE):
        os.makedirs(os.path.dirname(PROMPTS_FILE), exist_ok=True)
        with open(PROMPTS_FILE, 'w', encoding='utf-8') as f:
            f.write('[]')
    if not os.path.exists(CATEGORIES_FILE):
        os.makedirs(os.path.dirname(CATEGORIES_FILE), exist_ok=True)
        with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
            f.write('[]')
    app.run(debug=True)