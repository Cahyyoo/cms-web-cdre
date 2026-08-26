# Stargate Web CMS

Portal website & CMS kustom untuk PT Stargate Pasific Resource. Dibangun dengan Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma ORM, dan MySQL.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Salin `.env.example` menjadi `.env` dan sesuaikan nilainya:
   ```
   cp .env.example .env
   ```
   - `DATABASE_URL` — kredensial MySQL Anda.
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — login untuk `/admin`.
   - `SESSION_SECRET` — string acak panjang untuk menandatangani cookie sesi admin, mis. `openssl rand -hex 32`.

3. Jalankan migrasi Prisma untuk membuat tabel di database:
   ```
   npm run prisma:migrate
   ```

4. (Opsional) Isi data contoh:
   ```
   npm run prisma:seed
   ```

5. Jalankan development server:
   ```
   npm run dev
   ```

## Admin CMS (`/admin`)

Panel admin untuk mengelola seluruh konten dinamis tanpa Prisma Studio: Testimoni, Kategori, Artikel PPM/CSR (Post), Kelompok Binaan, Produk, Galeri Penghargaan, dan Galeri Kegiatan (kategori + foto carousel).

- Login di `/admin/login` memakai `ADMIN_USERNAME`/`ADMIN_PASSWORD` dari `.env` (satu akun bersama, tidak ada tabel user).
- Autentikasi berbasis cookie HttpOnly yang ditandatangani (HMAC, Web Crypto API) — lihat `lib/session.ts` dan `middleware.ts`. Middleware melindungi semua route `/admin/**` kecuali `/admin/login`.
- Setiap resource punya pola CRUD yang sama: `list (page.tsx)` → `new/page.tsx` → `[id]/page.tsx` (edit), dengan Server Actions di `actions.ts` pada masing-masing folder (`app/admin/(dashboard)/<resource>/`).
- Field gambar (`imageUrl`, `photoUrl`, `thumbnailUrl`) masih berupa input URL teks — belum ada upload file, karena stack ini belum menyertakan storage (S3/Cloudinary/dll). Tempel URL gambar yang sudah di-hosting di layanan lain.
- Kategori dan Kelompok Binaan tidak bisa dihapus selama masih dipakai Artikel/Produk (dicegah lewat penanganan error foreign key `P2003`, bukan `onDelete: Cascade`).

**Ganti password default sebelum deploy** — `ADMIN_PASSWORD` di `.env.example` hanya placeholder.

## Struktur Proyek

- `prisma/schema.prisma` — Definisi seluruh model database (Testimonial, Category, Post, BinaanGroup, Product, Gallery, ActivityCategory, ActivityPhoto).
- `lib/prisma.ts` — Singleton Prisma Client.
- `lib/session.ts` — Sesi admin (buat & verifikasi token bertanda tangan).
- `lib/posts.ts`, `lib/utils.ts` — Helper query & formatting bersama.
- `middleware.ts` — Menjaga akses ke `/admin/**`.
- `app/layout.tsx` — Root layout (hanya `<html>/<body>`, tanpa chrome situs publik).
- `app/(public)/layout.tsx` — Navbar + Footer publik, membungkus semua halaman pengunjung.
- `app/(public)/(content)/` — Route group yang menerapkan grid dua kolom (konten 75% + `<Sidebar />` 25%): `ppm`, `csr`, `binaan`, `penghargaan`, `galeri-kegiatan`, `artikel/[slug]`.
- `app/(public)/search` — Halaman publik full-width di luar grid dua kolom.
- `app/admin/login/` — Halaman & Server Actions login/logout (di luar shell sidebar admin).
- `app/admin/(dashboard)/` — Dashboard + CRUD tiap resource, dibungkus `components/admin/AdminSidebar.tsx`.
- `components/admin/` — `AdminSidebar`, `DeleteButton` (tombol hapus + confirm), `formStyles.ts` (kelas Tailwind form bersama).

## Catatan

- Hampir seluruh halaman (publik & admin) memakai `export const dynamic = "force-dynamic"` (di `app/layout.tsx`) karena datanya diambil langsung dari database di setiap request. Ini bisa disesuaikan per-route (mis. `revalidate`) setelah kebutuhan caching lebih jelas.
- Logo (`public/logo.png`) adalah aset asli perusahaan — kalau diganti, sesuaikan juga `width`/`height` pada `<Image>` di `components/layout/Navbar.tsx` dengan dimensi file barunya.
- Gambar hero/banner (hero Beranda, banner sidebar) memakai `picsum.photos` sebagai placeholder eksternal — ganti `src`-nya di `app/(public)/page.tsx` dan `components/layout/Sidebar.tsx` dengan aset final.
- `next.config.mjs` mengizinkan semua hostname `https` untuk `next/image` guna mempermudah development; batasi ke domain CDN/storage yang sebenarnya sebelum production.
- Warna utama situs (`brand.*`) didefinisikan sekali di `tailwind.config.ts` dan dipakai konsisten lewat kelas seperti `bg-brand`/`text-brand` — ubah di satu tempat untuk rebranding.
