import path from 'path';
import fs from 'fs/promises';

// Chỉ đọc từ file tĩnh trong repo nếu tồn tại. Không ghi vào /tmp để tránh hiểu nhầm.
const STATIC_FILE = path.join(process.cwd(), 'public', 'data', 'rsvps.json');

async function readStaticRsvps() {
  try {
    const raw = await fs.readFile(STATIC_FILE, 'utf8');
    const j = JSON.parse(raw || '[]');
    return Array.isArray(j) ? j : (Array.isArray(j?.rsvps) ? j.rsvps : []);
  } catch (_) { return []; }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  try {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(204).end();

    if (req.method === 'GET') {
      const list = await readStaticRsvps();
      return res.status(200).json({ ok: true, data: list });
    }

    if (req.method === 'DELETE') {
      // Không hỗ trợ xoá vì API này không lưu trữ cục bộ.
      return res.status(501).json({ ok: false, error: 'Not Implemented' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const body = req.body || {};
    const entry = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`,
      name: body.name || '',
      email: body.email || '',
      attending: !!body.attending,
      message: body.message || '',
      timestamp: new Date().toISOString(),
    };

    if (!entry.name) {
      return res.status(400).json({ ok: false, error: 'Missing name' });
    }

    // Optional email notification via Gmail App Password
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    // Lấy địa chỉ nhận từ public/data/info.json nếu có, fallback về EMAIL_USER
    let recipient = user;
    try {
      const infoPath = path.join(process.cwd(), 'public', 'data', 'info.json');
      const infoRaw = await fs.readFile(infoPath, 'utf8');
      const infoObj = JSON.parse(infoRaw || '{}');
      if (infoObj && typeof infoObj.email === 'string' && infoObj.email.trim()) {
        recipient = infoObj.email.trim();
      }
    } catch (_) {}

    if (user && pass) {
      try {
        // Import động để tránh crash khi module không có trong dependencies
        const nodemailerMod = await import('nodemailer');
        const nodemailerLib = nodemailerMod.default || nodemailerMod;
        const transporter = nodemailerLib.createTransport({
          service: 'gmail',
          auth: { user, pass },
        });
        const subject = entry.attending ? `✅ ${entry.name} sẽ tham dự lễ tốt nghiệp` : `❌ ${entry.name} không thể tham dự`;
        const html = `
          <h2>${subject}</h2>
          <p><b>Tên khách:</b> ${entry.name}</p>
          <p><b>Email:</b> ${entry.email || '(không có)'}</p>
          <p><b>Trạng thái:</b> ${entry.attending ? 'Tham dự' : 'Không tham dự'}</p>
          ${entry.message ? `<p><b>Lời nhắn:</b> ${entry.message}</p>` : ''}
        `;
        await transporter.sendMail({
          from: `"Thiệp Mời Lễ Tốt Nghiệp" <${user}>`,
          to: recipient,
          subject,
          html,
        });
      } catch (e) {
        console.warn('Email send skipped or failed (nodemailer missing or unusable):', e?.message || e);
      }
    }

    // Không ghi dữ liệu vào /tmp hay filesystem. Lưu trữ bền vững được thực hiện ở client qua Firestore.
    return res.status(200).json({ ok: true, message: 'RSVP processed (email sent if configured)', id: entry.id });
  } catch (err) {
    console.error('RSVP API Error:', err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}