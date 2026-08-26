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
- Field gambar (`imageUrl`, `photoUrl`, `thumbnailUrl`) berupa upload file langsung (JPG/PNG/WEBP/GIF, maks. 5MB) lewat `lib/upload.ts` — tersimpan di `public/uploads/<subfolder>/` (di-gitignore, data runtime) dan belum memakai storage eksternal (S3/Cloudinary/dll).
- Kategori dan Kelompok Binaan tidak bisa dihapus selama masih dipakai Artikel/Produk (dicegah lewat penanganan error foreign key `P2003`, bukan `onDelete: Cascade`).
- Testimoni yang masuk lewat form publik `/testimoni` otomatis tersimpan dengan `isPublished = false` dan harus disetujui manual di `/admin/testimonials` sebelum tampil di Beranda.

**Ganti password default sebelum deploy** — `ADMIN_PASSWORD` di `.env.example` hanya placeholder.

## Struktur Proyek

- `prisma/schema.prisma` — Definisi seluruh model database (Testimonial, Category, Post, BinaanGroup, Product, Gallery, ActivityCategory, ActivityPhoto).
- `lib/prisma.ts` — Singleton Prisma Client.
- `lib/session.ts` — Sesi admin (buat & verifikasi token bertanda tangan).
- `lib/upload.ts` — Validasi & penyimpanan file gambar yang diunggah ke `public/uploads/`.
- `lib/posts.ts`, `lib/utils.ts` — Helper query & formatting bersama.
- `middleware.ts` — Menjaga akses ke `/admin/**`.
- `app/layout.tsx` — Root layout (hanya `<html>/<body>`, tanpa chrome situs publik).
- `app/(public)/layout.tsx` — Navbar + Footer publik, membungkus semua halaman pengunjung.
- `app/(public)/(content)/` — Route group full-width untuk halaman konten: `ppm`, `csr`, `binaan`, `penghargaan`, `galeri-kegiatan`, `artikel/[slug]`.
- `app/(public)/search`, `app/(public)/testimoni` — Halaman publik lain di luar route group `(content)`: pencarian artikel, dan form kirim testimoni (dengan moderasi admin).
- `app/admin/login/` — Halaman & Server Actions login/logout (di luar shell sidebar admin).
- `app/admin/(dashboard)/` — Dashboard + CRUD tiap resource (`categories`, `posts`, `binaan-groups`, `products`, `gallery`, `testimonials`, `activity-categories`, `activity-gallery`), dibungkus `components/admin/AdminSidebar.tsx`.
- `components/admin/` — `AdminSidebar`, `DeleteButton` (tombol hapus + confirm), `PhotoRequirements`, `formStyles.ts` (kelas Tailwind form bersama).
- `components/home/` — Bagian-bagian halaman Beranda: `FeaturedPosts`, `BinaanTeaser`, `StatsBar`, `TestimonialSlider`.
- `components/gallery/ActivityCarousel.tsx` — Carousel foto Galeri Kegiatan per kategori.
- `components/layout/` — `Navbar`, `MobileMenu`, `Footer` publik.
- `components/ui/PageBanner.tsx` — Banner judul halaman untuk route di `(content)`.

## Catatan

- Hampir seluruh halaman (publik & admin) memakai `export const dynamic = "force-dynamic"` (di `app/layout.tsx`) karena datanya diambil langsung dari database di setiap request. Ini bisa disesuaikan per-route (mis. `revalidate`) setelah kebutuhan caching lebih jelas.
- Logo (`public/logo.png`) adalah aset asli perusahaan — kalau diganti, sesuaikan juga `width`/`height` pada `<Image>` di `components/layout/Navbar.tsx` dengan dimensi file barunya.
- `next.config.mjs` mengizinkan semua hostname `https` untuk `next/image` guna mempermudah development; batasi ke domain CDN/storage yang sebenarnya sebelum production.
- Warna utama situs (`brand.*`) didefinisikan sekali di `tailwind.config.ts` dan dipakai konsisten lewat kelas seperti `bg-brand`/`text-brand` — ubah di satu tempat untuk rebranding.
- File yang diunggah lewat admin/form publik disimpan di `public/uploads/` di server lokal — kalau deploy ke platform dengan filesystem ephemeral (mis. Vercel), file ini akan hilang saat redeploy; pertimbangkan storage eksternal untuk produksi.
