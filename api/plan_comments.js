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
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, X-Plan-Token, X-Admin-Token, Authorization",
    );
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
  if (!g.__plan_comment_store) {
    g.__plan_comment_store = {
      byDay: new Map(),
      all: new Map(),
    };
  }
  return g.__plan_comment_store;
}

function normId(x) {
  const s = String(x || "").trim();
  return s.slice(0, 80);
}

module.exports = async function handler(req, res) {
  try {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();

    const planId = normId(req.query?.planId || req.body?.planId || "plan");
    const dayKey = normId(req.query?.dayKey || req.body?.dayKey || "");
    const wantAll =
      String(req.query?.all || "").trim() === "1" ||
      String(req.query?.all || "").toLowerCase() === "true";

    const kv = await getKv();
    const store = getStore();

    const dayListKey = `plan:comments:${planId}:${dayKey}`;
    const allListKey = `plan:comments:${planId}:all`;

    if (req.method === "GET") {
      if (wantAll) {
        if (kv) {
          const rawList = await kv.lrange(allListKey, 0, -1);
          const list = (rawList || []).map((x) => {
            try {
              return JSON.parse(x);
            } catch {
              return null;
            }
          });
          return json(res, 200, { ok: true, data: list.filter(Boolean), storage: "kv" });
        }
        const mem = store.all.get(planId) || [];
        return json(res, 200, { ok: true, data: mem, storage: "memory" });
      }

      if (!dayKey) {
        return json(res, 400, { ok: false, error: "missing_dayKey" });
      }

      if (kv) {
        const rawList = await kv.lrange(dayListKey, 0, -1);
        const list = (rawList || []).map((x) => {
          try {
            return JSON.parse(x);
          } catch {
            return null;
          }
        });
        return json(res, 200, { ok: true, data: list.filter(Boolean), storage: "kv" });
      }

      const mem = store.byDay.get(dayListKey) || [];
      return json(res, 200, { ok: true, data: mem, storage: "memory" });
    }

    if (req.method !== "POST") {
      return json(res, 405, { ok: false, error: "method_not_allowed" });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const commentTokenEnv = String(
      process.env.PLAN_COMMENT_TOKEN || process.env.PLAN_ADMIN_TOKEN || "",
    ).trim();
    const commentToken =
      String(req.headers["x-plan-token"] || "").trim() ||
      String(req.headers["x-admin-token"] || "").trim() ||
      String(body.planToken || "").trim() ||
      String(body.adminToken || "").trim() ||
      (String(req.headers["authorization"] || "")
        .trim()
        .toLowerCase()
        .startsWith("bearer ")
        ? String(req.headers["authorization"] || "").trim().slice(7).trim()
        : "");
    if (commentTokenEnv && commentTokenEnv !== commentToken) {
      return json(res, 403, { ok: false, error: "forbidden" });
    }

    const author = String(body.author || "").trim().slice(0, 60);
    const text = String(body.text || "").trim();
    const safePlanId = normId(body.planId || planId);
    const safeDayKey = normId(body.dayKey || dayKey);

    if (!safePlanId) return json(res, 400, { ok: false, error: "missing_planId" });
    if (!safeDayKey) return json(res, 400, { ok: false, error: "missing_dayKey" });
    if (!text) return json(res, 400, { ok: false, error: "missing_text" });
    if (text.length > 2000) return json(res, 413, { ok: false, error: "text_too_long" });

    const entry = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      planId: safePlanId,
      dayKey: safeDayKey,
      author: author || "Leader",
      text,
      createdAt: new Date().toISOString(),
    };

    const safeDayListKey = `plan:comments:${safePlanId}:${safeDayKey}`;
    const safeAllListKey = `plan:comments:${safePlanId}:all`;

    if (kv) {
      await kv.rpush(safeDayListKey, JSON.stringify(entry));
      await kv.rpush(safeAllListKey, JSON.stringify(entry));
      return json(res, 200, { ok: true, data: entry, persisted: true, storage: "kv" });
    }

    const dayArr = store.byDay.get(safeDayListKey) || [];
    dayArr.push(entry);
    store.byDay.set(safeDayListKey, dayArr);
    const allArr = store.all.get(safePlanId) || [];
    allArr.push(entry);
    store.all.set(safePlanId, allArr);
    return json(res, 200, { ok: true, data: entry, persisted: false, storage: "memory" });
  } catch (e) {
    return json(res, 500, { ok: false, error: "server_error", text: String(e?.message || e) });
  }
};
