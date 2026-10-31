# Aturan Pengorganisasian Payload Collections

File ini menyimpan instruksi dan aturan struktur folder untuk Payload CMS Collections dalam proyek ini agar selalu diingat dan dipatuhi oleh AI Coding Assistant.

## Aturan Penempatan Koleksi

1. **Fitur Utama CMS (Main Features)**
   - Jika berupa fitur utama CMS (misal: `blogs`, `products`, `pages`, `users`, `media`), simpan file konfigurasinya di root folder collections.
   - Path: `src/collections/<NamaKoleksi>.ts`

2. **Komponen Kecil (Small Components)**
   - Jika berupa komponen kecil pembentuk layout halaman (misal: `HeroBento`, `LayananUtama`, `StandarKerjaBento`), simpan file konfigurasinya di folder `components`.
   - Path: `src/collections/components/<NamaKoleksi>.ts`

3. **Komponen Global Kecil (Global Small Components)**
   - Jika berupa komponen kecil yang pasti ada di setiap halaman dan bersifat global (misal: `NavbarLiquid`, `FooterGlobal`), simpan file konfigurasinya di folder `components/global`.
   - Path: `src/collections/components/global/<NamaKoleksi>.ts`

## Struktur Folder Collections Saat Ini

```
src/collections/
├── Blogs.ts                   # Fitur Utama (Blogs)
├── Invoices.ts                # Fitur Utama (Manajemen Nota & Invoice Proyek)
├── Media.ts                   # Fitur Utama (Media Upload: Foto & Video)
├── Pages.ts                   # Fitur Utama (Pages)
├── Portfolio.ts               # Fitur Utama (Portofolio & Dokumentasi Lapangan)
├── Users.ts                   # Fitur Utama (User Auth)
└── components/
    ├── AlurKerja.ts           # Komponen Kecil (Workflow, Area Layanan & WhatsApp CTA)
    ├── BannerLayanan.ts       # Komponen Kecil
    ├── EkosistemPerangkat.ts  # Komponen Kecil (Hardware Ecosystem & Architecture)
    ├── FAQAccordion.ts        # Komponen Kecil
    ├── FeaturesGrid.ts        # Komponen Kecil
    ├── HeroBento.ts           # Komponen Kecil (Hero & Trust Bar)
    ├── HeroSekunder.ts        # Komponen Kecil
    ├── LayananUtama.ts        # Komponen Kecil (Core Services 3-Col)
    ├── PortofolioLapangan.ts  # Komponen Kecil (Real-World Portfolio & Field Gallery)
    ├── RecentBlogs.ts         # Komponen Kecil
    ├── RichContent.ts         # Komponen Kecil
    ├── StandarKerjaBento.ts   # Komponen Kecil (Craftsmanship Standards Bento Grid)
    └── global/
        ├── FooterGlobal.ts    # Komponen Global Kecil
        └── NavbarLiquid.ts    # Komponen Global Kecil
```
