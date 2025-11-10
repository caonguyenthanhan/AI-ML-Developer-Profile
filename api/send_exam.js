// api/send_exam.js
// Serverless function on Vercel to email exam submissions

const path = require('path');

async function getKv() {
  try {
    const kvMod = await import('@vercel/kv');
    const kv = kvMod?.kv;
    return kv || null;
  } catch (_) {
    return null;
  }
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const body = req.body || {};
    const submission = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`,
      score: Number(body.score || 0),
      totalMcq: Number(body.totalMcq || 0),
      answers: body.answers || {},
      code7: String(body.code7 || ''),
      code8: String(body.code8 || ''),
      pageUrl: String(body.pageUrl || ''),
      userAgent: String(body.userAgent || ''),
      timestamp: new Date().toISOString(),
    };

    // Prepare email content
    const answersHtml = Object.keys(submission.answers || {})
      .map(k => `<li><b>${k}:</b> ${submission.answers[k] || '(chưa chọn)'}</li>`)
      .join('');

    const html = `
      <h2>📨 Bài kiểm tra Tin học 10</h2>
      <p><b>Điểm trắc nghiệm:</b> ${submission.score}/${submission.totalMcq}</p>
      <p><b>Thời gian nộp:</b> ${submission.timestamp}</p>
      ${submission.pageUrl ? `<p><b>Trang:</b> ${submission.pageUrl}</p>` : ''}
      ${submission.userAgent ? `<p><b>Thiết bị:</b> ${submission.userAgent}</p>` : ''}
      <h3>Đáp án đã chọn</h3>
      <ul>${answersHtml}</ul>
      <h3>Code Câu 7</h3>
      <pre style="background:#111;color:#f8f8f2;padding:12px;border-radius:8px;white-space:pre-wrap">${escapeHtml(submission.code7 || '(Chưa làm bài)')}</pre>
      <h3>Code Câu 8</h3>
      <pre style="background:#111;color:#f8f8f2;padding:12px;border-radius:8px;white-space:pre-wrap">${escapeHtml(submission.code8 || '(Chưa làm bài)')}</pre>
    `;

    // Email configuration
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const recipient = 'caonguyenthanhan.aa@gmail.com';

    let emailSent = false;
    let emailError = '';
    if (user && pass) {
      try {
        const nodemailerMod = await import('nodemailer');
        const nodemailerLib = nodemailerMod.default || nodemailerMod;
        const transporter = nodemailerLib.createTransport({
          service: 'gmail',
          auth: { user, pass },
        });
        await transporter.sendMail({
          from: `"Bài Kiểm Tra Tin Học" <${user}>`,
          to: recipient,
          subject: `Bài kiểm tra Tin học 10 - Điểm ${submission.score}/${submission.totalMcq}`,
          html,
        });
        emailSent = true;
      } catch (e) {
        emailError = e?.message || String(e);
      }
    } else {
      emailError = 'EMAIL_USER/EMAIL_PASS chưa được cấu hình';
    }

    // Optional: persist to KV
    let persisted = false;
    let storage = 'none';
    try {
      const kv = await getKv();
      if (kv) {
        await kv.lpush('exam_submissions', JSON.stringify(submission));
        await kv.set(`exam:${submission.id}`, submission);
        persisted = true;
        storage = 'kv';
      }
    } catch (_) {}

    const status = emailSent ? 200 : 200; // return 200 to not break UX
    return res.status(status).json({ ok: true, emailSent, emailError, id: submission.id, persisted, storage });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}