import os
import json

# Cấu hình đường dẫn
FOLDER_PATH = "public/image/graduation/kyniem"
OUTPUT_FILE = "public/image/graduation/kyniem/list.json"
# Các đuôi ảnh chấp nhận
VALID_EXTS = ('.jpg', '.jpeg', '.png', '.webp')

def scan_files():
    if not os.path.exists(FOLDER_PATH):
        print(f"❌ Không tìm thấy thư mục: {FOLDER_PATH}")
        return

    # Lấy tất cả file có đuôi hợp lệ
    files = [f for f in os.listdir(FOLDER_PATH) 
             if f.lower().endswith(VALID_EXTS) and not f.startswith("temp_")]

    # Ghi vào file JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(files, f, ensure_ascii=False, indent=2)

    print(f"✅ Đã tìm thấy {len(files)} ảnh lung tung.")
    print(f"📝 Đã lưu danh sách vào: {OUTPUT_FILE}")

if __name__ == "__main__":
    scan_files()