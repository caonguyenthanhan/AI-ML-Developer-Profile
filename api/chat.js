export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const userQuery = (body.userQuery || '').trim();
    const systemInstruction = (body.systemInstruction || '').trim();

    const allowedIpsRaw = (process.env.ALLOWED_IPS || '').trim();
    const allowedIps = allowedIpsRaw ? allowedIpsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
    const adminTokenEnv = (process.env.ADMIN_TOKEN || '').trim();
    const adminToken =
      (req.headers['x-admin-token'] || '').toString().trim() ||
      (body.adminToken || '').toString().trim() ||
      (((req.headers['authorization'] || '').toString().trim().toLowerCase().startsWith('bearer '))
        ? (req.headers['authorization'] || '').toString().trim().slice(7).trim()
        : '');

    const normalizeIp = (ip) => {
      if (!ip) return '';
      const first = ip.split(',')[0].trim();
      return first.startsWith('::ffff:') ? first.slice(7) : first;
    };
    const clientIp = normalizeIp(
      (req.headers['x-forwarded-for'] || '').toString() ||
      (req.headers['x-real-ip'] || '').toString() ||
      (req.socket && req.socket.remoteAddress ? req.socket.remoteAddress.toString() : '')
    );

    if (allowedIps.length > 0) {
      const okByToken = adminTokenEnv && adminToken && adminTokenEnv === adminToken;
      const okByIp = clientIp && allowedIps.includes(clientIp);
      if (!okByToken && !okByIp) {
        return res.status(403).json({ ok: false, error: 'forbidden', text: 'IP không được phép.' });
      }
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GENAI_API_KEY || '';
    if (!apiKey) {
      return res.status(501).json({ ok: false, error: 'missing_api_key', text: 'Máy chủ chưa cấu hình API key.' });
    }

    const modelName = process.env.MODEL_NAME || 'gemini-2.0-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: userQuery || 'Hi' }] }
      ]
    };
    if (systemInstruction) {
      payload.systemInstruction = { role: 'system', parts: [{ text: systemInstruction }] };
    }

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
