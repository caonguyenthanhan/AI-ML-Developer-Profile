async function getKv() {
  try {
    const kvMod = await import("@vercel/kv");
    const kvRef = kvMod.kv || kvMod.default || null;
    const hasEnv =
      process.env.KV_URL ||
      process.env.KV_REST_API_URL ||
      process.env.KV_REST_API_TOKEN;
    if (kvRef && hasEnv) return kvRef;
    return null;
  } catch (_) {
    return null;
  }
}

function setCors(res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  } catch (_) {}
}

function json(res, status, payload) {
  try {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
  } catch (_) {}
  return res.status(status).json(payload);
}

function getStore() {
  const g = globalThis;
  if (!g.__plan_override_store) {
    g.__plan_override_store = new Map();
  }
  return g.__plan_override_store;
}

function normId(x) {
  const s = String(x || "").trim();
  return s.slice(0, 80);
}

module.exports = async function handler(req, res) {
  try {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "GET") return json(res, 405, { ok: false, error: "method_not_allowed" });

    const planId = normId(req.query?.planId || "plan");
    const kv = await getKv();
    const store = getStore();

    const key = `plan:override:${planId}`;

    if (kv) {
      const data = await kv.get(key);
      return json(res, 200, { ok: true, data: data || null, storage: "kv" });
    }

    return json(res, 200, { ok: true, data: store.get(key) || null, storage: "memory" });
  } catch (e) {
    return json(res, 500, { ok: false, error: "server_error", text: String(e?.message || e) });
  }
};

