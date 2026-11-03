// Admin Dashboard Logic (admin.html)
document.addEventListener('DOMContentLoaded', () => {
    WeddingDB.init();

    // Tab Navigation
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            navButtons.forEach(b => {
                b.classList.remove('bg-emerald-800', 'text-white', 'shadow-sm');
                b.classList.add('text-stone-600', 'hover:bg-stone-100');
            });
            btn.classList.add('bg-emerald-800', 'text-white', 'shadow-sm');
            btn.classList.remove('text-stone-600', 'hover:bg-stone-100');

            tabPanels.forEach(panel => {
                if (panel.id === `tab-${targetTab}`) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });

            if (targetTab === 'scanner') {
                document.getElementById('scanner-input')?.focus();
            }
        });
    });

    // 1. Refresh Metrics & Stats
    function renderStats() {
        const stats = WeddingDB.getStats();

        const elTotalGuests = document.getElementById('stat-total-guests');
        const elTotalPax = document.getElementById('stat-total-pax');
        const elAttendingCount = document.getElementById('stat-attending-count');
        const elAttendingPax = document.getElementById('stat-attending-pax');
        const elPendingCount = document.getElementById('stat-pending-count');
        const elCheckedInCount = document.getElementById('stat-checkedin-count');
        const elGiftAmount = document.getElementById('stat-gift-amount');

        if (elTotalGuests) elTotalGuests.textContent = stats.totalGuests;
        if (elTotalPax) elTotalPax.textContent = `${stats.totalPax} Pax`;
        if (elAttendingCount) elAttendingCount.textContent = stats.attendingCount;
        if (elAttendingPax) elAttendingPax.textContent = `${stats.attendingPax} Pax Terkonfirmasi`;
        if (elPendingCount) elPendingCount.textContent = stats.pendingCount;
        if (elCheckedInCount) elCheckedInCount.textContent = `${stats.checkedInCount} Tamu`;
        if (elGiftAmount) {
            elGiftAmount.textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.totalGiftAmount);
        }
    }

    // 2. Guest List Management
    let guestFilterStatus = 'all';
    let guestFilterCategory = 'all';
    let guestSearchQuery = '';

    const filterStatusEl = document.getElementById('filter-status');
    const filterCategoryEl = document.getElementById('filter-category');
    const searchGuestInput = document.getElementById('search-guest');

    if (filterStatusEl) {
        filterStatusEl.addEventListener('change', (e) => {
            guestFilterStatus = e.target.value;
            renderGuestTable();
        });
    }
    if (filterCategoryEl) {
        filterCategoryEl.addEventListener('change', (e) => {
            guestFilterCategory = e.target.value;
            renderGuestTable();
        });
    }
    if (searchGuestInput) {
        searchGuestInput.addEventListener('input', (e) => {
            guestSearchQuery = e.target.value.toLowerCase().trim();
            renderGuestTable();
        });
    }

    function renderGuestTable() {
        const tableBody = document.getElementById('guest-table-body');
        if (!tableBody) return;

        let guests = WeddingDB.getGuests();

        // Filter
        if (guestFilterStatus !== 'all') {
            guests = guests.filter(g => g.status === guestFilterStatus);
        }
        if (guestFilterCategory !== 'all') {
            guests = guests.filter(g => g.category === guestFilterCategory);
        }
        if (guestSearchQuery) {
            guests = guests.filter(g => 
                g.name.toLowerCase().includes(guestSearchQuery) || 
                g.code.toLowerCase().includes(guestSearchQuery) ||
                (g.table && g.table.toLowerCase().includes(guestSearchQuery))
            );
        }

        if (guests.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-8 text-center text-stone-500 text-sm">
                        Tidak ada tamu yang cocok dengan filter.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = guests.map(g => {
            // Status badge
            let statusBadge = '';
            if (g.status === 'hadir') {
                statusBadge = '<span class="px-2.5 py-1 text-xs rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Hadir</span>';
            } else if (g.status === 'tidak') {
                statusBadge = '<span class="px-2.5 py-1 text-xs rounded-full font-semibold bg-rose-100 text-rose-800 border border-rose-300">Tidak Hadir</span>';
            } else {
                statusBadge = '<span class="px-2.5 py-1 text-xs rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-300">Belum Respon</span>';
            }

            // Check-in status
            let checkInBadge = g.checkedIn 
                ? `<span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">✓ ${g.checkedInAt || 'Hadir'}</span>`
                : `<button onclick="quickCheckIn('${g.id}')" class="text-xs bg-stone-100 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded border border-stone-200 transition">Check-in</button>`;

            // Category badge
            const catColors = {
                'VIP': 'bg-purple-100 text-purple-800 border-purple-200',
                'Keluarga': 'bg-blue-100 text-blue-800 border-blue-200',
                'Sahabat': 'bg-pink-100 text-pink-800 border-pink-200',
                'Teman Kantor': 'bg-stone-100 text-stone-800 border-stone-200'
            };
            const catClass = catColors[g.category] || 'bg-stone-100 text-stone-800';

            return `
                <tr class="hover:bg-stone-50/70 border-b border-stone-200/60 transition text-sm">
                    <td class="py-3.5 px-4 font-mono font-semibold text-xs text-stone-600">
                        ${g.code}
                    </td>
                    <td class="py-3.5 px-4">
                        <div class="font-medium text-stone-900">${escapeHTML(g.name)}</div>
                        <div class="text-[11px] text-stone-400">${g.phone || '-'} ${g.notes ? `• ${escapeHTML(g.notes)}` : ''}</div>
                    </td>
                    <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 text-[11px] rounded font-medium border ${catClass}">${g.category}</span>
                    </td>
                    <td class="py-3.5 px-4 text-stone-600 font-medium">
                        ${g.table || '-'} <span class="text-stone-400 text-xs">(${g.pax} Pax)</span>
                    </td>
                    <td class="py-3.5 px-4">
                        ${statusBadge}
                    </td>
                    <td class="py-3.5 px-4">
                        ${checkInBadge}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                            <button onclick="shareWhatsApp('${g.id}')" title="Kirim Link WhatsApp" class="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition">
                                <i data-lucide="share-2" class="w-4 h-4"></i>
                            </button>
                            <a href="user-dashboard.html?code=${g.code}" target="_blank" title="Buka E-Ticket Tamu" class="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 border border-blue-200 transition">
                                <i data-lucide="ticket" class="w-4 h-4"></i>
                            </a>
                            <button onclick="openEditGuestModal('${g.id}')" title="Edit Tamu" class="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 border border-amber-200 transition">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="deleteGuestHandler('${g.id}')" title="Hapus Tamu" class="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 transition">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    // Quick Check-in from table
    window.quickCheckIn = function(guestId) {
        const result = WeddingDB.checkInGuest(guestId);
        if (result.success) {
            renderStats();
            renderGuestTable();
            renderRecentCheckins();
            showAdminToast(result.message, 'success');
        } else {
            showAdminToast(result.message, 'error');
        }
    };

    // WhatsApp Share Link Generator
    window.shareWhatsApp = function(guestId) {
        const guests = WeddingDB.getGuests();
        const g = guests.find(item => item.id === guestId);
        if (!g) return;

        const origin = window.location.origin + window.location.pathname.replace('admin.html', '');
        const inviteUrl = `${origin}index.html?to=${encodeURIComponent(g.name)}&code=${g.code}`;
        const ticketUrl = `${origin}user-dashboard.html?code=${g.code}`;

        const text = `Kepada Yth. ${g.name},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir pada pernikahan kami:\n\n*Raden & Nadine*\n\nInformasi lengkap dan RSVP dapat diakses melalui link undangan berikut:\n${inviteUrl}\n\nE-Ticket & QR Check-in Anda:\n${ticketUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;

        // Direct WhatsApp Web / mobile
        const waUrl = g.phone ? `https://wa.me/${formatPhone(g.phone)}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    };

    function formatPhone(phone) {
        let clean = phone.replace(/[^0-9]/g, '');
        if (clean.startsWith('0')) {
            clean = '62' + clean.slice(1);
        }
        return clean;
    }

    // Modal Add & Edit Guest
    const addGuestModal = document.getElementById('modal-add-guest');
    const guestForm = document.getElementById('form-guest');
    const modalTitle = document.getElementById('modal-guest-title');

    window.openAddGuestModal = function() {
        if (!addGuestModal) return;
        guestForm.reset();
        document.getElementById('guest-edit-id').value = '';
        modalTitle.textContent = 'Tambah Tamu Undangan Baru';
        addGuestModal.classList.remove('hidden');
        addGuestModal.classList.add('flex');
    };

    window.openEditGuestModal = function(id) {
        const guest = WeddingDB.getGuests().find(g => g.id === id);
        if (!guest) return;

        document.getElementById('guest-edit-id').value = guest.id;
        document.getElementById('input-guest-name').value = guest.name;
        document.getElementById('input-guest-category').value = guest.category;
        document.getElementById('input-guest-phone').value = guest.phone || '';
        document.getElementById('input-guest-pax').value = guest.pax;
        document.getElementById('input-guest-table').value = guest.table || '';
        document.getElementById('input-guest-status').value = guest.status;
        document.getElementById('input-guest-notes').value = guest.notes || '';

        modalTitle.textContent = 'Edit Tamu Undangan';
        addGuestModal.classList.remove('hidden');
        addGuestModal.classList.add('flex');
    };

    window.closeGuestModal = function() {
        if (addGuestModal) {
            addGuestModal.classList.add('hidden');
            addGuestModal.classList.remove('flex');
        }
    };

    if (guestForm) {
        guestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('guest-edit-id').value;
            const name = document.getElementById('input-guest-name').value.trim();
            const category = document.getElementById('input-guest-category').value;
            const phone = document.getElementById('input-guest-phone').value.trim();
            const pax = parseInt(document.getElementById('input-guest-pax').value) || 1;
            const table = document.getElementById('input-guest-table').value.trim();
            const status = document.getElementById('input-guest-status').value;
            const notes = document.getElementById('input-guest-notes').value.trim();

            if (!name) {
                showAdminToast('Nama tamu wajib diisi', 'error');
                return;
            }

            if (editId) {
                WeddingDB.updateGuest(editId, { name, category, phone, pax, table, status, notes });
                showAdminToast('Data tamu berhasil diperbarui!', 'success');
            } else {
                WeddingDB.addGuest({ name, category, phone, pax, table, status, notes });
                showAdminToast('Tamu baru berhasil ditambahkan!', 'success');
            }

            closeGuestModal();
            renderStats();
            renderGuestTable();
        });
    }

    window.deleteGuestHandler = function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus tamu ini dari daftar undangan?')) {
            WeddingDB.deleteGuest(id);
            renderStats();
            renderGuestTable();
            showAdminToast('Tamu berhasil dihapus.', 'info');
        }
    };

    // 3. QR Scanner / Receptionist Check-in Console
    const scannerInput = document.getElementById('scanner-input');
    const scannerForm = document.getElementById('form-scanner');
    const scannerResultBox = document.getElementById('scanner-result');

    if (scannerForm) {
        scannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = scannerInput.value.trim();
            if (!code) return;

            processCheckIn(code);
            scannerInput.value = '';
            scannerInput.focus();
        });
    }

    window.processCheckIn = function(code) {
        const result = WeddingDB.checkInGuest(code);

        if (!scannerResultBox) return;

        if (result.success) {
            scannerResultBox.innerHTML = `
                <div class="p-6 bg-emerald-900 text-white rounded-2xl shadow-xl border-2 border-emerald-400 animate-bounce-short">
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-3 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">✓ Check-in Berhasil</span>
                        <span class="text-xs text-emerald-200">${result.guest.checkedInAt}</span>
                    </div>
                    <h3 class="text-2xl font-bold font-heading">${result.guest.name}</h3>
                    <div class="mt-4 grid grid-cols-3 gap-3 text-center bg-white/10 rounded-xl p-3">
                        <div>
                            <span class="text-[11px] text-emerald-200 block uppercase">Kategori</span>
                            <span class="font-bold text-sm text-white">${result.guest.category}</span>
                        </div>
                        <div>
                            <span class="text-[11px] text-emerald-200 block uppercase">Nomor Meja</span>
                            <span class="font-bold text-sm text-gold-light">${result.guest.table || 'Reguler'}</span>
                        </div>
                        <div>
                            <span class="text-[11px] text-emerald-200 block uppercase">Jumlah Tamu</span>
                            <span class="font-bold text-sm text-white">${result.guest.pax} Kursi</span>
                        </div>
                    </div>
                    <p class="mt-4 text-xs text-emerald-200 text-center">Silakan serahkan souvenir pernikahan dan persilakan menuju meja yang ditentukan.</p>
                </div>
            `;
            showAdminToast(result.message, 'success');
        } else if (result.alreadyCheckedIn) {
            scannerResultBox.innerHTML = `
                <div class="p-6 bg-amber-900 text-white rounded-2xl shadow-xl border-2 border-amber-400">
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-3 py-1 bg-amber-500/30 text-amber-200 border border-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">Sudah Check-In Sebelumnya</span>
                        <span class="text-xs text-amber-200">${result.guest.checkedInAt}</span>
                    </div>
                    <h3 class="text-xl font-bold">${result.guest.name}</h3>
                    <p class="text-xs text-amber-200 mt-2">Tamu ini sudah tercatat masuk pada pukul ${result.guest.checkedInAt} (Meja ${result.guest.table}).</p>
                </div>
            `;
            showAdminToast(result.message, 'info');
        } else {
            scannerResultBox.innerHTML = `
                <div class="p-6 bg-rose-900 text-white rounded-2xl shadow-xl border-2 border-rose-400">
                    <span class="px-3 py-1 bg-rose-500/30 text-rose-200 border border-rose-400 rounded-full text-xs font-bold uppercase tracking-wider">Tamu Tidak Terdaftar</span>
                    <h3 class="text-lg font-bold mt-2">Kode "${code}" tidak ditemukan!</h3>
                    <p class="text-xs text-rose-200 mt-1">Pastikan kode atau QR Code yang di-scan sesuai dengan undangan.</p>
                </div>
            `;
            showAdminToast(result.message, 'error');
        }

        renderStats();
        renderGuestTable();
        renderRecentCheckins();
    };

    function renderRecentCheckins() {
        const feed = document.getElementById('recent-checkins-feed');
        if (!feed) return;

        const guests = WeddingDB.getGuests().filter(g => g.checkedIn).reverse();
        if (guests.length === 0) {
            feed.innerHTML = `<div class="text-stone-400 text-xs py-4 text-center">Belum ada tamu yang check-in hari ini.</div>`;
            return;
        }

        feed.innerHTML = guests.slice(0, 8).map(g => `
            <div class="flex items-center justify-between p-2.5 rounded-lg bg-white border border-stone-200 shadow-sm text-xs">
                <div>
                    <span class="font-bold text-stone-800 block">${escapeHTML(g.name)}</span>
                    <span class="text-stone-400 text-[11px]">${g.category} • ${g.table} (${g.pax} Pax)</span>
                </div>
                <div class="text-right">
                    <span class="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">${g.checkedInAt}</span>
                </div>
            </div>
        `).join('');
    }

    // 4. Wishes Moderation
    function renderAdminWishes() {
        const list = document.getElementById('admin-wishes-list');
        if (!list) return;

        const wishes = WeddingDB.getWishes();
        if (wishes.length === 0) {
            list.innerHTML = `<div class="text-stone-400 text-sm py-8 text-center">Belum ada doa dan ucapan.</div>`;
            return;
        }

        list.innerHTML = wishes.map(w => {
            const isHadir = w.attendance === 'hadir';
            const badgeClass = isHadir ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600';
            const badgeText = isHadir ? 'Hadir' : 'Berhalangan';
            const pinColor = w.pinned ? 'bg-amber-100 text-amber-800 border-amber-300' : 'text-stone-400 hover:bg-stone-100';

            return `
                <div class="p-4 bg-white rounded-xl border border-stone-200 shadow-sm flex items-start justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h4 class="font-bold text-stone-800 text-sm">${escapeHTML(w.name)}</h4>
                            <span class="text-xs px-2 py-0.5 rounded ${badgeClass}">${badgeText}</span>
                            <span class="text-xs text-stone-400">${w.createdAt}</span>
                        </div>
                        <p class="text-stone-700 text-sm leading-relaxed">${escapeHTML(w.message)}</p>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button onclick="togglePinWishHandler('${w.id}')" title="Sematkan Ucapan" class="p-1.5 rounded-lg border ${pinColor} transition">
                            <i data-lucide="pin" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteWishHandler('${w.id}')" title="Hapus Ucapan" class="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 transition">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    window.togglePinWishHandler = function(id) {
        WeddingDB.togglePinWish(id);
        renderAdminWishes();
        showAdminToast('Status pin ucapan diperbarui', 'info');
    };

    window.deleteWishHandler = function(id) {
        if (confirm('Hapus ucapan ini?')) {
            WeddingDB.deleteWish(id);
            renderStats();
            renderAdminWishes();
            showAdminToast('Ucapan berhasil dihapus', 'info');
        }
    };

    // 5. Gifts Tracker
    function renderAdminGifts() {
        const giftList = document.getElementById('admin-gifts-list');
        if (!giftList) return;

        const gifts = WeddingDB.getGifts();
        if (gifts.length === 0) {
            giftList.innerHTML = `<div class="text-stone-400 text-sm py-4 text-center">Belum ada amplop digital tercatat.</div>`;
            return;
        }

        giftList.innerHTML = gifts.map(g => `
            <div class="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-sm">
                <div>
                    <h5 class="font-bold text-stone-800">${escapeHTML(g.sender)}</h5>
                    <span class="text-xs text-stone-400">${g.bank} • ${g.date}</span>
                    ${g.note ? `<p class="text-xs text-stone-500 italic mt-0.5">"${escapeHTML(g.note)}"</p>` : ''}
                </div>
                <div class="text-right">
                    <span class="font-bold text-emerald-800 text-sm sm:text-base">
                        ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(g.amount)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    // 6. Settings Tab
    const formSettings = document.getElementById('form-settings');
    function loadSettings() {
        const info = WeddingDB.getEventInfo();
        if (!formSettings) return;

        document.getElementById('set-groom-name').value = info.groom.fullName;
        document.getElementById('set-bride-name').value = info.bride.fullName;
        document.getElementById('set-wedding-date').value = info.date;
        document.getElementById('set-wedding-time').value = info.time;
        document.getElementById('set-akad-venue').value = info.akad.venue;
        document.getElementById('set-resepsi-venue').value = info.resepsi.venue;
        document.getElementById('set-bank-1').value = `${info.bankAccounts[0]?.bank} - ${info.bankAccounts[0]?.number} a.n ${info.bankAccounts[0]?.name}`;
        document.getElementById('set-bank-2').value = `${info.bankAccounts[1]?.bank} - ${info.bankAccounts[1]?.number} a.n ${info.bankAccounts[1]?.name}`;
    }

    if (formSettings) {
        formSettings.addEventListener('submit', (e) => {
            e.preventDefault();
            const current = WeddingDB.getEventInfo();
            current.groom.fullName = document.getElementById('set-groom-name').value;
            current.bride.fullName = document.getElementById('set-bride-name').value;
            current.date = document.getElementById('set-wedding-date').value;
            current.time = document.getElementById('set-wedding-time').value;
            current.akad.venue = document.getElementById('set-akad-venue').value;
            current.resepsi.venue = document.getElementById('set-resepsi-venue').value;

            WeddingDB.updateEventInfo(current);
            showAdminToast('Pengaturan acara berhasil disimpan!', 'success');
        });
    }

    // Reset to default
    const btnResetData = document.getElementById('btn-reset-db');
    if (btnResetData) {
        btnResetData.addEventListener('click', () => {
            if (confirm('Peringatan: Tindakan ini akan mengembalikan seluruh data (tamu, ucapan, hadiah) ke data default. Lanjutkan?')) {
                WeddingDB.resetToDefault();
                loadSettings();
                renderStats();
                renderGuestTable();
                renderRecentCheckins();
                renderAdminWishes();
                renderAdminGifts();
                showAdminToast('Data sistem berhasil direset ke default.', 'info');
            }
        });
    }

    // Export CSV
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
        btnExportCsv.addEventListener('click', () => {
            const guests = WeddingDB.getGuests();
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Kode,Nama Tamu,Kategori,No HP,Pax,Meja,Status Kehadiran,Sudah Check-In,Waktu Check-In,Catatan\n";

            guests.forEach(g => {
                const row = [
                    g.code,
                    `"${(g.name || '').replace(/"/g, '""')}"`,
                    g.category,
                    g.phone,
                    g.pax,
                    g.table,
                    g.status,
                    g.checkedIn ? 'Ya' : 'Belum',
                    g.checkedInAt || '-',
                    `"${(g.notes || '').replace(/"/g, '""')}"`
                ].join(',');
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `daftar_tamu_pernikahan_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showAdminToast('Data tamu berhasil diexport ke CSV!', 'success');
        });
    }

    // Toast helper
    function showAdminToast(message, type = 'info') {
        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        const isError = type === 'error';

        toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium transition-all transform duration-300 ${
            isSuccess ? 'bg-emerald-900 text-emerald-100 border border-emerald-700' :
            isError ? 'bg-rose-900 text-rose-100 border border-rose-700' :
            'bg-stone-900 text-stone-100 border border-stone-700'
        }`;
        toast.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    function escapeHTML(str) {
        if (!str) return '';
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

    // Initial render
    renderStats();
    renderGuestTable();
    renderRecentCheckins();
    renderAdminWishes();
    renderAdminGifts();
    loadSettings();

    // Storage update listener
    window.addEventListener('wedding_db_updated', () => {
        renderStats();
        renderGuestTable();
        renderRecentCheckins();
        renderAdminWishes();
        renderAdminGifts();
    });
});
