export default async function handler(req, res) {
  try {
    const setCors = () => {
      try {
        res.setHeader(
          "Access-Control-Allow-Origin",
          (process.env.CORS_ORIGIN || "*").toString(),
        );
        res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, X-Admin-Token",
        );
      } catch (_) {}
    };
    setCors();
    try {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
    } catch (_) {}

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "method_not_allowed" });
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const userQuery = (body.userQuery || "").toString().trim();
    const systemInstruction = (body.systemInstruction || "").toString().trim();
    const rawModelName = (
      body.modelName ||
      process.env.MODEL_NAME ||
      "gemini-flash-latest"
    )
      .toString()
      .trim();
    const modelName = /^[a-zA-Z0-9._:-]+$/.test(rawModelName)
      ? rawModelName
      : "gemini-flash-latest";

    const allowedIpsRaw = (process.env.ALLOWED_IPS || "").trim();
    const allowedIps = allowedIpsRaw
      ? allowedIpsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const adminTokenEnv = (process.env.ADMIN_TOKEN || "").trim();
    const adminToken =
      (req.headers["x-admin-token"] || "").toString().trim() ||
      (body.adminToken || "").toString().trim() ||
      ((req.headers["authorization"] || "")
        .toString()
        .trim()
        .toLowerCase()
        .startsWith("bearer ")
        ? (req.headers["authorization"] || "").toString().trim().slice(7).trim()
        : "");

    const normalizeIp = (ip) => {
      if (!ip) return "";
      const first = ip.split(",")[0].trim();
      return first.startsWith("::ffff:") ? first.slice(7) : first;
    };
    const clientIp = normalizeIp(
      (req.headers["x-forwarded-for"] || "").toString() ||
        (req.headers["x-real-ip"] || "").toString() ||
        (req.socket && req.socket.remoteAddress
          ? req.socket.remoteAddress.toString()
          : ""),
    );

    const okByToken =
      adminTokenEnv && adminToken && adminTokenEnv === adminToken;

    if (allowedIps.length > 0) {
      const okByIp = clientIp && allowedIps.includes(clientIp);
      if (!okByToken && !okByIp) {
        return res
          .status(403)
          .json({ ok: false, error: "forbidden", text: "IP không được phép." });
      }
    }

    const maxChars = Math.max(
      200,
      parseInt(process.env.CHAT_MAX_CHARS || "6000", 10) || 6000,
    );
    if (userQuery.length > maxChars || systemInstruction.length > maxChars) {
      return res.status(413).json({
        ok: false,
        error: "payload_too_large",
        text: `Nội dung vượt quá giới hạn ${maxChars} ký tự.`,
      });
    }

    const rlMax = Math.max(
      1,
      parseInt(process.env.CHAT_RL_MAX_PER_WINDOW || "30", 10) || 30,
    );
    const rlWindowSec = Math.max(
      10,
      parseInt(process.env.CHAT_RL_WINDOW_SEC || "60", 10) || 60,
    );
    const rlKey = `rl:chat:${clientIp || "unknown"}`;

    const getKv = async () => {
      try {
        const kvMod = await import("@vercel/kv");
        const kv = kvMod?.kv || kvMod?.default || null;
        const hasEnv = Boolean(
          process.env.KV_URL ||
          process.env.KV_REST_API_URL ||
          process.env.KV_REST_API_TOKEN,
        );
        if (!hasEnv) return null;
        return kv || null;
      } catch (_) {
        return null;
      }
    };

    const checkRateLimit = async () => {
      if (okByToken) return { ok: true };
      const kv = await getKv();
      if (kv) {
        const count = await kv.incr(rlKey);
        if (count === 1) {
          try {
            await kv.expire(rlKey, rlWindowSec);
          } catch (_) {}
        }
        if (count > rlMax) {
          return { ok: false, retryAfterSec: rlWindowSec };
        }
        return { ok: true };
      }

      const now = Date.now();
      const store =
        globalThis.__chat_rl_store || (globalThis.__chat_rl_store = new Map());
      const prev = store.get(rlKey);
      if (!prev || now >= prev.resetAt) {
        store.set(rlKey, { count: 1, resetAt: now + rlWindowSec * 1000 });
        return { ok: true };
      }
      const nextCount = prev.count + 1;
      store.set(rlKey, { count: nextCount, resetAt: prev.resetAt });
      if (nextCount > rlMax) {
        return {
          ok: false,
          retryAfterSec: Math.ceil((prev.resetAt - now) / 1000),
        };
      }
      return { ok: true };
    };

    const rl = await checkRateLimit();
    if (!rl.ok) {
      try {
        res.setHeader("Retry-After", String(rl.retryAfterSec || rlWindowSec));
      } catch (_) {}
      return res.status(429).json({
        ok: false,
        error: "rate_limited",
        text: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
      });
    }

    const apiKey =
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GENAI_API_KEY ||
      "";
    if (!apiKey) {
      return res.status(501).json({
        ok: false,
        error: "missing_api_key",
        text: "Máy chủ chưa cấu hình API key.",
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: userQuery || "Hi" }] }],
    };
    if (systemInstruction) {
      payload.systemInstruction = {
        role: "system",
        parts: [{ text: systemInstruction }],
      };
    }

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg =
        (data && data.error && data.error.message) ||
        `Gemini error ${resp.status}`;
      return res
        .status(resp.status)
        .json({ ok: false, error: "gemini_error", text: msg });
    }

    let text = "";
    try {
      const candidates = data.candidates || [];
      if (candidates.length > 0) {
        const parts = (candidates[0].content || {}).parts || [];
        if (parts.length > 0) {
          text = parts[0].text || "";
        }
      }
    } catch (_) {}

    if (!text) {
      text = "Không nhận được phản hồi từ mô hình.";
    }

    return res.status(200).json({ ok: true, text });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: "server_error",
      text: `Lỗi máy chủ: ${String(e)}`,
    });
  }
}
