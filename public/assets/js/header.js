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

    getHeaderGroupsConfig() {
        return {
            order: ['pages', 'ai', 'learning', 'tools', 'other'],
            labelById: {
                pages: 'Trang',
                ai: 'AI',
                learning: 'Học tập',
                tools: 'Công cụ',
                other: 'Khác'
            },
            tagToGroupId: {
                core: 'pages',
                profile: 'pages',
                ai: 'ai',
                education: 'learning',
                'cntt-edu': 'learning',
                tool: 'tools',
                event: 'other',
                mindset: 'other',
                mystic: 'other'
            }
        };
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
        return {
            links: data.links || []
        };
    }

    pickPrimaryPath(paths) {
        if (!Array.isArray(paths) || paths.length === 0) return '/';
        const sorted = [...paths].sort((a, b) => a.length - b.length);
        return sorted[0];
    }

    normalizeLinksPayload(payload) {
        if (Array.isArray(payload)) return payload;
        if (payload && Array.isArray(payload.links)) return payload.links;
        return [];
    }

    groupHeaderLinks(links) {
        const config = this.getHeaderGroupsConfig();
        const buckets = new Map(config.order.map(groupId => [groupId, []]));

        for (const link of links) {
            if (!link || !link.showInHeader) continue;
            const primaryTag = (link.tags && link.tags[0]) || '';
            const groupId = config.tagToGroupId[primaryTag] || 'other';
            const arr = buckets.get(groupId) || [];
            arr.push(link);
            buckets.set(groupId, arr);
        }

        const groups = [];
        for (const groupId of config.order) {
            const arr = buckets.get(groupId) || [];
            if (arr.length === 0) continue;
            const sorted = [...arr].sort((a, b) => (a.label || '').localeCompare(b.label || ''));
            groups.push({ groupId, links: sorted });
        }
        return groups;
    }

    renderHeaderGroup(groupId, links) {
        const config = this.getHeaderGroupsConfig();
        const label = config.labelById[groupId] || groupId;
        const items = links.map(l => {
            const p = this.pickPrimaryPath(l.paths);
            return `<a href="${p}" class="nav-item nav-sub-item" data-page="${p}">${l.label}</a>`;
        }).join('\n');
        return `
            <details class="nav-group" data-group="${groupId}">
                <summary class="nav-group-summary">${label}</summary>
                <div class="nav-group-menu">
                    ${items}
                </div>
            </details>
        `;
    }

    createHeaderFromLinks(payload) {
        const links = this.normalizeLinksPayload(payload);
        const groups = this.groupHeaderLinks(links);
        const groupHTML = groups.map(g => this.renderHeaderGroup(g.groupId, g.links)).join('\n');
        const headerHTML = `
            <header class="header-container">
                <div class="header-content">
                    <div class="avatar-container">
                        <a href="https://www.facebook.com/nguyenthanhan.cao/" target="_blank" rel="noopener noreferrer">
                            <img id="rotating-avatar" src="${this.imagePath}${this.avatars[0]}" alt="Avatar" class="avatar-image">
                        </a>
                    </div>
                    <nav class="navigation">
                        ${groupHTML}
                    </nav>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    createHeader() {
        const config = this.getHeaderGroupsConfig();
        const groups = [
            {
                groupId: 'pages',
                links: [
                    { label: 'Trang chủ', paths: ['/'], showInHeader: true, tags: ['core'] },
                    { label: 'Thông tin', paths: ['/caonguyenthanhan'], showInHeader: true, tags: ['profile'] }
                ]
            },
            {
                groupId: 'ai',
                links: [
                    { label: 'AI Welcome', paths: ['/ai_welcome'], showInHeader: true, tags: ['ai'] },
                    { label: 'NLP', paths: ['/nlp'], showInHeader: true, tags: ['ai'] },
                    { label: 'Gen AI', paths: ['/genai'], showInHeader: true, tags: ['ai'] },
                    { label: 'Prompts', paths: ['/prompts'], showInHeader: true, tags: ['ai'] }
                ]
            },
            {
                groupId: 'learning',
                links: [
                    { label: 'Education', paths: ['/education'], showInHeader: true, tags: ['education'] },
                    { label: 'MorphoLearn', paths: ['/MorphoLearn'], showInHeader: true, tags: ['education'] },
                    { label: 'CNTT-edu', paths: ['/attt'], showInHeader: true, tags: ['cntt-edu'] }
                ]
            },
            {
                groupId: 'tools',
                links: [
                    { label: 'Gen CV', paths: ['/gen-cv'], showInHeader: true, tags: ['tool'] },
                    { label: 'Extensions', paths: ['/extensions'], showInHeader: true, tags: ['tool'] }
                ]
            },
            {
                groupId: 'other',
                links: [
                    { label: 'Graduation', paths: ['/graduation'], showInHeader: true, tags: ['event'] },
                    { label: 'Tâm lý tích cực', paths: ['/positive-mindset'], showInHeader: true, tags: ['mindset'] }
                ]
            }
        ];

        const groupHTML = config.order
            .map(groupId => {
                const group = groups.find(g => g.groupId === groupId);
                if (!group || !Array.isArray(group.links) || group.links.length === 0) return '';
                return this.renderHeaderGroup(groupId, group.links);
            })
            .filter(Boolean)
            .join('\n');

        const headerHTML = `
            <header class="header-container">
                <div class="header-content">
                    <div class="avatar-container">
                        <a href="https://www.facebook.com/nguyenthanhan.cao/" target="_blank" rel="noopener noreferrer">
                            <img id="rotating-avatar" src="${this.imagePath}${this.avatars[0]}" alt="Avatar" class="avatar-image">
                        </a>
                    </div>
                    <nav class="navigation">
                        ${groupHTML}
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
            item.classList.remove('active');
            const itemPath = item.getAttribute('data-page');
            const isActive = currentPath === itemPath || 
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
                (currentPath.includes('/extension/') && itemPath === '/extensions');

            const starts = currentPath.startsWith(itemPath) && itemPath !== '/';

            if (isActive || starts) {
                item.classList.add('active');
                const group = item.closest('.nav-group');
                if (group && group.tagName.toLowerCase() === 'details') {
                    group.open = true;
                }
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
    flex: 1;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.75rem 1rem;
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

.nav-group {
    position: relative;
}

.nav-group-summary {
    color: white;
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
    cursor: pointer;
    user-select: none;
}

.nav-group-summary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.nav-group[open] > .nav-group-summary {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-group-summary::-webkit-details-marker {
    display: none;
}

.nav-group-summary::marker {
    content: '';
}

.nav-group-summary::after {
    content: '▾';
    margin-left: 0.5rem;
    font-size: 0.9em;
    opacity: 0.9;
    display: inline-block;
    transition: transform 0.2s ease;
}

.nav-group[open] > .nav-group-summary::after {
    transform: rotate(180deg);
}

.nav-group-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 14px;
    padding: 0.5rem;
    min-width: 220px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    z-index: 1100;
}

.nav-group-menu .nav-item {
    color: #2d3748;
    background: transparent;
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    font-size: 1rem;
    width: 100%;
    white-space: nowrap;
}

.nav-group-menu .nav-item:hover {
    background: rgba(102, 126, 234, 0.12);
    transform: none;
}

.nav-group-menu .nav-item.active {
    background: rgba(102, 126, 234, 0.18);
    box-shadow: none;
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
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        gap: 1rem;
    }
    
    .nav-item {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
    }

    .nav-group-summary {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
        text-align: center;
    }

    .nav-group {
        width: 100%;
    }

    .nav-group-menu {
        position: static;
        min-width: unset;
        width: 100%;
        margin-top: 0.5rem;
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
