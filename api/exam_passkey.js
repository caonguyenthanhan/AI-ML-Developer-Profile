import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const token = req.headers['x-admin-token'] || '';
      const adminToken = process.env.ADMIN_TOKEN || '';
      const passkey = await kv.get('exam_passkey');
      const exists = Boolean(passkey);
      if (token && adminToken && token === adminToken) {
        return res.status(200).json({ ok: true, exists, passkey: passkey || '' });
      }
      return res.status(200).json({ ok: true, exists });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const action = body.action || 'verify';

      if (action === 'set') {
        const token = req.headers['x-admin-token'] || '';
        const adminToken = process.env.ADMIN_TOKEN || '';
        if (adminToken && token !== adminToken) {
          return res.status(401).json({ ok: false, error: 'unauthorized' });
        }
        const passkey = (body.passkey || '').trim();
        if (!passkey) {
          return res.status(400).json({ ok: false, error: 'invalid_passkey' });
        }
        await kv.set('exam_passkey', passkey);
        return res.status(200).json({ ok: true, saved: true });
      }

      if (action === 'verify') {
        const pass = (body.pass || '').trim();
        const stored = await kv.get('exam_passkey');
        const valid = Boolean(stored) && stored === pass;
        return res.status(200).json({ ok: true, valid });
      }

      return res.status(400).json({ ok: false, error: 'unknown_action' });
    }

    res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'server_error' });
  }
}