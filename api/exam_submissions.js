async function getKv() {
  try {
    const kvMod = await import('@vercel/kv');
    const kv = kvMod?.kv;
    const hasEnv = (process.env.KV_URL || process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN);
    if (!hasEnv) return null;
    return kv || null;
  } catch (_) {
    return null;
  }
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }
    const kv = await getKv();
    if (!kv) {
      return res.status(501).json({ ok: false, error: 'kv_not_configured' });
    }
    // Tránh cache phía client
    try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}

    const raw = await kv.lrange('exam_submissions', 0, -1);
    const items = (raw || []).map(x => {
      try { return JSON.parse(x); } catch (_) { return null; }
    }).filter(Boolean);
    items.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
    return res.status(200).json({ ok: true, items });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
};