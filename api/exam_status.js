export default async function handler(req, res) {
  try {
    const hasEnv = Boolean(process.env.KV_REST_API_URL) && Boolean(process.env.KV_REST_API_TOKEN);
    if (!hasEnv) {
      try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}
      return res.status(501).json({ ok: false, hasKV: false, error: 'kv_not_configured' });
    }

    const { kv } = await import('@vercel/kv');
    try { res.setHeader('Cache-Control', 'no-store'); } catch (_) {}

    const raw = await kv.lrange('exam_submissions', 0, -1);
    const items = (raw || []).map(x => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
    const count = items.length;
    const latest = count ? items[0] : null;
    return res.status(200).json({ ok: true, hasKV: true, count, latest });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}