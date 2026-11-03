// Logic for User / Guest Dashboard (user-dashboard.html)
document.addEventListener('DOMContentLoaded', () => {
    WeddingDB.init();
    const eventInfo = WeddingDB.getEventInfo();

    const urlParams = new URLSearchParams(window.location.search);
    const guestCodeParam = urlParams.get('code');
    const guestNameParam = urlParams.get('name');

    let currentGuest = null;

    if (guestCodeParam) {
        currentGuest = WeddingDB.getGuestByCode(guestCodeParam);
    } else if (guestNameParam) {
        currentGuest = WeddingDB.getGuestByName(decodeURIComponent(guestNameParam));
    }

    // If still null, fallback to first guest in db for demonstration if no code provided
    const allGuests = WeddingDB.getGuests();
    if (!currentGuest && allGuests.length > 0) {
        currentGuest = allGuests[0]; // default preview
    }

    renderGuestSelector(allGuests);
    renderDashboard(currentGuest);

    function renderGuestSelector(guests) {
        const selectorEl = document.getElementById('guest-selector');
        if (!selectorEl) return;

        selectorEl.innerHTML = guests.map(g => `
            <option value="${g.code}" ${currentGuest && currentGuest.code === g.code ? 'selected' : ''}>
                ${g.code} - ${g.name} (${g.category})
            </option>
        `).join('');

        selectorEl.addEventListener('change', (e) => {
            const selectedCode = e.target.value;
            window.location.search = `?code=${selectedCode}`;
        });
    }

    function renderDashboard(guest) {
        if (!guest) {
            document.getElementById('guest-portal-content').innerHTML = `
                <div class="text-center py-16">
                    <h3 class="text-xl font-bold text-stone-700">Data Tamu Tidak Ditemukan</h3>
                    <p class="text-stone-500 text-sm mt-2">Silakan pilih nama tamu atau hubungi pihak pengantin.</p>
                </div>
            `;
            return;
        }

        // Fill Ticket Details
        const guestNameEl = document.getElementById('ticket-guest-name');
        const guestCodeEl = document.getElementById('ticket-guest-code');
        const guestCategoryEl = document.getElementById('ticket-guest-category');
        const guestTableEl = document.getElementById('ticket-guest-table');
        const guestPaxEl = document.getElementById('ticket-guest-pax');
        const guestStatusBadgeEl = document.getElementById('ticket-guest-status');
        const guestQrImgEl = document.getElementById('ticket-qr-image');
        const checkinStatusBox = document.getElementById('ticket-checkin-status');
        const rsvpStatusRadio = document.querySelector(`input[name="user_rsvp_status"][value="${guest.status}"]`);
        const rsvpPaxInput = document.getElementById('user-rsvp-pax');
        const backToInvitationLink = document.getElementById('link-to-invitation');

        if (guestNameEl) guestNameEl.textContent = guest.name;
        if (guestCodeEl) guestCodeEl.textContent = guest.code;
        if (guestCategoryEl) guestCategoryEl.textContent = guest.category;
        if (guestTableEl) guestTableEl.textContent = guest.table || 'Reguler';
        if (guestPaxEl) guestPaxEl.textContent = `${guest.pax} Kursi`;

        if (backToInvitationLink) {
            backToInvitationLink.href = `index.html?to=${encodeURIComponent(guest.name)}&code=${guest.code}`;
        }

        // Attendance Status Badge
        if (guestStatusBadgeEl) {
            if (guest.status === 'hadir') {
                guestStatusBadgeEl.className = "px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300";
                guestStatusBadgeEl.innerHTML = "✓ Konfirmasi Hadir";
            } else if (guest.status === 'tidak') {
                guestStatusBadgeEl.className = "px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300";
                guestStatusBadgeEl.innerHTML = "✕ Berhalangan Hadir";
            } else {
                guestStatusBadgeEl.className = "px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300";
                guestStatusBadgeEl.innerHTML = "⌛ Belum Konfirmasi";
            }
        }

        // Checkin status
        if (checkinStatusBox) {
            if (guest.checkedIn) {
                checkinStatusBox.innerHTML = `
                    <div class="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">✓</div>
                        <div class="text-left text-xs sm:text-sm">
                            <span class="font-bold block">Sudah Check-In di Lokasi</span>
                            <span class="text-emerald-700 text-xs">Pukul ${guest.checkedInAt || 'Hari H'} - Selamat Menikmati Acara</span>
                        </div>
                    </div>
                `;
            } else {
                checkinStatusBox.innerHTML = `
                    <div class="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">QR</div>
                        <div class="text-left text-xs sm:text-sm">
                            <span class="font-semibold block">Tunjukkan QR Code ini kepada Penerima Tamu</span>
                            <span class="text-amber-700 text-xs">Untuk registrasi & cetak souvenir pernikahan di lokasi acara.</span>
                        </div>
                    </div>
                `;
            }
        }

        // QR Code Image
        if (guestQrImgEl) {
            // Generates an elegant QR code with guest code
            guestQrImgEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(guest.code)}&color=1B3B2B&bgcolor=FAF7F2`;
            guestQrImgEl.alt = `QR Code ${guest.code}`;
        }

        if (rsvpStatusRadio) {
            rsvpStatusRadio.checked = true;
        }
        if (rsvpPaxInput) {
            rsvpPaxInput.value = guest.pax;
        }

        if (window.lucide) lucide.createIcons();
    }

    // Update RSVP from User Dashboard
    const btnSaveUserRsvp = document.getElementById('btn-save-user-rsvp');
    if (btnSaveUserRsvp && currentGuest) {
        btnSaveUserRsvp.addEventListener('click', () => {
            const selectedStatus = document.querySelector('input[name="user_rsvp_status"]:checked')?.value || 'hadir';
            const paxValue = document.getElementById('user-rsvp-pax').value;

            const updated = WeddingDB.updateGuest(currentGuest.id, {
                status: selectedStatus,
                pax: parseInt(paxValue) || 1
            });

            currentGuest = updated;
            renderDashboard(currentGuest);
            showUserToast('Konfirmasi kehadiran berhasil diperbarui!', 'success');
        });
    }

    // Submit Digital Gift from User Dashboard
    const giftForm = document.getElementById('user-gift-form');
    if (giftForm && currentGuest) {
        giftForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bank = document.getElementById('gift-bank-select').value;
            const amount = document.getElementById('gift-amount-input').value;
            const note = document.getElementById('gift-note-input').value;

            if (!amount || amount <= 0) {
                showUserToast('Mohon masukkan nominal yang valid.', 'error');
                return;
            }

            WeddingDB.addGift({
                sender: currentGuest.name,
                bank: bank,
                amount: amount,
                note: note
            });

            giftForm.reset();
            showUserToast('Terima kasih banyak atas tanda kasih dan doa restunya!', 'success');
        });
    }

    // Toast notification
    function showUserToast(message, type = 'info') {
        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium ${
            isSuccess ? 'bg-emerald-900 text-emerald-100 border border-emerald-700' : 'bg-stone-900 text-stone-100'
        }`;
        toast.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // Listen to sync
    window.addEventListener('wedding_db_updated', () => {
        if (currentGuest) {
            currentGuest = WeddingDB.getGuestByCode(currentGuest.code);
            renderDashboard(currentGuest);
        }
    });
});
