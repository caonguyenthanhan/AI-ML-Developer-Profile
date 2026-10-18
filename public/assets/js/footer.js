// Footer Component với Chat Box tích hợp
document.addEventListener('DOMContentLoaded', function() {
    // Tạo Footer HTML
    const footerHTML = `
        <!-- FOOTER -->
        <footer class="bg-gradient-to-r from-indigo-700 to-purple-700 text-white mt-12">
            <div class="max-w-6xl mx-auto px-4 py-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Thông tin liên hệ -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold flex items-center">
                            <i data-lucide="user" class="w-5 h-5 mr-2"></i>
                            Cao Nguyễn Thành An (Aleian Cao)
                        </h3>
                        <p class="text-sm text-indigo-100 font-medium">AI Systems Architect / Automation Engineer</p>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <i data-lucide="mail" class="w-4 h-4 mr-2 text-indigo-300"></i>
                                <span>caonguyenthanhan.aaa@gmail.com</span>
                            </div>
                            <div class="flex items-center">
                                <i data-lucide="phone" class="w-4 h-4 mr-2 text-indigo-300"></i>
                                <span>Số điện thoại Cao Nguyễn Thành An là <a href="tel:+84929620697" class="underline decoration-indigo-300 hover:text-white transition duration-300">0929620697</a></span>
                            </div>
                            <div class="flex items-center">
                                <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-indigo-300"></i>
                                <span>Ho Chi Minh City, Vietnam</span>
                            </div>
                        </div>
                    </div>

                    <!-- Liên kết nhanh -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold flex items-center">
                            <i data-lucide="link" class="w-5 h-5 mr-2"></i>
                            Liên Kết Nhanh
                        </h3>
                        <div class="space-y-2 text-sm">
                            <a href="/" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="home" class="w-4 h-4 mr-2 inline"></i>
                                Trang chủ
                            </a>
                            <a href="/caonguyenthanhan" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="user-circle" class="w-4 h-4 mr-2 inline"></i>
                                Thông tin
                            </a>
                            <a href="/ai_welcome" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="brain" class="w-4 h-4 mr-2 inline"></i>
                                AI Welcome
                            </a>
                            <a href="/genai" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="sparkles" class="w-4 h-4 mr-2 inline"></i>
                                Gen AI
                            </a>
                            <a href="/gen-cv" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="file-text" class="w-4 h-4 mr-2 inline"></i>
                                Gen CV
                            </a>
                            <a href="/extensions" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="puzzle" class="w-4 h-4 mr-2 inline"></i>
                                Extensions
                            </a>
                            <a href="/education" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="graduation-cap" class="w-4 h-4 mr-2 inline"></i>
                                Education
                            </a>
                            <a href="https://www.youtube.com/@tramgatgu" target="_blank" rel="noopener noreferrer" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="youtube" class="w-4 h-4 mr-2 inline"></i>
                                YouTube
                            </a>
                        </div>
                    </div>

                    <!-- Mạng xã hội -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold flex items-center">
                            <i data-lucide="share-2" class="w-5 h-5 mr-2"></i>
                            Kết Nối
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            <a href="https://github.com/caonguyenthanhan" target="_blank" rel="noopener noreferrer"
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300" title="GitHub">
                                <i data-lucide="github" class="w-5 h-5"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/th%C3%A0nh-an-cao-nguy%E1%BB%85n-b97b23322/" target="_blank" rel="noopener noreferrer"
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300" title="LinkedIn">
                                <i data-lucide="linkedin" class="w-5 h-5"></i>
                            </a>
                            <a href="https://www.youtube.com/@tramgatgu" target="_blank" rel="noopener noreferrer"
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300" title="YouTube Trạm Gật Gù">
                                <i data-lucide="youtube" class="w-5 h-5"></i>
                            </a>
                            <a href="https://www.facebook.com/nguyenthanhan.cao/" target="_blank" rel="noopener noreferrer"
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300" title="Facebook">
                                <i data-lucide="facebook" class="w-5 h-5"></i>
                            </a>
                            <a href="mailto:caonguyenthanhan.aaa@gmail.com" 
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300" title="Email">
                                <i data-lucide="mail" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Copyright -->
                <div class="border-t border-indigo-600 mt-6 pt-4 text-center text-sm text-indigo-200">
                    <p>&copy; 2026 Cao Nguyễn Thành An. AI-First · Engineering-Driven · Product-Focused.</p>
                </div>
            </div>
        </footer>

        <!-- CHATBOT WIDGET -->
        <button id="chat-toggle" class="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 z-50">
            <i data-lucide="message-square" class="w-6 h-6"></i>
        </button>

        <div id="chat-widget" class="fixed bottom-2 right-2 z-50 w-90 max-w-sm h-96 flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-indigo-200 transform translate-y-full opacity-0 invisible transition-all duration-300 ease-in-out">
            <div class="bg-indigo-600 text-white p-3 flex justify-between items-center">
                <h3 class="font-semibold text-base flex items-center">
                     <i data-lucide="sparkles" class="w-4 h-4 mr-2 text-yellow-300"></i> AI CV Assistant
                </h3>
                <button id="chat-close" class="p-1 rounded-full hover:bg-indigo-700">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            
            <div id="chat-messages" class="flex-grow p-4 space-y-4 overflow-y-auto scroll-smooth">
                <!-- Initial Message -->
                <div class="flex justify-start">
                    <div class="bg-indigo-100 text-gray-800 p-3 rounded-xl rounded-tl-none max-w-xs text-sm shadow-md">
                        Chào bạn! Tôi là Minh, trợ lý AI của bạn An, tôi có thể trả lời các câu hỏi về trình độ của Cao Nguyễn Thành An.
                    </div>
                </div>
            </div>
            
            <div class="p-3 border-t border-gray-200 flex space-x-2">
                <input type="text" id="chat-input" placeholder="Hỏi về kinh nghiệm AI..." class="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <button id="chat-send" class="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition duration-300">
                    <i data-lucide="send" class="w-5 h-5"></i>
                </button>
            </div>
        </div>

        <!-- CSS Styles cho Chat Widget -->
        <style>
            #chat-widget.open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .w-90 {
                width: 22rem;
            }
            
            .h-96 {
                height: 32rem;
            }
        </style>
    `;

    // Thêm Footer vào cuối body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Khởi tạo Lucide Icons cho footer
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Chat Box Logic
    initializeChatBox();
});

function initializeChatBox() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    try { var s1=document.createElement('script'); s1.src='https://cdn.jsdelivr.net/npm/marked/marked.min.js'; document.head.appendChild(s1); var s2=document.createElement('script'); s2.src='https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js'; document.head.appendChild(s2); } catch(_) {}
    
    // API Configuration
    const proxyUrl = '/api/chat'; 
    let MODEL_NAME = 'gemini-2.0-flash';
    try {
        fetch('/api/config').then(r=>r.json()).then(c=>{ if (c && c.modelName) { MODEL_NAME = c.modelName; } });
    } catch (_) {}

    // CV Context cho AI Assistant
    const cvContext = `
        Hồ sơ năng lực của Cao Nguyễn Thành An (Aleian Cao), AI Systems Architect / Automation Engineer.

        Định Vị Chuyên Môn:
        AI-First · Engineering-Driven · Product-Focused.
        Chuyên thiết kế và triển khai Multi-Agent Systems, GraphRAG, Agentic Workflows và tự động hóa quy trình kỹ thuật điện (PSCAD, PSS/E, ETAP). Tập trung vào kiến trúc AI thực tế, system evaluation, LLMOps, độ tin cậy và giải quyết bài toán nghiệp vụ.

        Thông Tin Cá Nhân & Liên Hệ:
        - Họ tên: Cao Nguyễn Thành An (Aleian Cao / Aleian)
        - Vị trí hiện tại: AI Systems Architect / Automation Engineer
        - Công ty hiện tại: INS Engineering
        - Kinh nghiệm trước đây: AI Engineer tại VNA GROUP
        - Địa điểm: Ho Chi Minh City, Vietnam
        - Email: caonguyenthanhan.aaa@gmail.com
        - Điện thoại: 0929 620 697
        - GitHub: https://github.com/caonguyenthanhan
        - LinkedIn: https://www.linkedin.com/in/thành-an-cao-nguyễn-b97b23322/
        - YouTube: https://www.youtube.com/@tramgatgu (Trạm Gật Gù - YouTube về tâm lý học tích cực, phát triển bản thân và âm nhạc AI)
        - Website: https://hethongthongminh.id.vn/

        Học Vấn:
        - HCMUTE — AI / Information Technology (Information Systems & AI), Đại học Sư phạm Kỹ thuật TP. HCM (08/2021 – 04/2025).

        Kỹ Năng Nòng Cốt:
        - AI: LangGraph, LangChain/LCEL, LlamaIndex, DSPy, Multi-Agent, GraphRAG, Neo4j, Memgraph, Qdrant, RAGAS.
        - Backend: Python, Pydantic v2, FastAPI, vLLM, PyTorch.
        - Frontend: React, TypeScript, Next.js, Tailwind CSS.
        - Other: Supabase, Docker, PowerShell, Engineering Automation (PSCAD, PSS/E, ETAP), Git.

        Kinh Nghiệm Làm Việc:
        - 01/2026 – Hiện tại: AI Systems Architect / Automation Engineer tại INS Engineering (Công ty hiện tại).
          + Tự động hóa quy trình thao tác trên các phần mềm kỹ thuật điện (PSS/E, PSCAD, ETAP...), xử lý dữ liệu mô phỏng và tự động hóa tạo báo cáo.
          + Thiết kế quy trình tự động hóa luồng công việc nội bộ và xây dựng công cụ với giao diện tối giản (1-2 thao tác) cho đội ngũ kỹ sư điện.
          + Triển khai các giải pháp AI tuân thủ bảo mật nội bộ, nghiên cứu triển khai Local LLMs hỗ trợ kỹ thuật và chuẩn hóa hệ thống quản trị mã nguồn.
        - 09/2025 – 12/2025: AI Software Engineer tại VNA GROUP (Kinh nghiệm trước đây).
          + Phát triển hệ thống Multi-Agent (LangGraph) tự động hóa quy trình báo cáo và phân tích số liệu.
          + Thiết kế kiến trúc luồng xử lý: Router → Analyst → Writer, tích hợp Graph Knowledge (NetworkX).
          + Tự động hóa tạo báo cáo Word chuẩn format doanh nghiệp (Table Grid style), giảm 90% thao tác thủ công.
        - 01/2025 – 04/2025: Chuyên viên Đào tạo AI/ML & Solutions Consultant (CTy TNHH Tư Vấn Giáo Dục Nhân Mỹ).
        - 06/2024 – 07/2024: Nhân viên Triển khai và Bảo trì Phần mềm (CÔNG TY PHẦN MỀM VÀNG).
        - 03/2023 – 03/2024: Nhân viên Kỹ thuật & Marketing (Hệ thống giáo dục Nam Mỹ).
        - 05/2024 – 06/2024: Kỹ thuật viên (Trường Thịnh Group).

        Dự Án Tiêu Biểu:
        - AiMed: Hệ thống tư vấn y tế tích hợp RAG, Hybrid Search và LLM.
        - ENERGY-TASK-AI: Nền tảng điều phối tác vụ và tự động hóa quy trình kỹ thuật điện.
        - Morphology-Master (MorphoLearn): Hệ thống học tiếng Anh Hình thái học.
        - ETMS: Enterprise Task Management System.
        - TOV/TRV Automation: Tự động hóa quy trình mô phỏng và phân tích PSCAD/TRV.
        - FILL_POI & ATS CV Builder: Công cụ tạo và tối ưu hóa CV chuẩn ATS.
        - Gemini Summarizer & Video Speed Controller: Công cụ hỗ trợ xử lý thông tin thông minh.
        - Trạm Gật Gù: Kênh YouTube về tâm lý học tích cực, phát triển bản thân và âm nhạc AI.
    `;

    const systemPrompt = `
        Bạn là Trợ lý AI được xây dựng để trả lời các câu hỏi về hồ sơ xin việc (CV) của Cao Nguyễn Thành An.
        Chỉ sử dụng thông tin được cung cấp trong CV dưới đây để trả lời.
        Tuyệt đối không bịa đặt thông tin. Giữ câu trả lời ngắn gọn, chuyên nghiệp và lịch sự bằng tiếng Việt.
        CV chi tiết: ${cvContext}
    `;

    // Event Listeners
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.add('open');
        chatToggle.style.display = 'none';
        chatInput.focus();
    });

    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('open');
        chatToggle.style.display = 'flex';
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    chatSend.addEventListener('click', sendMessage);

    // Chat Functions
    function renderMarkdown(text){
        try {
            if (window.marked) {
                var raw = window.marked.parse(text || '');
                if (window.DOMPurify) return window.DOMPurify.sanitize(raw);
                return raw;
            }
        } catch(_) {}
        return (text || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1<\/strong>');
    }

    function displayMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `p-3 rounded-xl max-w-xs text-sm shadow-md ${
            isUser 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-indigo-100 text-gray-800 rounded-tl-none'
        }`;
        contentDiv.innerHTML = isUser ? text : renderMarkdown(text);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function createLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.className = 'flex justify-start';
        loadingDiv.innerHTML = `
            <div class="bg-indigo-100 p-3 rounded-xl rounded-tl-none text-sm shadow-md">
                <div class="flex space-x-1">
                    <span class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style="animation-delay: -0.32s;"></span>
                    <span class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style="animation-delay: -0.16s;"></span>
                    <span class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return loadingDiv;
    }

    async function sendMessage() {
        const userQuery = chatInput.value.trim();
        if (!userQuery) return;

        displayMessage(userQuery, true);
        chatInput.value = '';

        const loadingIndicator = createLoadingIndicator();
        chatInput.disabled = true;
        chatSend.disabled = true;
        
        const payload = {
            userQuery: userQuery,
            systemInstruction: systemPrompt,
        };

        try {
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            let result = {};
            try { result = await response.json(); } catch (_) { result = {}; }

            let aiResponseText = "Rất tiếc, máy chủ trung gian (Proxy) chưa được cấu hình hoặc gặp lỗi. Vui lòng thử lại sau.";
            if (response.ok) {
                if (result && result.text) {
                    aiResponseText = result.text;
                }
            } else {
                aiResponseText = (result && result.text) || `Máy chủ Proxy trả về lỗi ${response.status}`;
            }

            loadingIndicator.remove();
            displayMessage(aiResponseText);

        } catch (error) {
            console.error('Error fetching AI response:', error);
            loadingIndicator.remove();
            displayMessage("Đã xảy ra lỗi kết nối với máy chủ trung gian (Proxy).");
        } finally {
            chatInput.disabled = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    }
}
