import path from 'path';
import fs from 'fs/promises';

const TMP_FILE = path.join('/tmp', 'rsvps.json');
const STATIC_FILE = path.join(process.cwd(), 'public', 'data', 'rsvps.json');

async function readRsvps() {
  for (const f of [TMP_FILE, STATIC_FILE]) {
    try {
      const raw = await fs.readFile(f, 'utf8');
      const j = JSON.parse(raw || '[]');
      return Array.isArray(j) ? j : (Array.isArray(j?.rsvps) ? j.rsvps : []);
    } catch (_) {}
  }
  return [];
}

async function writeRsvps(list) {
  const out = JSON.stringify(list, null, 2);
  try {
    await fs.writeFile(TMP_FILE, out, 'utf8');
  } catch (_) {}
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  try {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(204).end();

    if (req.method === 'GET') {
      const list = await readRsvps();
      return res.status(200).json({ ok: true, data: list });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const body = req.body || {};
    const entry = {
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
    if (user && pass) {
      try {
        // Import động để tránh crash khi module không có trong dependencies
        const nodemailerMod = await import('nodemailer');
        const transporter = nodemailerMod.createTransport({
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
          to: user,
          subject,
          html,
        });
      } catch (e) {
        console.warn('Email send skipped or failed (nodemailer not installed?):', e);
      }
    }

    const list = await readRsvps();
    list.push(entry);
    await writeRsvps(list);
    return res.status(200).json({ ok: true, message: 'RSVP saved' });
  } catch (err) {
    console.error('RSVP API Error:', err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}