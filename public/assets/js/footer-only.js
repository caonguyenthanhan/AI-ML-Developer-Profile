// Footer Component chỉ có footer (không có chat box)
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
                                <span><a href="tel:+84929620697" class="hover:text-white transition duration-300">0929 620 697</a></span>
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
                            <a href="/caonguyenthanhan/personal_info.html" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="user-circle" class="w-4 h-4 mr-2 inline"></i>
                                Hồ Sơ CV
                            </a>
                            <a href="/nlp/nlp.html" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="brain" class="w-4 h-4 mr-2 inline"></i>
                                NLP Projects
                            </a>
                            <a href="/genai/genai.html" class="block hover:text-indigo-300 transition duration-300">
                                <i data-lucide="sparkles" class="w-4 h-4 mr-2 inline"></i>
                                GenAI Tools
                            </a>
                            <a href="/extension/extensions.html" class="block hover:text-indigo-300 transition duration-300">
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
    `;

    // Thêm Footer vào cuối body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Khởi tạo Lucide Icons cho footer
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});