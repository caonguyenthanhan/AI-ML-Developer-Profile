(() => {
    const getBlogSlug = () => {
        const path = window.location.pathname || '';
        const cleaned = path.replace(/\/+$/, '');
        const parts = cleaned.split('/').filter(Boolean);
        const blogIndex = parts.indexOf('blog');
        if (blogIndex === -1) return null;
        const slugRaw = parts[blogIndex + 1];
        const next = parts[blogIndex + 2];
        if (!slugRaw || next === 'interact') return null;
        const slug = decodeURIComponent(slugRaw).replace(/\.html$/i, '');
        return slug ? slug : null;
    };

    const encodePathSegment = (s) => encodeURIComponent(String(s || '').trim());

    const insertInteractCta = (interactHref) => {
        const footer = document.querySelector('footer');
        const section = document.createElement('section');
        section.className = 'max-w-4xl mx-auto px-6 mt-14';
        section.innerHTML = `
            <div class="rounded-xl border border-gray-800 bg-black/40 p-6 md:p-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div class="font-mono text-xs uppercase tracking-widest text-gray-400">Blog Interact</div>
                        <div class="text-white text-xl md:text-2xl font-bold mt-1">Mở phiên bản tương tác của bài viết</div>
                        <div class="text-gray-400 mt-2 text-sm md:text-base">Trải nghiệm bài viết theo kiểu game/drag-card, tối ưu cho mobile.</div>
                    </div>
                    <div class="flex gap-3">
                        <a href="${interactHref}" class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-sm transition-colors" rel="noopener">Trải nghiệm</a>
                    </div>
                </div>
            </div>
        `.trim();

        if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(section, footer);
        } else {
            document.body.appendChild(section);
        }
    };

    const main = () => {
        const slug = getBlogSlug();
        if (!slug) return;
        insertInteractCta(`/blog/${encodePathSegment(slug)}/interact`);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main, { once: true });
    } else {
        main();
    }
})();
