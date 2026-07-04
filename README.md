# 💰 Dompetku

Aplikasi manajemen keuangan pribadi — dashboard real-time untuk hutang, pengeluaran, pendapatan, dan saldo. 100% berjalan di sisi klien (tidak butuh backend), data tersimpan di IndexedDB browser Anda.

## Fitur

- **Dashboard real-time**: saldo, total pendapatan, total pengeluaran, sisa hutang.
- **Pemasukan**: catat, edit, hapus — otomatis menambah saldo.
- **Pengeluaran**: catat, edit, hapus — otomatis mengurangi saldo.
- **Hutang**: catat hutang (nama, keperluan, sumber), bayar sebagian/lunas — otomatis mengurangi saldo saat dibayar.
- **Laporan**: Harian, Bulanan, Tahunan — dengan export ke Excel (.xlsx).
- **Pengaturan**: tema Dark/Light, backup database (.json), import database (.json), reset aplikasi.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser Anda.

## Build untuk Produksi

```bash
npm run build
npm run preview
```

## Tech Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Dexie.js (IndexedDB) · SheetJS (xlsx)

## Struktur Folder

```
src/
├── components/   # UI reusable (layout, dashboard, forms, tables, ui)
├── views/        # Halaman aplikasi (routing)
├── hooks/        # Custom hooks (live query, tema, dll)
├── services/     # Layer database & logic (Dexie, backup, laporan)
├── types/        # Kontrak data TypeScript
└── utils/        # Helper format currency/date
```

## Catatan

- Semua data tersimpan lokal di browser (IndexedDB). Membersihkan cache/data browser akan menghapus data aplikasi — gunakan fitur **Backup Database** secara berkala.
- Fitur import akan **menggantikan seluruh data** yang ada saat ini, pastikan Anda sudah backup jika perlu.
