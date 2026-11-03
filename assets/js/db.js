// Database & State Management using LocalStorage for Wedding App
const STORAGE_KEYS = {
    EVENT_INFO: 'wedding_event_info',
    GUESTS: 'wedding_guests',
    WISHES: 'wedding_wishes',
    GIFTS: 'wedding_gifts'
};

const DEFAULT_EVENT_INFO = {
    groom: {
        nickname: "Raden",
        fullName: "Raden Arya Pratama, S.T.",
        father: "Bpk. Bambang Pratama",
        mother: "Ibu Ratna Dewi",
        bio: "Putra pertama dari Bpk. Bambang Pratama & Ibu Ratna Dewi. Seorang Arsitek yang menemukan rumah ternyamannya.",
        instagram: "@radenarya",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
    },
    bride: {
        nickname: "Nadine",
        fullName: "dr. Nadine Anindita Putri",
        father: "Bpk. Hendra Kusuma",
        mother: "Ibu Sri Rahayu",
        bio: "Putri bungsu dari Bpk. Hendra Kusuma & Ibu Sri Rahayu. Seorang dokter gigi yang meluluhkan hati dengan senyumannya.",
        instagram: "@nadineanindita",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
    },
    date: "2026-12-20",
    time: "09:00",
    akad: {
        title: "Akad Nikah",
        date: "Minggu, 20 Desember 2026",
        time: "08:00 - 10:00 WIB",
        venue: "Grand Ballroom The Hermitage Hotel",
        address: "Jl. Cilacap No.1, Menteng, Jakarta Pusat",
        mapsUrl: "https://maps.google.com/?q=The+Hermitage+Hotel+Jakarta"
    },
    resepsi: {
        title: "Resepsi Pernikahan",
        date: "Minggu, 20 Desember 2026",
        time: "11:00 - 14:00 WIB",
        venue: "Grand Ballroom The Hermitage Hotel",
        address: "Jl. Cilacap No.1, Menteng, Jakarta Pusat",
        mapsUrl: "https://maps.google.com/?q=The+Hermitage+Hotel+Jakarta"
    },
    bankAccounts: [
        { bank: "BCA", number: "8830192841", name: "Raden Arya Pratama" },
        { bank: "Bank Mandiri", number: "1370019283741", name: "Nadine Anindita Putri" }
    ],
    qrisUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=WEDDING-RADEN-NADINE-AMPLOP-DIGITAL",
    giftAddress: "Jl. Menteng Indah Blok C3 No. 12, Menteng, Jakarta Pusat (Penerima: Raden / 081234567890)",
    musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-piano-112199.mp3"
};

const DEFAULT_GUESTS = [
    {
        id: "G-101",
        code: "WED-001",
        name: "Bapak Budi Santoso & Keluarga",
        category: "VIP",
        phone: "081234567891",
        pax: 2,
        status: "hadir", // hadir, tidak, belum
        checkedIn: true,
        checkedInAt: "10:15 WIB",
        table: "VIP-A1",
        notes: "Mitra Bisnis Utama"
    },
    {
        id: "G-102",
        code: "WED-002",
        name: "Dr. Siti Aminah, Sp.A",
        category: "Keluarga",
        phone: "081234567892",
        pax: 2,
        status: "hadir",
        checkedIn: false,
        checkedInAt: null,
        table: "Family-01",
        notes: "Tante dari pihak Pengantin Wanita"
    },
    {
        id: "G-103",
        code: "WED-003",
        name: "Reza Rahadian & Partner",
        category: "Sahabat",
        phone: "081234567893",
        pax: 2,
        status: "hadir",
        checkedIn: false,
        checkedInAt: null,
        table: "Friends-B2",
        notes: "Teman SMA Raden"
    },
    {
        id: "G-104",
        code: "WED-004",
        name: "Dewi Lestari",
        category: "Teman Kantor",
        phone: "081234567894",
        pax: 1,
        status: "tidak",
        checkedIn: false,
        checkedInAt: null,
        table: "Office-C3",
        notes: "Ada dinas ke luar kota"
    },
    {
        id: "G-105",
        code: "WED-005",
        name: "Keluarga Besar Bpk. Anton Wijaya",
        category: "VIP",
        phone: "081234567895",
        pax: 4,
        status: "hadir",
        checkedIn: true,
        checkedInAt: "10:30 WIB",
        table: "VIP-A2",
        notes: "Kolega Ayah Raden"
    },
    {
        id: "G-106",
        code: "WED-006",
        name: "Andi Firmansyah",
        category: "Teman Kantor",
        phone: "081234567896",
        pax: 1,
        status: "belum",
        checkedIn: false,
        checkedInAt: null,
        table: "Office-C1",
        notes: "Undangan dikirim via WA"
    }
];

const DEFAULT_WISHES = [
    {
        id: "W-1",
        name: "Bapak Budi Santoso",
        attendance: "hadir",
        message: "Selamat menempuh hidup baru untuk Raden dan dr. Nadine. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah serta senantiasa dilimpahi rezeki dan kebahagiaan.",
        createdAt: "2026-11-01 14:20",
        pinned: true
    },
    {
        id: "W-2",
        name: "Dr. Siti Aminah, Sp.A",
        attendance: "hadir",
        message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Selamat ya keponakan tante tercantik Nadine! Welcome to the new chapter with Raden.",
        createdAt: "2026-11-02 09:15",
        pinned: false
    },
    {
        id: "W-3",
        name: "Reza Rahadian",
        attendance: "hadir",
        message: "Happy wedding brother Raden & Nadine! Akhirnya berlabuh juga di pelaminan setelah penantian panjang. Sukses terus buat kalian berdua, sampai ketemu di resepsi!",
        createdAt: "2026-11-02 18:45",
        pinned: false
    },
    {
        id: "W-4",
        name: "Dewi Lestari",
        attendance: "tidak",
        message: "Selamat yaa Nadine & Raden! Mohon maaf sekali belum bisa hadir langsung karena dinas luar pulau, tapi doa terbaik selalu mengiringi langkah kalian berdua.",
        createdAt: "2026-11-03 08:30",
        pinned: false
    }
];

const DEFAULT_GIFTS = [
    { id: "GF-1", sender: "Bapak Budi Santoso", bank: "BCA", amount: 2000000, note: "Tanda kasih dari Budi Santoso sekeluarga", date: "2026-11-01" },
    { id: "GF-2", sender: "Reza Rahadian", bank: "Bank Mandiri", amount: 1000000, note: "Selamat bro! Untuk honeymoon kalian!", date: "2026-11-02" }
];

const WeddingDB = {
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.EVENT_INFO)) {
            localStorage.setItem(STORAGE_KEYS.EVENT_INFO, JSON.stringify(DEFAULT_EVENT_INFO));
        }
        if (!localStorage.getItem(STORAGE_KEYS.GUESTS)) {
            localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(DEFAULT_GUESTS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.WISHES)) {
            localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(DEFAULT_WISHES));
        }
        if (!localStorage.getItem(STORAGE_KEYS.GIFTS)) {
            localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(DEFAULT_GIFTS));
        }
    },

    // Event Info
    getEventInfo() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENT_INFO)) || DEFAULT_EVENT_INFO;
        } catch (e) {
            return DEFAULT_EVENT_INFO;
        }
    },
    updateEventInfo(newInfo) {
        localStorage.setItem(STORAGE_KEYS.EVENT_INFO, JSON.stringify(newInfo));
        this.triggerSync();
        return newInfo;
    },

    // Guests
    getGuests() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GUESTS)) || [];
        } catch (e) {
            return [];
        }
    },
    getGuestByCode(code) {
        if (!code) return null;
        const guests = this.getGuests();
        return guests.find(g => g.code.toLowerCase() === code.trim().toLowerCase()) || null;
    },
    getGuestByName(name) {
        if (!name) return null;
        const guests = this.getGuests();
        return guests.find(g => g.name.toLowerCase().includes(name.trim().toLowerCase())) || null;
    },
    saveGuests(guests) {
        localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
        this.triggerSync();
    },
    addGuest(guest) {
        const guests = this.getGuests();
        const nextId = "G-" + (guests.length + 101);
        const nextCode = "WED-" + String(guests.length + 1).padStart(3, '0');
        const newGuest = {
            id: nextId,
            code: guest.code || nextCode,
            name: guest.name,
            category: guest.category || 'Sahabat',
            phone: guest.phone || '',
            pax: parseInt(guest.pax) || 1,
            status: guest.status || 'belum',
            checkedIn: false,
            checkedInAt: null,
            table: guest.table || 'Reguler',
            notes: guest.notes || ''
        };
        guests.push(newGuest);
        this.saveGuests(guests);
        return newGuest;
    },
    updateGuest(id, updatedFields) {
        const guests = this.getGuests();
        const index = guests.findIndex(g => g.id === id);
        if (index !== -1) {
            guests[index] = { ...guests[index], ...updatedFields };
            this.saveGuests(guests);
            return guests[index];
        }
        return null;
    },
    deleteGuest(id) {
        let guests = this.getGuests();
        guests = guests.filter(g => g.id !== id);
        this.saveGuests(guests);
    },
    checkInGuest(codeOrId) {
        const guests = this.getGuests();
        const guest = guests.find(g => g.id === codeOrId || g.code.toLowerCase() === codeOrId.toLowerCase());
        if (!guest) {
            return { success: false, message: "Tamu tidak ditemukan dalam daftar undangan!" };
        }
        if (guest.checkedIn) {
            return { success: false, alreadyCheckedIn: true, guest, message: `Tamu ${guest.name} sudah check-in pada pukul ${guest.checkedInAt}!` };
        }
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
        guest.checkedIn = true;
        guest.checkedInAt = timeStr;
        guest.status = 'hadir';
        this.saveGuests(guests);
        return { success: true, guest, message: `Check-in Berhasil! Selamat datang, ${guest.name} (${guest.category} - ${guest.table})` };
    },

    // Wishes
    getWishes() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHES)) || [];
        } catch (e) {
            return [];
        }
    },
    addWish(wish) {
        const wishes = this.getWishes();
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const newWish = {
            id: "W-" + Date.now(),
            name: wish.name,
            attendance: wish.attendance || 'hadir',
            message: wish.message,
            createdAt: dateStr,
            pinned: false
        };
        wishes.unshift(newWish);
        localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(wishes));

        // Also update guest status if matched
        const guests = this.getGuests();
        const guest = guests.find(g => g.name.toLowerCase() === wish.name.toLowerCase());
        if (guest && wish.attendance) {
            guest.status = wish.attendance;
            this.saveGuests(guests);
        }

        this.triggerSync();
        return newWish;
    },
    deleteWish(id) {
        let wishes = this.getWishes();
        wishes = wishes.filter(w => w.id !== id);
        localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(wishes));
        this.triggerSync();
    },
    togglePinWish(id) {
        const wishes = this.getWishes();
        const wish = wishes.find(w => w.id === id);
        if (wish) {
            wish.pinned = !wish.pinned;
            localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(wishes));
            this.triggerSync();
        }
    },

    // Gifts / Amplop Digital
    getGifts() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GIFTS)) || [];
        } catch (e) {
            return [];
        }
    },
    addGift(gift) {
        const gifts = this.getGifts();
        const newGift = {
            id: "GF-" + Date.now(),
            sender: gift.sender,
            bank: gift.bank,
            amount: parseFloat(gift.amount) || 0,
            note: gift.note || '',
            date: new Date().toISOString().slice(0, 10)
        };
        gifts.unshift(newGift);
        localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(gifts));
        this.triggerSync();
        return newGift;
    },

    // Statistics for Admin
    getStats() {
        const guests = this.getGuests();
        const wishes = this.getWishes();
        const gifts = this.getGifts();

        const totalGuests = guests.length;
        const totalPax = guests.reduce((sum, g) => sum + (parseInt(g.pax) || 1), 0);
        const attendingGuests = guests.filter(g => g.status === 'hadir');
        const attendingPax = attendingGuests.reduce((sum, g) => sum + (parseInt(g.pax) || 1), 0);
        const declinedGuests = guests.filter(g => g.status === 'tidak').length;
        const pendingGuests = guests.filter(g => g.status === 'belum' || !g.status).length;
        const checkedInCount = guests.filter(g => g.checkedIn).length;
        const totalGiftAmount = gifts.reduce((sum, g) => sum + (parseFloat(g.amount) || 0), 0);

        return {
            totalGuests,
            totalPax,
            attendingCount: attendingGuests.length,
            attendingPax,
            declinedCount: declinedGuests,
            pendingCount: pendingGuests,
            checkedInCount,
            totalWishes: wishes.length,
            totalGiftsCount: gifts.length,
            totalGiftAmount
        };
    },

    resetToDefault() {
        localStorage.setItem(STORAGE_KEYS.EVENT_INFO, JSON.stringify(DEFAULT_EVENT_INFO));
        localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(DEFAULT_GUESTS));
        localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(DEFAULT_WISHES));
        localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(DEFAULT_GIFTS));
        this.triggerSync();
    },

    triggerSync() {
        window.dispatchEvent(new Event('wedding_db_updated'));
    }
};

// Auto initialize
WeddingDB.init();
