import os
import re

BASE_DIR = r"D:\desktop\AIML Developer Profile"
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
HEADER_JS_ABS = os.path.join(PUBLIC_DIR, "assets", "js", "header.js")

def compute_relative_path(from_file_dir, target_abs):
    rel = os.path.relpath(target_abs, start=from_file_dir)
    return rel.replace('\\', '/')

def ensure_header_script(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'header.js' in content:
        return False
    insert_path = compute_relative_path(os.path.dirname(html_path), HEADER_JS_ABS)
    script_tag = f"<script src=\"{insert_path}\"></script>"
    if re.search(r"</head>", content, re.IGNORECASE):
        content = re.sub(r"</head>", script_tag + "\n</head>", content, count=1, flags=re.IGNORECASE)
    elif re.search(r"</body>", content, re.IGNORECASE):
        content = re.sub(r"</body>", script_tag + "\n</body>", content, count=1, flags=re.IGNORECASE)
    else:
        content = content + "\n" + script_tag + "\n"
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

updated = []
for root, dirs, files in os.walk(PUBLIC_DIR):
    for name in files:
        if name.lower().endswith('.html'):
            p = os.path.join(root, name)
            try:
                if ensure_header_script(p):
                    updated.append(p)
            except Exception as e:
                pass

print("UPDATED_FILES:")
for u in updated:
    print(u)