# AI-ML-Developer-Profile

## 🚀 Giới thiệu
Portfolio AI/ML cá nhân với chatbot, công cụ quản lý prompts và trang thiệp mời tốt nghiệp (Graduation Invitation) có tìm kiếm khách mời, thiệp mời riêng cho từng khách, nền video, và logo trường đặt giữa cột phải.

## 📁 Cấu trúc dự án (rút gọn)
```
AIML Developer Profile/
├── api_server.py
├── app.py
├── package.json
├── requirements.txt
├── run_app.bat
├── public/
│   ├── data/
│   │   ├── info.json
│   │   ├── khach.json
│   │   └── prompts.json
│   ├── graduation/
│   │   └── graduation_invitation.html
│   ├── image/
│   │   ├── vien-vang.png
│   │   └── graduation/
│   │       └── logotruong.jpg
│   ├── video/
│   │   └── sparkle-background.mp4
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   └── ...
└── vercel.json
```

## ✨ Tính năng chính
- Trang Graduation với form tìm kiếm và điều hướng tới thiệp mời cá nhân của khách.
- Thiệp mời cá nhân có nền video ở cột trái, hiệu ứng mờ ở cột phải.
- Logo trường (public/image/graduation/logotruong.jpg) nằm giữa cột phải, dưới lớp blur và trên nền viền vàng (vien-vang.png).
- Hỗ trợ tên có dấu, điều hướng URL-encoded.

## ▶️ Chạy dự án (PowerShell)
1) Tạo và kích hoạt môi trường ảo Python:
```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
2) Cài đặt dependencies:
```
pip install -r requirements.txt
```
3) Chạy server:
```
python app.py
```
(hoặc chạy tệp `run_app.bat`)

## 🌐 Truy cập
- Trang chính: http://127.0.0.1:5000/graduation
- Thiệp mời cá nhân: http://127.0.0.1:5000/graduation/<tên-khách-URL-encoded>
  - Ví dụ: http://127.0.0.1:5000/graduation/Nguy%C3%AA%CC%89n%20Th%E1%BB%8B%20B

## 📦 Dữ liệu
- public/data/info.json: Thông tin người tốt nghiệp, cấu hình hiển thị.
- public/data/khach.json: Danh sách khách mời.

## 🧠 Memory Bank
Hệ thống tài liệu sống giúp duy trì ngữ cảnh dự án giữa các phiên làm việc.
- Vị trí: Thư mục `memory-bank/` tại root (tạo nếu chưa có).
- Tệp cốt lõi: projectbrief.md, productContext.md, activeContext.md, systemPatterns.md, techContext.md, progress.md.
- Nguyên tắc sử dụng: Đọc toàn bộ khi bắt đầu tác vụ; cập nhật activeContext.md và progress.md sau thay đổi quan trọng; ghi nhận patterns/kỹ thuật mới.

## 🚢 Triển khai
- vercel.json cung cấp cấu hình cho Vercel.
- Không commit secrets/keys; tối ưu tài nguyên tĩnh khi lên production.