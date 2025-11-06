const path = require('path');
const fs = require('fs/promises');

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'rsvps.json');

async function readRsvps() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const j = JSON.parse(raw || '[]');
    return Array.isArray(j) ? j : (Array.isArray(j?.rsvps) ? j.rsvps : []);
  } catch (_) {
    return [];
  }
}

async function writeRsvps(list) {
  const out = JSON.stringify(list, null, 2);
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true }).catch(() => {});
  await fs.writeFile(DATA_FILE, out, 'utf8');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const list = await readRsvps();
    return res.status(200).json({ ok: true, data: list });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const entry = {
        name: body.name || '',
        email: body.email || '',
        attending: !!body.attending,
        message: body.message || '',
        timestamp: new Date().toISOString(),
      };
      const list = await readRsvps();
      list.push(entry);
      await writeRsvps(list);
      return res.status(200).json({ ok: true, message: 'RSVP saved' });
    } catch (e) {
      return res.status(500).json({ ok: false, error: String(e) });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
};