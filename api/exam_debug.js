module.exports = async (req, res) => {
  try {
    try { res.setHeader('Access-Control-Allow-Origin', '*'); } catch (_) {}
    try { res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS'); } catch (_) {}
    try { res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-token'); } catch (_) {}
    try { res.setHeader('Content-Type', 'application/json'); } catch (_) {}
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    const token = req.headers['x-admin-token'] || '';
    const adminToken = process.env.ADMIN_TOKEN || '';
    if (!adminToken || token !== adminToken) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    const hasEnv = (process.env.KV_URL || process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN);
    if (!hasEnv) {
      try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}
      return res.status(501).json({ ok: false, error: 'kv_not_configured' });
    }

    const kvMod = await import('@vercel/kv');
    const kv = kvMod?.kv || kvMod?.default || null;
    if (!kv) return res.status(500).json({ ok: false, error: 'kv_import_failed' });

    const now = new Date().toISOString();
    const entry = { id: `debug-${Date.now()}`, test: true, timestamp: now };
    let persisted = false, error = '';
    try {
      await kv.lpush('exam_submissions', JSON.stringify(entry));
      await kv.set(`exam:${entry.id}`, JSON.stringify(entry));
      persisted = true;
    } catch (e) { error = e?.message || String(e); }
    try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}
    return res.status(200).json({ ok: true, persisted, error });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}