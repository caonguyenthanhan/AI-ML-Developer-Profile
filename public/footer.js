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
                            Cao Nguyễn Thành An
                        </h3>
                        <p class="text-sm text-indigo-100">Thực Tập Sinh Kỹ Sư AI/ML</p>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <i data-lucide="mail" class="w-4 h-4 mr-2 text-indigo-300"></i>
                                <span>caonguyenthanhan.aaa@gmail.com</span>
                            </div>
                            <div class="flex items-center">
                                <i data-lucide="phone" class="w-4 h-4 mr-2 text-indigo-300"></i>
                                <span>0929620697</span>
                            </div>
                            <div class="flex items-center">
                                <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-indigo-300"></i>
                                <span>Số 70, Đường Số 6, Linh Trung, Thủ Đức</span>
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
                            <a href="/caonguyenthanhan/pfofile" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="user-circle" class="w-4 h-4 mr-2 inline"></i>
                                Hồ Sơ CV
                            </a>
                            <a href="/nlp" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="brain" class="w-4 h-4 mr-2 inline"></i>
                                NLP Projects
                            </a>
                            <a href="/genai" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="sparkles" class="w-4 h-4 mr-2 inline"></i>
                                GenAI Tools
                            </a>
                            <a href="/extensions" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="puzzle" class="w-4 h-4 mr-2 inline"></i>
                                Extensions
                            </a>
                        </div>
                    </div>

                    <!-- Mạng xã hội -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold flex items-center">
                            <i data-lucide="share-2" class="w-5 h-5 mr-2"></i>
                            Kết Nối
                        </h3>
                        <div class="flex space-x-4">
                            <a href="https://github.com/caonguyenthanhan" target="_blank" 
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300">
                                <i data-lucide="github" class="w-5 h-5"></i>
                            </a>
                            <a href="https://www.facebook.com/nguyenthanhan.cao/" target="_blank" 
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300">
                                <i data-lucide="facebook" class="w-5 h-5"></i>
                            </a>
                            <a href="mailto:caonguyenthanhan.aaa@gmail.com" 
                               class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition duration-300">
                                <i data-lucide="mail" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Copyright -->
                <div class="border-t border-indigo-600 mt-6 pt-4 text-center text-sm text-indigo-200">
                    <p>&copy; 2025 Cao Nguyễn Thành An. Portfolio được xây dựng với AI/ML focus.</p>
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
                        Chào bạn! Tôi là trợ lý AI, tôi có thể trả lời các câu hỏi về kinh nghiệm, kỹ năng và dự án trong CV của Cao Nguyễn Thành An.
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
    
    // API Configuration
    const proxyUrl = '/api/chat'; 
    const MODEL_NAME = 'gemini-2.5-flash-preview-05-20';

    // CV Context cho AI Assistant
    const cvContext = `
        Hồ sơ xin việc của Cao Nguyễn Thành An, Thực Tập Sinh Kỹ Sư AI/ML.

        Mục Tiêu: Áp dụng kiến thức Machine Learning và Python để giải quyết các bài toán phức tạp trong dự án AI/ML.

        Học Vấn: Trí Tuệ Nhân Tạo, Đại học Sư phạm Kỹ thuật TP. HCM (08/2021 – 04/2025). Loại tốt nghiệp dự kiến: Khá.

        Kỹ Năng Chuyên Môn:
        1. Python & Core ML/Data: Python (thành thạo Scikit-learn, Pandas, Numpy). Kinh nghiệm Data Processing & SQL. Ứng dụng: Xây dựng mô hình dự đoán giá nhà.
        2. Deep Learning & Thuật toán: TensorFlow, PyTorch. Mô hình Học Sâu (GANs, DCGAN, AttGAN). Ứng dụng: Phát triển hệ thống Nhận dạng Khuôn mặt, OCR.
        3. Nền tảng: EC2, S3, Lambda, Docker, Git, Hadoop, Spark, Power BI.

        Kinh Nghiệm Làm Việc (Sắp xếp theo thời gian):
        - 01/2025 – 04/2025: Chuyên viên Đào tạo AI/ML (CTy TNHH Tư Vấn Giáo Dục Nhân Mỹ). Thành tựu: Nâng cao năng suất làm việc của đội ngũ lên 15-20%.
        - 06/2024 – 07/2024: Nhân viên Triển khai và Bảo trì Phần mềm (CÔNG TY PHẦN MỀM VÀNG). Vai trò: Quản lý Dữ liệu (SQL) và Hỗ trợ Kỹ thuật.
        - 03/2023 – 03/2024: Nhân viên Kỹ thuật & Marketing (Hệ thống giáo dục Nam Mỹ). Thành tựu: Tăng 20% lượng người theo dõi truyền thông.
        - 05/2024 – 06/2024: Thực tập sinh Sửa chữa Máy tính (Trường Thịnh Group).

        Dự Án AI/ML Tiêu Biểu:
        - OCR Mobile Application (Computer Vision, Mobile App)
        - Gemini Tóm Tắt & Đọc (Gemini API, TTS)
        - AI Models Unified Chatbox (LLM Integration)
        - Hệ thống Tư vấn Y tế (Dùng Llama)
        - Bộ Công Cụ Xử Lý Ngôn Ngữ Tự Nhiên (NLP)
        - Ứng Dụng Chat Tích Hợp API
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
    function displayMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `p-3 rounded-xl max-w-xs text-sm shadow-md ${
            isUser 
            ? 'bg-indigo-600 text-white rounded-br-none' 
            : 'bg-indigo-100 text-gray-800 rounded-tl-none'
        }`;
        contentDiv.innerHTML = text;
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

            if (!response.ok) {
                throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            let aiResponseText = "Rất tiếc, máy chủ trung gian (Proxy) chưa được cấu hình hoặc gặp lỗi. Vui lòng thử lại sau.";
            
            if (result.text) {
                aiResponseText = result.text;
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