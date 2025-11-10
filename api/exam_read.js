module.exports = async (req, res) => {
  try {
    try { res.setHeader('Access-Control-Allow-Origin', '*'); } catch (_) {}
    try { res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); } catch (_) {}
    try { res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); } catch (_) {}
    try { res.setHeader('Content-Type', 'application/json'); } catch (_) {}
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    const hasEnv = (process.env.KV_URL || process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN);
    if (!hasEnv) {
      try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}
      return res.status(501).json({ ok: false, error: 'kv_not_configured' });
    }

    const kvMod = await import('@vercel/kv');
    const kv = kvMod?.kv || kvMod?.default || null;
    if (!kv) return res.status(500).json({ ok: false, error: 'kv_import_failed' });

    const id = (req.query?.id || req.query?.ID || '').toString();
    let record = null;
    if (id) {
      try {
        const r = await kv.get(`exam:${id}`);
        // r có thể là object nếu set object, hoặc string nếu set JSON;
        if (typeof r === 'string') {
          try { record = JSON.parse(r); } catch (_) { record = { _raw: r }; }
        } else {
          record = r;
        }
      } catch (e) {
        record = { error: e?.message || String(e) };
      }
    }

    let list = [];
    let rawList = [];
    try {
      rawList = await kv.lrange('exam_submissions', 0, 10);
      list = (rawList || []).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
    } catch (e) {
      rawList = []; list = []; 
    }

    try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}
    return res.status(200).json({ ok: true, id, record, listCount: list.length, list, rawCount: (rawList || []).length });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}