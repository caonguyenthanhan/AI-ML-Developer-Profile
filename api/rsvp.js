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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
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

    if (req.method === 'DELETE') {
      const body = req.body || {};
      const id = body.id || '';
      const ts = body.timestamp || '';
      const list = await readRsvps();
      const before = list.length;
      const filtered = list.filter(x => {
        if (id && x.id) return x.id !== id;
        if (ts && x.timestamp) return x.timestamp !== ts;
        return true;
      });
      if (filtered.length === before) {
        return res.status(404).json({ ok: false, error: 'Not found' });
      }
      await writeRsvps(filtered);
      return res.status(200).json({ ok: true, message: 'RSVP deleted' });
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
          to: user,
          subject,
          html,
        });
      } catch (e) {
        console.warn('Email send skipped or failed (nodemailer missing or unusable):', e?.message || e);
      }
    }

    const list = await readRsvps();
    list.push(entry);
    await writeRsvps(list);
    return res.status(200).json({ ok: true, message: 'RSVP saved', id: entry.id });
  } catch (err) {
    console.error('RSVP API Error:', err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}