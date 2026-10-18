# AI-ML-Developer-Profile — Cao Nguyễn Thành An (Aleian Cao)

## 🚀 Giới thiệu
Đây là website chuyên môn của **Cao Nguyễn Thành An (Aleian Cao)** — **AI Systems Architect / Automation Engineer** tại **INS Engineering**.
- **Định vị:** AI-First · Engineering-Driven · Product-Focused.
- **Trọng tâm kỹ thuật:** Multi-Agent Systems, GraphRAG, Agentic Workflows và tự động hóa quy trình kỹ thuật điện (PSCAD, PSS/E, ETAP).
- **Hệ sinh thái:** Trang hồ sơ & case study cá nhân, công cụ tạo CV chuẩn ATS, hệ thống học ngôn ngữ hình thái học (MorphoLearn), thư viện GenAI, và kênh sáng tạo Trạm Gật Gù.

Trang chủ: https://hethongthongminh.id.vn/

## 📁 Cấu trúc dự án (rút gọn)
```text
AIML Developer Profile/
├── api_server.py             # API phục vụ RSVP / endpoints phụ trợ
├── app.py                    # Flask app phục vụ bản Graduation local
├── package.json              # Cấu hình Node/Vercel, build Tailwind CSS
├── requirements.txt          # Dependencies Python cho app.py
├── run_app.bat / run_app.ps1 # Chạy server Flask bằng PowerShell
├── public/
│   ├── data/
│   │   ├── info.json         # Cấu hình sự kiện tốt nghiệp
│   │   ├── khach.json        # Danh sách khách mời
│   │   └── prompts.json      # Thư viện prompts GenAI
│   ├── graduation/
│   │   └── graduation_invitation.html
│   ├── CV Builder/
│   │   └── App Tạo CV Chuẩn ATS.html
│   ├── caonguyenthanhan/
│   │   └── cv.html           # Trang CV/portfolio chính
│   ├── image/
│   ├── video/
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   └── ...
└── vercel.json               # Cấu hình routes cho Vercel
```

## ✨ Tính năng chính

### 1. CV Builder chuẩn ATS (`/gen-cv`)
- Form tạo CV 2 cột, tối ưu cho ATS và bản in.
- Dữ liệu mẫu ẩn danh, gợi ý cách viết từng mục (summary, project, impact).
- Chỉnh nội dung theo thời gian thực, preview giống CV thật.
- Tuỳ chỉnh giao diện: tông màu chính, kiểu chữ, mật độ nội dung.
- Link mở bản CV Builder nâng cao trên sub-project riêng.

Truy cập:
- Production: https://hethongthongminh.id.vn/gen-cv

### 2. Graduation Invitation
- Landing page sự kiện tốt nghiệp với nền video, hiệu ứng blur, confetti.
- Tìm kiếm khách mời theo tên; thiệp mời riêng từng khách với URL-encoded.
- Hỗ trợ kết nối Firebase/Firestore để lưu RSVP, thống kê khách tham dự.
- Hỗ trợ fallback API `/api/rsvp` khi không dùng Firestore.

Truy cập local:
- Trang chính: http://127.0.0.1:5000/graduation
- Thiệp mời cá nhân: http://127.0.0.1:5000/graduation/<tên-khách-URL-encoded>

### 3. Thư viện Prompts GenAI
- Lưu trữ prompts kèm metadata và đường dẫn ảnh demo trong `public/data/prompts.json`.
- Phân loại theo chủ đề (portrait, fantasy, product, v.v.).
- Dùng làm nguồn cho các tool/landing page hiển thị gallery hình AI.

### 4. Trang CV / Portfolio chính
- Giao diện giới thiệu bản thân tại `public/caonguyenthanhan/cv.html` và `index.html`.
- Định vị chuyên môn: **AI Systems Architect / Automation Engineer** (Aleian Cao) tại **INS Engineering** (trước đây: **VNA GROUP**).
- Chuyên sâu: Multi-Agent Systems, GraphRAG, Agentic Workflows và tự động hóa quy trình kỹ thuật điện (PSCAD, PSS/E, ETAP).
- Các trang chuyên sâu: `/profile/aise` (AI Software Engineer), `/profile/as` (Automation Specialist), Bản đồ sao cá nhân (`/caonguyenthanhan/ban-do-sao-ca-nhan.html`).

## ▶️ Chạy server Graduation (local, PowerShell)
1. Tạo và kích hoạt môi trường ảo Python:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
2. Cài đặt dependencies:
```powershell
pip install -r requirements.txt
```
3. Chạy server Flask:
```powershell
python app.py
```
hoặc:
```powershell
.\run_app.bat
```

## 🌐 Triển khai trên Vercel
- Domain: https://hethongthongminh.id.vn/
- vercel.json cấu hình:
  - Route cho Graduation, API RSVP, assets.
  - Route `/gen-cv` trỏ tới `public/CV Builder/App Tạo CV Chuẩn ATS.html`.
- Không commit secrets/keys; cấu hình môi trường qua Vercel Environment Variables.

## 📦 Dữ liệu & cấu hình
- `public/data/info.json`: Thông tin sự kiện tốt nghiệp, thời gian, địa điểm, map, contact.
- `public/data/khach.json`: Danh sách khách mời, mã định danh cho từng thiệp.
- `public/data/prompts.json`: Thư viện prompts GenAI.

## 🧠 Memory Bank (cho quá trình phát triển)
- Thư mục gợi ý: `memory-bank/` tại root repo.
- Tệp cốt lõi:
  - `projectbrief.md`, `productContext.md`, `activeContext.md`,
  - `systemPatterns.md`, `techContext.md`, `progress.md`.
- Nguyên tắc:
  - Đọc toàn bộ khi bắt đầu một task mới.
  - Cập nhật `activeContext.md` và `progress.md` sau mỗi thay đổi lớn.
  - Ghi lại patterns/kỹ thuật có thể tái sử dụng giữa các feature.
