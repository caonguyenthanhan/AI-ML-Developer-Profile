module.exports = async (req, res) => {
  try {
    try { res.setHeader('Access-Control-Allow-Origin', '*'); } catch (_) {}
    try { res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS'); } catch (_) {}
    try { res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); } catch (_) {}
    try { res.setHeader('Content-Type', 'application/json'); } catch (_) {}

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method === 'HEAD') return res.status(204).end();
    if (req.method !== 'GET') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const hasEnv = Boolean(process.env.KV_URL || process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN);
    if (!hasEnv) {
      try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}
      return res.status(501).json({ ok: false, hasKV: false, error: 'kv_not_configured' });
    }

    const kvMod = await import('@vercel/kv');
    const kv = kvMod?.kv || kvMod?.default || null;
    if (!kv) return res.status(500).json({ ok: false, error: 'kv_import_failed' });

    try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}
    const raw = await kv.lrange('exam_submissions', 0, -1);
    const items = (raw || []).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
    const count = items.length;
    const latest = count ? items[0] : null;
    return res.status(200).json({ ok: true, hasKV: true, count, latest, storage: 'kv' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
};