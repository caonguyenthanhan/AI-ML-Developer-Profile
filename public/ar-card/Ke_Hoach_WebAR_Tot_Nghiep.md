# **KẾ HOẠCH PHÁT TRIỂN: WEB AR CARD CHÚC MỪNG TỐT NGHIỆP**

Phong cách: Futuristic / Cyberpunk (Visual Feeder Style)  
Nền tảng: Web AR (MindAR \+ A-Frame)

## **I. TỔNG QUAN (OVERVIEW)**

Xây dựng một trải nghiệm thực tế tăng cường (AR) trên nền web, nơi người dùng sử dụng camera điện thoại quét vào tấm thiệp mời/tấm bằng tốt nghiệp vật lý để kích hoạt các nội dung số sống động. Mục tiêu là biến tấm thiệp tĩnh thành một màn trình diễn Hologram ấn tượng.

## **II. DANH SÁCH TÍNH NĂNG CHI TIẾT (DETAILED FEATURES)**

### **1\. Hệ thống Nhận diện & Theo dõi (Tracking Core)**

* **Chức năng:** Quét hình ảnh mục tiêu (Image Target).  
* **Mô tả:**  
  * Camera nhận diện tấm thiệp vật lý (độ trễ thấp \< 1s).  
  * Nội dung AR bám chặt (anchor) vào tấm thiệp dù người dùng di chuyển góc máy hay rung tay.  
  * **Yêu cầu:** Hình ảnh in trên thiệp cần có độ tương phản cao, nhiều chi tiết để tracking tốt nhất.

### **2\. Video Overlay (Hiệu ứng "Báo Phù Thủy")**

* **Chức năng:** Biến ảnh tĩnh trên thiệp thành video động.  
* **Mô tả:**  
  * Ngay khi nhận diện được thiệp, khu vực ảnh chân dung hoặc toàn bộ mặt thiệp sẽ được thay thế bằng một Video Loop (MP4).  
  * Video có độ trong suốt (opacity \~90%) để hòa trộn với vân giấy thật, tạo cảm giác như nội dung đang chiếu trên giấy.  
  * **Nội dung Video:** Cảnh ném mũ, cảnh bước lên bục nhận bằng, hoặc intro giới thiệu bản thân.

### **3\. Giao diện Nổi 3D (Floating UI & Animation)**

* **Chức năng:** Hiển thị thông tin cá nhân dạng Hologram.  
* **Mô tả:**  
  * Các dòng chữ (Tên, Chức danh Kỹ sư, GPA) không nằm bẹp trên giấy mà **bay lơ lửng** (trục Z \> 0).  
  * **Hiệu ứng xuất hiện:** Khi Tracking thành công, các thông tin này sẽ trượt từ trong ra ngoài (Slide-out animation) hoặc gõ máy chữ (Typewriter effect) kèm theo các đường Line neon kết nối với tấm thiệp.

### **4\. Tương tác Lật thẻ (Flip Card Interaction)**

* **Chức năng:** Xem nội dung mặt sau của thẻ ảo.  
* **Mô tả:**  
  * Trên giao diện AR có một nút ảo hoặc người dùng chạm trực tiếp vào mô hình 3D.  
  * Tấm thẻ ảo sẽ xoay 180 độ.  
  * **Mặt sau chứa:** Bảng điểm chi tiết, Lời chúc bí mật, hoặc QR Code dẫn đến CV online/Portfolio.

### **5\. Cảm biến Khoảng cách (Proximity Effect)**

* **Chức năng:** Phản hồi theo vị trí người dùng.  
* **Mô tả:**  
  * **Trạng thái xa (\>30cm):** Hiển thị giao diện gọn gàng, tổng quan.  
  * **Trạng thái gần (\<15cm):** Khi người dùng đưa điện thoại lại gần sát chi tiết, viền thẻ phát sáng (Glow effect), các hạt phân tử (particles) bay ra, hoặc hiện chi tiết ẩn (Easter Egg).

### **6\. Trình điều khiển Âm thanh (Smart Audio)**

* **Chức năng:** Nhạc nền đồng bộ.  
* **Mô tả:**  
  * Nhạc tự động phát khi vào trải nghiệm (cần người dùng tap lần đầu để bypass chính sách trình duyệt).  
  * Có nút Bật/Tắt nhạc 3D nằm lơ lửng trong không gian AR.  
  * Nhạc nhỏ dần hoặc tắt khi mất tracking (Target Lost).

### **7\. Tương tác Gallery (Slide ảnh)**

* **Chức năng:** Xem album ảnh kỷ yếu.  
* **Mô tả:**  
  * Hiển thị mũi tên điều hướng ảo bên cạnh thẻ.  
  * Người dùng bấm Next/Prev để thay đổi video/ảnh đang hiển thị trên mặt thẻ.

## **III. THIẾT KẾ UX/UI & ASSETS**

### **1\. Phong cách (Visual Style)**

* **Màu chủ đạo:** Đen (Black) & Xanh Cyan (\#00FFFF) hoặc Vàng Gold (cho sự trang trọng).  
* **Font chữ:**  
  * *Tiêu đề:* Rajdhani hoặc Orbitron (Nét vuông, công nghệ).  
  * *Nội dung:* Montserrat (Dễ đọc, hiện đại).  
* **Vật liệu 3D:** Glassmorphism (Kính mờ), Neon Light (Phát sáng).

### **2\. Yêu cầu Tài nguyên (Assets Needed)**

* **Ảnh Target:** File .jpg chất lượng cao của tấm thiệp thật.  
* **Video:** 01 file .mp4 (tỉ lệ khớp với vùng ảnh trên thiệp, \< 5MB, không âm thanh).  
* **Audio:** 01 file .mp3 (nhạc không lời, hào hùng hoặc cảm động).  
* **Icons:** File .png nền trong suốt (Icon FB, Web, Email, Nốt nhạc).

## **IV. LỘ TRÌNH KỸ THUẬT (IMPLEMENTATION STEPS)**

1. **Giai đoạn 1: Core Setup**  
   * Thiết lập MindAR \+ A-Frame.  
   * Tối ưu file targets.mind để nhận diện nhanh.  
   * Tạo khung HTML cơ bản.  
2. **Giai đoạn 2: Visual Development**  
   * Code phần a-video đè lên target.  
   * Xây dựng các a-entity chứa text, animation trượt (animation mixer).  
   * Tinh chỉnh màu sắc, ánh sáng (Lighting).  
3. **Giai đoạn 3: Interaction Logic (Javascript)**  
   * Viết component flip-card.  
   * Viết component proximity-trigger (tính khoảng cách Vector3).  
   * Xử lý sự kiện click/touch.  
4. **Giai đoạn 4: UI & Fixes**  
   * Thêm lớp HTML Overlay (nút Start, hướng dẫn).  
   * Sửa lỗi font tiếng Việt (dùng Google Fonts cho HTML layer, convert JSON font cho A-Frame layer).  
   * Test trên iOS (Safari) và Android (Chrome).

## **V. KỊCH BẢN TRẢI NGHIỆM NGƯỜI DÙNG (USER FLOW)**

1. **Truy cập:** Người dùng quét QR Code trên thiệp \-\> Mở trình duyệt.  
2. **Màn hình chờ:** Hiện nút "Start Experience" phong cách Cyberpunk.  
3. **Quét:** Người dùng đưa camera vào thiệp.  
4. **Kích hoạt (Wow Moment):**  
   * Nhạc nổi lên.  
   * Ảnh trên thiệp biến thành Video động.  
   * Tên và thông tin bay ra từ 2 bên cánh gà.  
5. **Tương tác:**  
   * Người dùng chạm vào ảnh \-\> Thẻ lật lại xem bảng điểm.  
   * Người dùng đưa máy lại gần \-\> Viền thẻ phát sáng đỏ.  
6. **Kết thúc:** Người dùng bấm nút ảo "Contact Me" \-\> Mở Facebook/LinkedIn của bạn.