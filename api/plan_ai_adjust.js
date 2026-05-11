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
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
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

function normId(x) {
  const s = String(x || "").trim();
  return s.slice(0, 80);
}

function extractJson(text) {
  const t = String(text || "");
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = t.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  try {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" });

    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const planTokenEnv = String(process.env.PLAN_ADMIN_TOKEN || "").trim();
    const planToken =
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
    if (planTokenEnv && planTokenEnv !== planToken) {
      return json(res, 403, { ok: false, error: "forbidden" });
    }

    const planId = normId(body.planId || "plan");
    const scheduleData = body.scheduleData;
    if (!Array.isArray(scheduleData)) {
      return json(res, 400, { ok: false, error: "missing_scheduleData" });
    }

    const rawModelName = String(body.modelName || process.env.MODEL_NAME || "gemini-flash-latest").trim();
    const modelName = /^[a-zA-Z0-9._:-]+$/.test(rawModelName) ? rawModelName : "gemini-flash-latest";

    const apiKey =
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GENAI_API_KEY ||
      "";
    if (!apiKey) {
      return json(res, 501, { ok: false, error: "missing_api_key", text: "Máy chủ chưa cấu hình API key." });
    }

    const kv = await getKv();
    let comments = Array.isArray(body.comments) ? body.comments : [];
    if (kv) {
      try {
        const rawList = await kv.lrange(`plan:comments:${planId}:all`, 0, -1);
        comments = (rawList || []).map((x) => {
          try {
            return JSON.parse(x);
          } catch {
            return null;
          }
        }).filter(Boolean);
      } catch (_) {}
    }

    const systemInstruction = [
      "Bạn là trợ lý PM cho lịch trình dự án.",
      "Bạn nhận: (1) scheduleData hiện tại, (2) danh sách comment theo từng ngày.",
      "Nhiệm vụ:",
      "A) Tổng hợp feedback thành summaryMarkdown (ngắn gọn, theo ngày, ưu tiên hành động).",
      "B) Điều chỉnh scheduleData để phản ánh feedback và tối ưu các ngày sau (có thể thêm/sửa/xoá task).",
      "Ràng buộc:",
      "- Giữ nguyên cấu trúc mảng scheduleData (week/period/days) và các trường date/day.",
      "- Không đổi định dạng dữ liệu; chỉ chỉnh nội dung tasks hoặc thêm task mới.",
      "- Chỉ trả về JSON thuần đúng schema: {\"summaryMarkdown\": string, \"scheduleData\": array}.",
      "- Không thêm giải thích ngoài JSON.",
    ].join("\n");

    const userQuery = JSON.stringify(
      {
        planId,
        scheduleData,
        comments,
      },
      null,
      2,
    );

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: userQuery }] }],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
    };

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
      const msg = (data && data.error && data.error.message) || `Gemini error ${resp.status}`;
      return json(res, resp.status, { ok: false, error: "gemini_error", text: msg });
    }

    let text = "";
    try {
      const candidates = data.candidates || [];
      if (candidates.length > 0) {
        const parts = (candidates[0].content || {}).parts || [];
        if (parts.length > 0) text = parts[0].text || "";
      }
    } catch (_) {}

    const parsed = extractJson(text);
    if (!parsed || !Array.isArray(parsed.scheduleData)) {
      return json(res, 200, { ok: true, parsed: false, text });
    }

    const override = {
      planId,
      updatedAt: new Date().toISOString(),
      summaryMarkdown: String(parsed.summaryMarkdown || "").trim(),
      scheduleData: parsed.scheduleData,
      commentCount: Array.isArray(comments) ? comments.length : 0,
      modelName,
    };

    if (kv) {
      await kv.set(`plan:override:${planId}`, override);
      return json(res, 200, { ok: true, parsed: true, data: override, storage: "kv" });
    }

    const g = globalThis;
    g.__plan_override_store = g.__plan_override_store || new Map();
    g.__plan_override_store.set(`plan:override:${planId}`, override);
    return json(res, 200, { ok: true, parsed: true, data: override, storage: "memory" });
  } catch (e) {
    return json(res, 500, { ok: false, error: "server_error", text: String(e?.message || e) });
  }
};
