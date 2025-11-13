async function loadPreviewData() {
    const response = await fetch('/data/info.json', { cache: 'no-store' });
    const info = await response.json();

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
