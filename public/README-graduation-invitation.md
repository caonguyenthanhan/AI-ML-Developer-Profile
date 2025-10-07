# Website Thiệp Mời Tốt Nghiệp

Website thiệp mời tốt nghiệp được xây dựng bằng Next.js 15, cho phép tạo thiệp mời cá nhân hóa cho từng khách mời tham dự lễ tốt nghiệp.

## Tổng quan

Dự án này tạo ra một website thiệp mời tốt nghiệp chuyên nghiệp với:
- Trang chính hiển thị thông tin buổi lễ
- Thiệp mời cá nhân hóa cho từng khách mời
- Thiết kế đặc biệt cho khách VIP (cha mẹ, thầy cô)
- Tích hợp Google Maps để chỉ đường
- Responsive design cho mọi thiết bị

## Cây thư mục

\`\`\`
graduation-invitation/
├── app/                          # Thư mục ứng dụng Next.js
│   ├── graduation/               # Route chính của website
│   │   ├── page.tsx             # Trang chính - thông tin buổi lễ
│   │   └── [guest]/             # Dynamic route cho từng khách mời
│   │       ├── page.tsx         # Trang thiệp mời cá nhân
│   │       └── not-found.tsx    # Trang lỗi 404
│   ├── layout.tsx               # Layout chính (font, metadata)
│   ├── page.tsx                 # Trang chủ (redirect)
│   └── globals.css              # CSS toàn cục
│
├── data/                         # Dữ liệu JSON
│   ├── info.json                # Thông tin buổi lễ tốt nghiệp
│   └── khach.json               # Danh sách khách mời
│
├── public/                       # Tài nguyên tĩnh
│   └── images/                  # Thư mục hình ảnh
│       ├── logotruong.jpg       # Logo trường
│       ├── main.jpg             # Ảnh người tốt nghiệp
│       ├── map.jpg              # Ảnh bản đồ hội trường
│       ├── man.jpg              # Ảnh mặc định nam
│       └── women.jpg            # Ảnh mặc định nữ
│
├── components/                   # Components UI (shadcn/ui)
│   ├── ui/                      # Các component giao diện
│   └── theme-provider.tsx       # Provider cho theme
│
├── lib/                         # Thư viện tiện ích
│   └── utils.ts                 # Hàm tiện ích
│
└── hooks/                       # Custom React hooks
    ├── use-mobile.ts            # Hook kiểm tra mobile
    └── use-toast.ts             # Hook hiển thị toast
\`\`\`

## Cấu trúc dữ liệu

### 1. data/info.json - Thông tin buổi lễ

\`\`\`json
{
  "eventName": "Lễ Tốt Nghiệp",
  "graduateName": "Nguyễn Văn A",
  "university": "Đại học Kinh tế TP. Hồ Chí Minh",
  "universityShort": "UEH",
  "date": "15/06/2025",
  "time": "10:00 - 14:00",
  "venue": "Hội trường A",
  "address": "2 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh",
  "mapLink": "https://maps.google.com/?q=...",
  "quote": "Hành trình học vấn kết thúc, hành trình mới bắt đầu."
}
\`\`\`

### 2. data/khach.json - Danh sách khách mời

\`\`\`json
{
  "guests": [
    {
      "name": "Nguyễn Thị B",
      "title": "Bạn thân",
      "gender": "female",
      "image": "",
      "message": "Lời nhắn cá nhân...",
      "special": false
    }
  ]
}
\`\`\`

**Các trường dữ liệu:**
- `name`: Tên khách mời (bắt buộc)
- `title`: Danh xưng (Bạn thân, Cha, Mẹ, Thầy, Cô...)
- `gender`: Giới tính (`male` hoặc `female`) - để chọn ảnh mặc định
- `image`: Link ảnh khách mời (để trống sẽ dùng ảnh mặc định)
- `message`: Lời nhắn cá nhân (để trống sẽ dùng lời mời mặc định)
- `special`: `true` cho khách VIP (cha mẹ, thầy cô) - thiết kế đặc biệt

## Chức năng chính

### 1. Trang chính (/graduation)

**Hiển thị:**
- Tiêu đề "Happy Graduation" với font chữ Great Vibes
- Tên người tốt nghiệp và trường đại học
- Ảnh người tốt nghiệp
- Logo trường

**Thông tin buổi lễ:**
- Ngày giờ tổ chức
- Địa điểm (hội trường + địa chỉ đầy đủ)
- Bản đồ hội trường
- Nút "Xem chỉ đường" (link Google Maps)

**Danh sách khách mời:**
- Hiển thị tất cả khách mời
- Link đến trang thiệp mời riêng của từng người
- Phân biệt khách thường và khách đặc biệt

### 2. Trang thiệp mời cá nhân (/graduation/[tên-khách])

**URL động:**
- `/graduation/nguyen-thi-b` → Thiệp cho Nguyễn Thị B
- `/graduation/nguyen-van-d` → Thiệp cho Nguyễn Văn D

**Layout:**
- Bên trái: Ảnh người tốt nghiệp
- Bên phải: Ảnh khách mời (hoặc ảnh mặc định)

**Nội dung:**
- Tiêu đề "Thiệp Mời"
- "Kính gửi [Tên khách mời]"
- Lời nhắn cá nhân
- Thông tin chi tiết buổi lễ
- Nút "Xem bản đồ" và "Quay lại"

**Thiết kế phân biệt:**
- **Khách thường:** Nền trắng, viền xanh nhạt, thiết kế đơn giản
- **Khách đặc biệt:** Nền xanh đậm, viền vàng, font chữ trang trọng hơn

### 3. Trang 404

Hiển thị khi truy cập tên khách không tồn tại trong danh sách.

## Công nghệ sử dụng

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Fonts:** 
  - Great Vibes (tiêu đề)
  - Playfair Display (nội dung)
- **Icons:** Lucide React

## Tính năng nổi bật

1. **Dynamic Routing:** Mỗi khách mời có URL riêng dựa trên tên
2. **Responsive Design:** Tương thích mọi thiết bị
3. **Personalization:** Lời nhắn và thiết kế khác nhau cho từng khách
4. **Special Guest Design:** Thiết kế sang trọng cho khách VIP
5. **Google Maps Integration:** Link chỉ đường trực tiếp
6. **Default Images:** Tự động chọn ảnh mặc định theo giới tính
7. **SEO Friendly:** Metadata động cho từng trang

## Cách sử dụng

### Cài đặt

\`\`\`bash
# Clone repository
git clone [repository-url]

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Chạy production server
npm start
\`\`\`

### Thêm khách mời mới

Chỉnh sửa file `data/khach.json`:

\`\`\`json
{
  "guests": [
    {
      "name": "Tên khách mới",
      "title": "Danh xưng",
      "gender": "male",
      "image": "",
      "message": "Lời nhắn cá nhân",
      "special": false
    }
  ]
}
\`\`\`

### Cập nhật thông tin buổi lễ

Chỉnh sửa file `data/info.json` với thông tin mới.

### Thay đổi hình ảnh

Thay thế các file trong thư mục `public/images/`:
- `logotruong.jpg` - Logo trường
- `main.jpg` - Ảnh người tốt nghiệp
- `map.jpg` - Ảnh bản đồ hội trường
- `man.jpg` - Ảnh mặc định nam
- `women.jpg` - Ảnh mặc định nữ

## Màu sắc chủ đạo

- **Xanh dương chính:** `#3b82f6` (blue-500)
- **Xanh đậm:** `#1e3a8a` (blue-900) - cho khách đặc biệt
- **Vàng gold:** `#fbbf24` (amber-400) - viền khách đặc biệt
- **Nền:** Trắng với gradient xanh nhạt

## Ví dụ URL

- Trang chính: `https://your-domain.com/graduation`
- Thiệp khách thường: `https://your-domain.com/graduation/nguyen-thi-b`
- Thiệp khách đặc biệt: `https://your-domain.com/graduation/nguyen-van-d`

## Deployment

Website có thể deploy lên:
- Vercel (khuyến nghích - tích hợp tốt với Next.js)
- Netlify
- AWS Amplify
- Hoặc bất kỳ platform nào hỗ trợ Next.js

### Deploy lên Vercel

\`\`\`bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

## Biến môi trường

Thêm biến môi trường `NEXT_PUBLIC_BASE_URL` trong file `.env.local`:

\`\`\`
NEXT_PUBLIC_BASE_URL=https://your-domain.com
\`\`\`

## Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ trực tiếp.

## License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Chúc mừng tốt nghiệp! 🎓**
