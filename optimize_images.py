import os
from PIL import Image

# CẤU HÌNH CÁC THƯ MỤC CẦN TỐI ƯU
# Lưu ý: Đường dẫn tính từ nơi đặt file script này
TARGET_FOLDERS = [
    "public/ar-card",
    "public/image/graduation/kyniem",
    "public/image/graduation" 
]

# Cấu hình nén
MAX_WIDTH = 800  # Chiều ngang tối đa (px)
QUALITY = 75     # Chất lượng ảnh (1-100), 75 là chuẩn cho web

def optimize_image(file_path):
    try:
        # Mở ảnh
        with Image.open(file_path) as img:
            # Lấy kích thước cũ
            width, height = img.size
            
            # 1. RESIZE (Nếu ảnh quá to)
            if width > MAX_WIDTH:
                ratio = MAX_WIDTH / width
                new_height = int(height * ratio)
                img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                print(f"   ↘ Resize: {width}x{height} -> {MAX_WIDTH}x{new_height}")

            # 2. SAVE & COMPRESS (Ghi đè lên file cũ)
            # Nếu là JPEG
            if file_path.lower().endswith(('.jpg', '.jpeg')):
                img.save(file_path, "JPEG", quality=QUALITY, optimize=True)
            
            # Nếu là PNG (Giữ nền trong suốt)
            elif file_path.lower().endswith('.png'):
                # PNG nén bằng cách giảm cấp độ nén (compress_level) hoặc convert palette nếu cần
                # Ở đây dùng optimize=True cho PNG
                img.save(file_path, "PNG", optimize=True)

            print(f"✅ Đã tối ưu: {os.path.basename(file_path)}")

    except Exception as e:
        print(f"❌ Lỗi file {file_path}: {e}")

def main():
    print("🚀 BẮT ĐẦU TỐI ƯU HÓA ẢNH CHO AR...")
    print(f"Tiêu chuẩn: Max Width {MAX_WIDTH}px | Quality {QUALITY}")
    print("-" * 50)

    for folder in TARGET_FOLDERS:
        # Chuyển đổi đường dẫn cho phù hợp hệ điều hành (Windows/Mac/Linux)
        folder_path = os.path.normpath(folder)
        
        if not os.path.exists(folder_path):
            print(f"⚠️ Không tìm thấy thư mục: {folder_path}")
            continue

        print(f"\n📂 Đang quét thư mục: {folder_path}")
        
        # Duyệt tất cả file trong thư mục
        files = os.listdir(folder_path)
        count = 0
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                full_path = os.path.join(folder_path, file)
                optimize_image(full_path)
                count += 1
        
        if count == 0:
            print("   (Không có file ảnh nào)")

    print("\n" + "-" * 50)
    print("🎉 HOÀN TẤT! Hãy chạy lại web để xem tốc độ.")

if __name__ == "__main__":
    main()