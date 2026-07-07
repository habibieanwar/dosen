# DOSEN — Rencana Implementasi UI

Aplikasi frontend-only (React + TypeScript + Tailwind + lucide-react + shadcn) dengan estetika AI search modern, warm off-white, tanpa elemen brand Perplexity. Semua teks bahasa Indonesia, semua state pakai mock data.

## Design tokens (src/styles.css)
Ganti palet default menjadi warm neutral:
- `--background` #FAFAF8, `--foreground` #24211E
- `--sidebar` #F3F2EF, `--muted-foreground` #6F6A64
- `--border` #E1DED8, `--primary` #24211E / `--primary-foreground` #FAFAF8
- radius 16–24px (naikkan `--radius` ke 1rem)
- Font: Inter untuk body, display serif ringan (Instrument Serif / DM Serif) untuk wordmark "DOSEN" — dimuat via `<link>` di `__root.tsx`

## Struktur route
- `src/routes/__root.tsx` — set metadata "DOSEN — Asisten Akademik AI", link Google Fonts, wrap `<Outlet />`.
- `src/routes/index.tsx` — halaman utama (hero + fitur, atau chat view jika ada pertanyaan aktif).
- Semua state UI (sidebar collapsed, modal login, mode Cari/Computer, model, kategori aktif, pesan chat, dokumen dummy) dikelola via satu React context ringan `AppStateContext` di `src/lib/app-state.tsx` supaya sidebar & main area sinkron tanpa prop drilling.

## Komponen (src/components/dosen/)
- `AppShell.tsx` — layout grid: sidebar kiri + area utama; handle responsif (drawer di mobile via shadcn `Sheet`).
- `Sidebar.tsx` — logo D + wordmark, tombol collapse (ChevronsLeft), menu: Baru, Computer, Ruang, Artefak, Sesuaikan, Riwayat (lucide: Plus, Monitor, LayoutGrid, Sparkles, SlidersHorizontal, History). Menu "Baru" aktif. Footer sidebar: "Tidak ada sesi terbaru".
- `MobileSidebar.tsx` — `Sheet` untuk mobile, dipicu ikon hamburger di top bar.
- `TopBar.tsx` — kiri: hamburger (mobile) + judul kecil; tengah: kategori (Temukan, Keuangan, Kesehatan, Akademik, Paten) dengan active state klik; kanan: tombol "Masuk" membuka modal login.
- `Hero.tsx` — wordmark besar "DOSEN" (serif display) + `SearchBox`.
- `SearchBox.tsx` — card besar rounded-3xl shadow-sm: textarea auto-grow placeholder "Tanya apa saja…"; action row bawah:
  - Tombol Plus (DropdownMenu: Upload PDF / DOCX / TXT — pilih apa saja tampilkan toast + card dummy dokumen di atas hero/chat)
  - Pill "Cari" (Search + ChevronDown) — toggle mode
  - Pill "Computer" (Monitor) — toggle mode
  - Kanan: dropdown "Model" (DOSEN Basic / Academic / Research)
  - Tombol kirim (ArrowUp) — Enter juga submit
- `FeatureCards.tsx` — grid 2×2 (desktop) / stack (mobile) 4 kartu: Cari apa saja, Selesaikan pekerjaan akademik, Analisis dokumen, Mode Computer. Border halus, hover lift.
- `ChatView.tsx` — muncul saat `messages.length > 0`. List: bubble pertanyaan user (bg secondary), lalu card jawaban DOSEN dengan teks contoh, section "Sumber" (3 source card dummy: judul, domain, snippet), action row (Salin/Suka/Tidak suka dengan lucide Copy, ThumbsUp, ThumbsDown). Search box sticky di bawah.
- `LoginModal.tsx` — shadcn `Dialog`, panel kanan (di desktop di-anchor kanan via className), berisi:
  - Logo D kecil, judul "Masuk atau daftar gratis", subtitle "Simpan dan sinkronkan pencarian Anda"
  - Tombol hitam "Lanjutkan dengan Google", tombol abu "Lanjutkan dengan Apple"
  - Divider "atau"
  - Input email + tombol disabled "Lanjutkan dengan email" (enable saat email diisi)
  - Footer link "Single sign-on (SSO)"
  - Tombol X di kanan atas
- `DocumentAttachedCard.tsx` — card dummy: "Dokumen berhasil ditambahkan. Anda dapat bertanya berdasarkan isi dokumen."
- `Logo.tsx` — huruf "D" dalam kotak rounded (bg foreground, text background), dipakai di sidebar & modal.

## Interaksi (mock)
- Sidebar collapse → lebar 280px ↔ 64px (icon-only) di desktop; drawer di mobile.
- Klik menu kategori → set active category.
- Klik pill Cari/Computer → toggle mode aktif (exclusive).
- Dropdown model → simpan pilihan.
- Submit search → push user message + jawaban dummy fixed ke state, render `ChatView`.
- Klik Baru di sidebar → reset messages.
- Upload dropdown → tambah `DocumentAttachedCard` ke state.
- Modal login open via tombol "Masuk"; close via X, ESC, atau klik luar.

## Responsif
- ≥ md: sidebar tetap, kategori navbar horizontal, modal muncul sebagai panel kanan.
- < md: sidebar jadi drawer; kategori navbar scroll horizontal; modal fullscreen sheet; hero wordmark ukuran mengecil; fitur cards stack.

## File yang dibuat/diubah
- ubah: `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx`
- baru: `src/lib/app-state.tsx`, `src/components/dosen/{AppShell,Sidebar,MobileSidebar,TopBar,Hero,SearchBox,FeatureCards,ChatView,LoginModal,DocumentAttachedCard,Logo}.tsx`
- pakai shadcn yang sudah ada: `button`, `dialog`, `sheet`, `dropdown-menu`, `input`, `textarea`, `separator`, `sonner` (toast). Instal via CLI hanya yang belum ada.

## Kualitas
- Tidak ada backend, tidak ada Lovable Cloud.
- Semua warna via token semantik (tidak ada `text-white`/`bg-black` hardcoded).
- Typecheck bersih, tidak ada import yang tidak terpakai.
