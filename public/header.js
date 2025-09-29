// Header component với avatar xoay vòng và navigation
class HeaderComponent {
    constructor() {
        this.avatars = ['avata1.png', 'avata2.png', 'avata3.png', 'avata4.png', 'avata5.png'];
        this.currentAvatarIndex = 0;
        this.init();
    }

    init() {
        this.createHeader();
        this.startAvatarRotation();
        this.setActiveNavItem();
    }

    createHeader() {
        const headerHTML = `
            <header class="header-container">
                <div class="header-content">
                    <div class="avatar-container">
                        <a href="https://www.facebook.com/nguyenthanhan.cao/" target="_blank" rel="noopener noreferrer">
                            <img id="rotating-avatar" src="image/${this.avatars[0]}" alt="Avatar" class="avatar-image">
                        </a>
                    </div>
                    <nav class="navigation">
                        <a href="/" class="nav-item" data-page="/">Trang chủ</a>
                        <a href="/caonguyenthanhan" class="nav-item" data-page="/caonguyenthanhan">Thông tin</a>
                        <a href="/nlp" class="nav-item" data-page="/nlp">NLP</a>
                        <a href="/genai" class="nav-item" data-page="/genai">Gen AI</a>
                        <a href="/extensions" class="nav-item" data-page="/extensions">Extensions</a>
                    </nav>
                </div>
            </header>
        `;

        // Thêm header vào đầu body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    startAvatarRotation() {
        setInterval(() => {
            this.currentAvatarIndex = (this.currentAvatarIndex + 1) % this.avatars.length;
            const avatarImg = document.getElementById('rotating-avatar');
            if (avatarImg) {
                avatarImg.src = `image/${this.avatars[this.currentAvatarIndex]}`;
            }
        }, 2000); // Đổi avatar mỗi 2 giây
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const itemPath = item.getAttribute('data-page');
            if (currentPath === itemPath || 
                (currentPath === '/ai_welcome.html' && itemPath === '/') ||
                (currentPath === '/personal_info.html' && itemPath === '/caonguyenthanhan') ||
                (currentPath === '/nlp.html' && itemPath === '/nlp') ||
                (currentPath === '/genai.html' && itemPath === '/genai') ||
                (currentPath === '/extensions.html' && itemPath === '/extensions')) {
                item.classList.add('active');
            }
        });
    }
}

// CSS styles cho header
const headerStyles = `
<style>
.header-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    gap: 2rem;
}

.avatar-container {
    flex-shrink: 0;
}

.avatar-container a {
    display: block;
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.avatar-container a:hover {
    transform: scale(1.05);
}

.avatar-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid white;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    object-fit: cover;
    object-position: center;
}

.avatar-container a:hover .avatar-image {
    transform: scale(1.1);
}

.navigation {
    display: flex;
    gap: 2rem;
    flex: 1;
    justify-content: center;
}

.nav-item {
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.nav-item.active {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
    }
    
    .navigation {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }
    
    .nav-item {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
    }
    
    .avatar-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        object-position: center;
    }
}
</style>
`;

// Thêm styles vào head
document.head.insertAdjacentHTML('beforeend', headerStyles);

// Khởi tạo header khi DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeaderComponent();
});