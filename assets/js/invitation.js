// Logic for Main Wedding Invitation (index.html)
document.addEventListener('DOMContentLoaded', () => {
    WeddingDB.init();
    const eventInfo = WeddingDB.getEventInfo();

    // 1. Personalized Guest from URL Query Params
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to') || urlParams.get('guest');
    const guestCodeParam = urlParams.get('code');

    const guestCoverNameEl = document.getElementById('guest-cover-name');
    const rsvpNameInput = document.getElementById('rsvp-name');
    const guestTicketLinkEl = document.getElementById('btn-guest-ticket-link');

    if (guestNameParam) {
        const decodedName = decodeURIComponent(guestNameParam).replace(/\+/g, ' ');
        if (guestCoverNameEl) guestCoverNameEl.textContent = decodedName;
        if (rsvpNameInput) rsvpNameInput.value = decodedName;
    } else {
        if (guestCoverNameEl) guestCoverNameEl.textContent = "Tamu Undangan Istimewa";
    }

    if (guestTicketLinkEl) {
        if (guestCodeParam) {
            guestTicketLinkEl.href = `user-dashboard.html?code=${encodeURIComponent(guestCodeParam)}`;
        } else if (guestNameParam) {
            guestTicketLinkEl.href = `user-dashboard.html?name=${encodeURIComponent(guestNameParam)}`;
        } else {
            guestTicketLinkEl.href = `user-dashboard.html`;
        }
    }

    // 2. Open Invitation & Audio Player
    const coverScreen = document.getElementById('cover-screen');
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    const bgAudio = document.getElementById('bg-audio');
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const audioDisk = document.getElementById('audio-disk');
    let isPlaying = false;

    if (btnOpenInvitation) {
        btnOpenInvitation.addEventListener('click', () => {
            coverScreen.classList.add('open');
            document.body.style.overflow = 'auto';

            // Auto play music
            if (bgAudio) {
                bgAudio.play().then(() => {
                    isPlaying = true;
                    if (audioDisk) audioDisk.classList.remove('music-paused');
                }).catch(err => {
                    console.log('Audio autoplay blocked by browser policy:', err);
                });
            }
        });
    }

    if (btnAudioToggle && bgAudio) {
        btnAudioToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgAudio.pause();
                isPlaying = false;
                audioDisk.classList.add('music-paused');
            } else {
                bgAudio.play();
                isPlaying = true;
                audioDisk.classList.remove('music-paused');
            }
        });
    }

    // 3. Countdown Timer
    function startCountdown() {
        const targetDate = new Date(`${eventInfo.date}T${eventInfo.time}:00`).getTime();
        
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minsEl = document.getElementById('countdown-minutes');
        const secsEl = document.getElementById('countdown-seconds');

        function update() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                if (daysEl) daysEl.innerText = "00";
                if (hoursEl) hoursEl.innerText = "00";
                if (minsEl) minsEl.innerText = "00";
                if (secsEl) secsEl.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
            if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }
    startCountdown();

    // 4. Render Wishes Wall
    function renderWishes() {
        const wishesContainer = document.getElementById('wishes-list');
        const totalWishesBadge = document.getElementById('total-wishes-badge');
        if (!wishesContainer) return;

        const wishes = WeddingDB.getWishes();
        if (totalWishesBadge) totalWishesBadge.textContent = `${wishes.length} Ucapan`;

        if (wishes.length === 0) {
            wishesContainer.innerHTML = `<div class="text-center py-8 text-stone-500 text-sm">Belum ada ucapan doa. Jadilah yang pertama memberikan doa restu!</div>`;
            return;
        }

        wishesContainer.innerHTML = wishes.map(w => {
            const isHadir = w.attendance === 'hadir';
            const badgeClass = isHadir ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-stone-100 text-stone-600 border-stone-300';
            const badgeText = isHadir ? '✓ Hadir' : '✕ Berhalangan';
            const pinIcon = w.pinned ? `<span class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border border-amber-300"><i data-lucide="pin" class="w-3 h-3"></i> Disematkan</span>` : '';

            return `
                <div class="p-4 rounded-xl bg-white/90 border border-stone-200/80 shadow-sm transition hover:shadow-md mb-3 text-left">
                    <div class="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-emerald-800 text-gold-light flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                ${w.name.charAt(0)}
                            </div>
                            <div>
                                <h4 class="font-semibold text-stone-800 text-sm leading-tight">${escapeHTML(w.name)}</h4>
                                <span class="text-[11px] text-stone-400">${w.createdAt}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5">
                            ${pinIcon}
                            <span class="text-xs px-2.5 py-0.5 rounded-full border ${badgeClass} font-medium">${badgeText}</span>
                        </div>
                    </div>
                    <p class="text-stone-700 text-xs sm:text-sm leading-relaxed pl-10">${escapeHTML(w.message)}</p>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }
    renderWishes();

    // 5. Handle RSVP Form Submission
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rsvp-name').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'hadir';
            const pax = document.getElementById('rsvp-pax').value;
            const message = document.getElementById('rsvp-message').value.trim();

            if (!name || !message) {
                showToast('Mohon lengkapi nama dan ucapan Anda.', 'error');
                return;
            }

            // Save wish
            WeddingDB.addWish({
                name,
                attendance,
                message
            });

            // If guest exists in guest list, update their attendance
            let matchedGuest = WeddingDB.getGuestByName(name);
            if (matchedGuest) {
                WeddingDB.updateGuest(matchedGuest.id, {
                    status: attendance,
                    pax: parseInt(pax) || matchedGuest.pax
                });
            }

            renderWishes();
            rsvpForm.reset();
            showToast('Terima kasih banyak atas doa dan konfirmasi kehadirannya!', 'success');

            // Scroll to wishes section smoothly
            const wishesSection = document.getElementById('wishes-section');
            if (wishesSection) {
                wishesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 6. Copy Bank Account Numbers
    window.copyToClipboard = function(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Nomor Rekening ${label} berhasil disalin!`, 'success');
        }).catch(() => {
            // fallback
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showToast(`Nomor Rekening ${label} berhasil disalin!`, 'success');
        });
    };

    // 7. Toast Notification Helper
    window.showToast = function(message, type = 'info') {
        const existingToast = document.getElementById('app-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'app-toast';
        const isSuccess = type === 'success';
        const isError = type === 'error';

        toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 text-sm font-medium ${
            isSuccess ? 'bg-emerald-900 text-emerald-100 border border-emerald-700' :
            isError ? 'bg-rose-900 text-rose-100 border border-rose-700' :
            'bg-stone-900 text-stone-100 border border-stone-700'
        }`;

        const iconName = isSuccess ? 'check-circle' : isError ? 'alert-circle' : 'info';
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // 8. Gallery Lightbox Modal
    window.openLightbox = function(imageUrl, caption) {
        const modal = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const cap = document.getElementById('lightbox-caption');
        if (modal && img) {
            img.src = imageUrl;
            if (cap) cap.textContent = caption || '';
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    window.closeLightbox = function() {
        const modal = document.getElementById('lightbox-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    // Listen to changes from Admin or other tabs
    window.addEventListener('wedding_db_updated', () => {
        renderWishes();
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
