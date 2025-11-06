// /api/rsvp.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ success: false, error: "Method not allowed" });

    const { name, email, attending, message, eventInfo } = req.body || {};

    if (!name)
      return res.status(400).json({ success: false, error: "Missing name" });

    // 📨 Gửi email qua Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = attending
      ? `✅ ${name} sẽ tham dự lễ tốt nghiệp`
      : `❌ ${name} không thể tham dự`;

    const html = `
      <h2>${subject}</h2>
      <p><b>Tên khách:</b> ${name}</p>
      <p><b>Email:</b> ${email || "(không có)"}</p>
      <p><b>Trạng thái:</b> ${attending ? "Tham dự" : "Không tham dự"}</p>
      ${message ? `<p><b>Lời nhắn:</b> ${message}</p>` : ""}
      ${eventInfo ? `<hr><p><b>Sự kiện:</b> ${eventInfo.university || ""} - ${eventInfo.date || ""}</p>` : ""}
    `;

    await transporter.sendMail({
      from: `"Thiệp Mời Lễ Tốt Nghiệp" <${process.env.EMAIL_USER}>`,
      to: eventInfo?.email || process.env.EMAIL_USER,
      subject,
      html,
    });

    return res.status(200).json({ success: true, message: "RSVP email sent successfully" });

  } catch (error) {
    console.error("RSVP API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
