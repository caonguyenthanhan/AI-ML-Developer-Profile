(() => {
    const isSkippable = (el) => {
        if (!el || el.nodeType !== 1) return true;
        const id = (el.id || '').toLowerCase();
        if (id === 'bg-image' || id === 'bg-layer' || id === 'strings-layer') return true;
        const pos = window.getComputedStyle(el).position;
        if (pos === 'fixed') return true;
        return false;
    };

    const measure = () => {
        const candidates = new Set();
        document.querySelectorAll('[class*="max-w-"]').forEach((el) => candidates.add(el));

        let maxW = 0;
        for (const el of candidates) {
            if (isSkippable(el)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width > maxW) maxW = rect.width;
        }

        if (!maxW) {
            const main = document.querySelector('main');
            maxW = (main && main.getBoundingClientRect().width) || document.body.getBoundingClientRect().width || window.innerWidth;
        }

        document.documentElement.style.setProperty('--content-max-width', `${Math.round(maxW)}px`);
    };

    let raf = 0;
    const schedule = () => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
            raf = 0;
            measure();
        });
    };

    const syncScroll = () => {
        document.documentElement.style.setProperty('--bg-scroll-y', `${Math.max(0, Math.round(window.scrollY || 0))}px`);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', schedule, { once: true });
    } else {
        schedule();
    }
    syncScroll();
    window.addEventListener('load', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', syncScroll, { passive: true });
    window.setTimeout(schedule, 300);
})();
