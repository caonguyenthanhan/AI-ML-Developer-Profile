export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }
    const modelName = process.env.MODEL_NAME || 'gemini-2.0-flash';
    return res.status(200).json({ ok: true, modelName });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}