// Header component với avatar xoay vòng và navigation
class HeaderComponent {
    constructor() {
        this.avatars = ['avata1', 'avata2', 'avata3', 'avata4', 'avata5'];
        this.currentAvatarIndex = 0;
        this.imagePath = this.getImagePath();
        this.init();
    }

    getImagePath() {
        return '/image/';
    }

    init() {
        this.loadLinks().then(links => {
            this.createHeaderFromLinks(links);
            this.startAvatarRotation();
            this.setActiveNavItem();
        }).catch(() => {
            this.createHeader();
            this.startAvatarRotation();
            this.setActiveNavItem();
        });
    }

    async loadLinks() {
        const res = await fetch('/data/links.json', { cache: 'no-store' });
        const data = await res.json();
        return data.links || [];
    }

    pickPrimaryPath(paths) {
        if (!Array.isArray(paths) || paths.length === 0) return '/';
        const sorted = [...paths].sort((a, b) => a.length - b.length);
        return sorted[0];
    }

    createHeaderFromLinks(links) {
        const order = ['core', 'profile', 'ai', 'education', 'cntt-edu', 'event', 'mindset', 'tool'];
        const show = links.filter(l => l.showInHeader);
        const sorted = show.sort((a, b) => {
            const ta = (a.tags && a.tags[0]) || '';
            const tb = (b.tags && b.tags[0]) || '';
            const ia = order.indexOf(ta);
            const ib = order.indexOf(tb);
            if (ia !== ib) return ia - ib;
            return (a.label || '').localeCompare(b.label || '');
        });
        const items = sorted.map(l => {
            const p = this.pickPrimaryPath(l.paths);
            return `<a href="${p}" class="nav-item" data-page="${p}">${l.label}</a>`;
        }).join('\n');
        const headerHTML = `
            <header class="header-container">
                <div class="header-content">
                    <div class="avatar-container">
                        <a href="https://www.facebook.com/nguyenthanhan.cao/" target="_blank" rel="noopener noreferrer">
                            <img id="rotating-avatar" src="${this.imagePath}${this.avatars[0]}" alt="Avatar" class="avatar-image">
                        </a>
                    </div>
                    <nav class="navigation">
                        ${items}
                    </nav>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    createHeader() {
        const headerHTML = `
            <header class="header-container">
                <div class="header-content">
                    <div class="avatar-container">
                        <a href="https://www.facebook.com/nguyenthanhan.cao/" target="_blank" rel="noopener noreferrer">
                            <img id="rotating-avatar" src="${this.imagePath}${this.avatars[0]}" alt="Avatar" class="avatar-image">
                        </a>
                    </div>
                    <nav class="navigation">
                        <a href="/" class="nav-item" data-page="/">Trang chủ</a>
                        <a href="/caonguyenthanhan" class="nav-item" data-page="/caonguyenthanhan">Thông tin</a>
                        <a href="/ai_welcome" class="nav-item" data-page="/ai_welcome">AI Welcome</a>
                        <a href="/education" class="nav-item" data-page="/education">Education</a>
                        <a href="/attt" class="nav-item" data-page="/attt">CNTT-edu</a>
                        <a href="/nlp" class="nav-item" data-page="/nlp">NLP</a>
                        <a href="/genai" class="nav-item" data-page="/genai">Gen AI</a>
                        <a href="/prompts" class="nav-item" data-page="/prompts">Prompts</a>
                        <a href="/MorphoLearn" class="nav-item" data-page="/MorphoLearn">MorphoLearn</a>
                        <a href="/gen-cv" class="nav-item" data-page="/gen-cv">Gen CV</a>
                        <a href="/graduation" class="nav-item" data-page="/graduation">Graduation</a>
                        <a href="/positive-mindset" class="nav-item" data-page="/positive-mindset">Tâm lý tích cực</a>
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
                avatarImg.src = `${this.imagePath}${this.avatars[this.currentAvatarIndex]}`;
            }
        }, 2000); // Đổi avatar mỗi 2 giây
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const currentPathLower = currentPath.toLowerCase();
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const itemPath = item.getAttribute('data-page');
            if (currentPath === itemPath || 
                (currentPath === '/' && itemPath === '/') ||
                (currentPath === '/index.html' && itemPath === '/') ||
                (currentPath.includes('/caonguyenthanhan') && itemPath === '/caonguyenthanhan') ||
                (currentPath.includes('/ai_welcome') && itemPath === '/ai_welcome') ||
                ((currentPath.includes('/education') || currentPath.includes('/eduit')) && itemPath === '/education') ||
                (currentPath.includes('/attt') && itemPath === '/attt') ||
                (currentPath.includes('/nlp') && itemPath === '/nlp') ||
                (currentPath.includes('/genai') && itemPath === '/genai') ||
                ((currentPath.includes('/prompts') || currentPathLower.includes('image_prompt_library')) && itemPath === '/prompts') ||
                (currentPathLower.includes('/morpholearn') && itemPath === '/MorphoLearn') ||
                ((currentPath.includes('/gen-cv') || currentPathLower.includes('/cv%20builder') || currentPathLower.includes('/cv builder')) && itemPath === '/gen-cv') ||
                ((currentPath.includes('/graduation') || currentPath.includes('/grad2025') || currentPath.includes('/graduation2025')) && itemPath === '/graduation') ||
                ((currentPath.includes('/positive-mindset') || currentPath.includes('/Positive-mindset')) && itemPath === '/positive-mindset') ||
                (currentPath.includes('/extension/') && itemPath === '/extensions')) {
                item.classList.add('active');
            } else {
                const starts = currentPath.startsWith(itemPath) && itemPath !== '/';
                if (starts) item.classList.add('active');
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
