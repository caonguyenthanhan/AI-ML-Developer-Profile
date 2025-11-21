export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const userQuery = (body.userQuery || '').trim();
    const systemInstruction = (body.systemInstruction || '').trim();

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GENAI_API_KEY || '';
    if (!apiKey) {
      return res.status(501).json({ ok: false, error: 'missing_api_key', text: 'Máy chủ chưa cấu hình API key.' });
    }

    const modelName = process.env.MODEL_NAME || 'gemini-2.0-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    const payload = {
      contents: [
        { parts: [{ text: systemInstruction }] },
        { parts: [{ text: userQuery || 'Hi' }] }
      ]
    };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = (data && data.error && data.error.message) || `Gemini error ${resp.status}`;
      return res.status(resp.status).json({ ok: false, error: 'gemini_error', text: msg });
    }

    let text = '';
    try {
      const candidates = data.candidates || [];
      if (candidates.length > 0) {
        const parts = (candidates[0].content || {}).parts || [];
        if (parts.length > 0) {
          text = parts[0].text || '';
        }
      }
    } catch (_) {}

    if (!text) {
      text = 'Không nhận được phản hồi từ mô hình.';
    }

    return res.status(200).json({ ok: true, text });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'server_error', text: `Lỗi máy chủ: ${String(e)}` });
  }
}
