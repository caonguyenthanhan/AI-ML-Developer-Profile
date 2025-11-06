const path = require('path');
const fs = require('fs/promises');

// Helper: chỉ import KV khi cần để tránh lỗi top-level await/initialization
async function getKv() {
  try {
    const kvMod = await import('@vercel/kv');
    const kvRef = kvMod.kv || kvMod.default || null;
    const hasEnv = (process.env.KV_URL || process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN);
    if (kvRef && hasEnv) return kvRef;
    return null;
  } catch (_) {
    return null;
  }
}

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

module.exports = async function handler(req, res) {
  try {
    setCors(res);
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(204).end();

    if (req.method === 'GET') {
      // Ưu tiên đọc dữ liệu từ Vercel KV nếu được cấu hình
      let storage = 'none';
      try {
        const kv = await getKv();
        if (kv) {
          const rawList = await kv.lrange('rsvps', 0, -1);
          const list = (rawList || []).map(x => {
            try { return JSON.parse(x); } catch { return x; }
          });
          storage = 'kv';
          return res.status(200).json({ ok: true, data: list, storage });
        }
      } catch (e) {
        // fallback xuống static file nếu KV lỗi hoặc chưa cấu hình
        console.warn('KV GET fallback:', e?.message || e);
      }
      const list = await readStaticRsvps();
      return res.status(200).json({ ok: true, data: list, storage });
    }

    if (req.method === 'DELETE') {
      try {
        const kv = await getKv();
        if (!kv) {
          return res.status(501).json({ ok: false, error: 'Delete requires KV configured' });
        }
        const { id, timestamp } = req.body || {};
        const rawList = await kv.lrange('rsvps', 0, -1);
        const list = (rawList || []).map(x => { try { return JSON.parse(x); } catch { return x; } });
        const filtered = list.filter(item => {
          const itemId = item?.id || '';
          const ts = item?.timestamp || '';
          if (id) return itemId !== id;
          if (timestamp) return ts !== timestamp;
          return true; // nếu không có tiêu chí, không xóa gì
        });
        // rebuild list
        await kv.del('rsvps');
        if (filtered.length) {
          await kv.rpush('rsvps', ...filtered.map(x => JSON.stringify(x)));
        }
        if (id) await kv.del(`rsvp:${id}`);
        return res.status(200).json({ ok: true, deleted: (list.length - filtered.length) });
      } catch (e) {
        console.warn('KV DELETE failed:', e?.message || e);
        return res.status(500).json({ ok: false, error: 'Delete failed' });
      }
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

    // Lưu bền vào Vercel KV nếu có cấu hình
    let persisted = false;
    let storage = 'none';
    try {
      const kv = await getKv();
      if (kv) {
        await kv.lpush('rsvps', JSON.stringify(entry));
        await kv.set(`rsvp:${entry.id}`, entry);
        persisted = true;
        storage = 'kv';
      }
    } catch (e) {
      console.warn('KV POST store failed:', e?.message || e);
    }

    // Không ghi dữ liệu vào /tmp hay filesystem.
    return res.status(200).json({ ok: true, message: 'RSVP processed (email sent if configured)', id: entry.id, persisted, storage });
  } catch (err) {
    console.error('RSVP API Error:', err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}