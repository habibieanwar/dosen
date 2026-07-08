# Ganti Font menjadi Port Lligat Sans

## Tujuan
Mengganti seluruh tipografi aplikasi DOSEN dari Arial ke font Google **Port Lligat Sans**.

## Langkah Implementasi
1. **Muat font dari Google Fonts**  
   Tambahkan `<link>` ke stylesheet Google Fonts di `head().links` pada `src/routes/__root.tsx`.

2. **Perbarui token font**  
   Di `src/styles.css`, ubah nilai `--font-sans` dan `--font-display` dari `"Arial", ui-sans-serif, system-ui, sans-serif` menjadi `"Port Lligat Sans", ui-sans-serif, system-ui, sans-serif`.

3. **Verifikasi**  
   Jalankan typecheck/build dan cek preview untuk memastikan font berubah di seluruh UI.

## Catatan
- Tidak ada perubahan struktur komponen.
- Port Lligat Sans tersedia di Google Fonts, sehingga cukup via `<link>` tanpa instalasi npm.
- Fallback tetap dipertahankan agar tetap aman jika font eksternal gagal dimuat.