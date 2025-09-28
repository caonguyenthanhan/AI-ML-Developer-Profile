const { GEMINI_API_KEY } = process.env;

// Tên model được xác định (ví dụ: gemini-2.5-flash-preview-05-20)
const MODEL_NAME = 'gemini-2.5-flash-preview-05-20'; 
const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Xử lý yêu cầu POST từ chatbot ở client.
 * Yêu cầu này chạy trên Vercel, nơi GEMINI_API_KEY được bảo mật.
 */
module.exports = async (req, res) => {
    // Chỉ chấp nhận phương thức POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Đảm bảo API Key đã được cấu hình
    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set in environment variables.");
        return res.status(500).json({ error: "API Key chưa được cấu hình trên máy chủ." });
    }

    try {
        // Nhận dữ liệu từ client
        const { userQuery, systemInstruction } = req.body;

        if (!userQuery || !systemInstruction) {
            return res.status(400).json({ error: "Thiếu tham số truy vấn." });
        }
        
        // Định dạng payload theo yêu cầu của API Gemini
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
        };

        // Gọi API của Google một cách bảo mật
        const geminiResponse = await fetch(GOOGLE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await geminiResponse.json();

        // Trích xuất và trả về kết quả cho client
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể tìm thấy thông tin phản hồi từ AI.";

        // Thiết lập header CORS để cho phép client side truy cập
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.setHeader('Content-Type', 'application/json');
        
        return res.status(200).json({ text: text });

    } catch (error) {
        console.error("Lỗi Gemini API hoặc Proxy:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi nội bộ trên máy chủ." });
    }
};
