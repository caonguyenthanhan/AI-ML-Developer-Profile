async function loadPreviewData() {
    try {
        const res = await fetch("./data/info.json", { cache: "no-store" });
        const info = await res.json();

        // Guest fallback logic
        let guestName = info.guestName;
        if (!guestName || guestName.trim() === "" || guestName === "null") {
            guestName = "bạn";
        }
        document.getElementById("guestNameHero").textContent = guestName;

        // Set graduate name
        document.getElementById("graduate-name").textContent =
            info.graduateName || "Tên tốt nghiệp";

        // Avatar
        document.getElementById("graduate-image").src =
            info.graduateImage || "./image/default-avatar.jpg";

        // Information
        document.getElementById("event-date").textContent = info.date;
        document.getElementById("event-time").textContent = info.time;
        document.getElementById("event-venue").textContent = info.venue;
        document.getElementById("event-address").textContent = info.address;
        document.getElementById("university-name").textContent = info.university;

    } catch (err) {
        console.error("Lỗi load JSON preview:", err);
    }
}

window.onload = loadPreviewData;
