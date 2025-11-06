// /api/rsvp.js
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

const RSVPS_FILE = path.join(process.cwd(), "public", "data", "rsvps.json");

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      try {
        const raw = await fs.readFile(RSVPS_FILE, "utf8").catch(() => null);
        let list = [];
        if (raw) {
          const j = JSON.parse(raw);
          list = Array.isArray(j) ? j : (Array.isArray(j?.rsvps) ? j.rsvps : []);
        }
        return res.status(200).json({ success: true, rsvps: list });
      } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
      }
    }

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

    try {
      const raw = await fs.readFile(RSVPS_FILE, "utf8").catch(() => null);
      let list = [];
      if (raw) {
        const j = JSON.parse(raw);
        list = Array.isArray(j) ? j : (Array.isArray(j?.rsvps) ? j.rsvps : []);
      }
      list.push({ name, email, attending, message, eventInfo, timestamp: new Date().toISOString() });
      const outputIsArray = raw ? Array.isArray(JSON.parse(raw)) : true;
      const out = outputIsArray ? JSON.stringify(list, null, 2) : JSON.stringify({ rsvps: list }, null, 2);
      await fs.writeFile(RSVPS_FILE, out, "utf8");
    } catch (e) {
      console.warn("Failed to persist RSVP:", e);
    }

    return res.status(200).json({ success: true, message: "RSVP email sent successfully" });

  } catch (error) {
    console.error("RSVP API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
