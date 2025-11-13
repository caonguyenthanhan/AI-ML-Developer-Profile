async function loadPreviewData() {
    const response = await fetch('/data/info.json', { cache: 'no-store' });
    const info = await response.json().catch(()=>({}));
    const qsGuest = new URLSearchParams(location.search).get('guest') || '';
    const ssGuest = sessionStorage.getItem('guest') || '';
    const beautifyName = s => (s||'').split(' ').map(w=>w? w[0].toUpperCase()+w.slice(1).toLowerCase(): w).join(' ');
    let guestName = typeof info.guestName === 'string' ? info.guestName.trim() : '';
    if (!guestName) guestName = (qsGuest || ssGuest || '').trim();
    if (!guestName || guestName === 'null' || guestName === 'undefined') guestName = 'bạn';
    guestName = beautifyName(guestName);
    const graduateName = (info.graduateName || '').trim();

    document.getElementById('guestNameHero').textContent = guestName;
    document.getElementById('graduate-name').textContent = graduateName;

    document.getElementById('graduate-name').textContent = info.graduateName;
    document.getElementById('graduate-image').src = info.graduateImage;
    document.getElementById('graduate-info').textContent =
        `${info.universityShort} — Ngày ${info.date}`;

    document.getElementById('university-name').textContent = info.university;

    document.getElementById('event-date').textContent = info.date;
    document.getElementById('event-time').textContent = info.time;
    document.getElementById('event-venue').textContent =
        info.venue.replace(/<br>/g, ' ');
    document.getElementById('event-address').textContent = info.address;

    // Guest name từ session hoặc default
    const guest = sessionStorage.getItem('guest') || 'bạn';
    document.getElementById('guestNameHero').textContent = guest;
}

window.onload = loadPreviewData;
