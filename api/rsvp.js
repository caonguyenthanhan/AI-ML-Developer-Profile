// api/rsvp.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { name, email, attending, message, eventInfo } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Thiếu tên hoặc email." });
    }
    if (!eventInfo?.email) {
      return res.status(400).json({ success: false, message: "Thiếu email người nhận (info.email)." });
    }

    // Cấu hình SMTP (Gmail) — dùng App Password (không dùng mật khẩu thường)
    // Vào Google Account -> Security -> App passwords
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;">
        <h2>📩 RSVP mới</h2>
        <p><b>Tên khách:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Tham dự:</b> ${attending ? "✅ Có" : "❌ Không"}</p>
        <p><b>Lời nhắn:</b> ${message || "(Không có)"}</p>
        <hr>
        <p><b>Sự kiện:</b> ${eventInfo?.university || ""} – ${eventInfo?.date || ""}</p>
        <p><i>RSVP được gửi tự động từ website thiệp mời tốt nghiệp.</i></p>
      </div>
    `;

    const infoSent = await transporter.sendMail({
      from: `"Graduation RSVP" <${process.env.SENDER_EMAIL}>`,
      to: eventInfo.email, // email người nhận từ info.json/email
      subject: `🎓 RSVP mới từ ${name}`,
      html,
    });

    console.log("✅ RSVP email sent:", infoSent.messageId);
    return res.status(200).json({ success: true, message: "RSVP submitted and email sent." });
  } catch (error) {
    console.error("RSVP Server Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
