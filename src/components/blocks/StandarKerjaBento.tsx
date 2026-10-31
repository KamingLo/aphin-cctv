import React from 'react'
import MediaPlaceholder from '@/components/ui/MediaPlaceholder'

export interface BentoStandardTile {
  span?: 'large' | 'normal' | null
  badge: string
  title: string
  description: string
  mediaLabel?: string | null
  imageUrl?: string
}

export interface StandarKerjaBentoProps {
  sectionTag?: string | null
  title?: string | null
  subtitle?: string | null
  tiles?: BentoStandardTile[] | null
}

const defaultTiles: BentoStandardTile[] = [
  {
    span: 'large',
    badge: '01 • Proteksi Fisik & Estetika',
    title: 'Manajemen Kabel Terlindungi',
    description:
      'Setiap tarikan kabel koaksial maupun LAN CAT6 dilindungi pipa conduit PVC berkualitas, diklem rapi mengikuti sudut struktur plafon/dinding, menggunakan pengikat kabel (cable ties) terukur, serta bebas dari kabel menjuntai yang merusak estetika bangunan atau rawan gigitan tikus.',
    mediaLabel: 'Foto Makro Kerapian Jalur Kabel Plafon & Pipa Conduit',
  },
  {
    span: 'normal',
    badge: '02 • Akurasi Sudut Pandang',
    title: 'Survei Titik & Eliminasi Blind Spot',
    description:
      'Penentuan posisi dan kemiringan lensa kamera diperhitungkan secara presisi untuk mengawasi area krusial seperti meja kasir, pintu akses keluar-masuk, lorong gudang, hingga pagar perimeter tanpa titik buta.',
  },
  {
    span: 'normal',
    badge: '03 • Akses Jarak Jauh',
    title: 'Akses Pantau HP Cepat & Stabil',
    description:
      'Konfigurasi penuh pada smartphone pemilik (iOS & Android) dengan koneksi cloud P2P yang stabil. Disertai panduan langsung cara memutar ulang rekaman (playback) dan mengunduh bukti video ke galeri HP.',
  },
  {
    span: 'large',
    badge: '04 • Kejujuran Komponen',
    title: 'Spesifikasi Alat Transparan',
    description:
      '100% menggunakan perangkat orisinal sesuai penawaran: resolusi MP kamera murni, Harddisk khusus pengawasan 24/7 (Surveillance-Grade WD Purple / Seagate SkyHawk), serta kabel tembaga murni (pure copper) agar sinyal video bebas bintik dan tahan bertahun-tahun.',
  },
]

export default function StandarKerjaBento({
  sectionTag = 'Standar Kerja Lapangan',
  title = 'Disiplin Teknis di Setiap Titik Instalasi',
  subtitle = 'Sistem kamera pengawas yang handal tidak hanya bergantung pada merek kamera, tetapi pada kerapian jalur kabel, kualitas konektor, dan ketepatan konfigurasi teknis.',
  tiles,
}: StandarKerjaBentoProps) {
  const bentoTiles = tiles && tiles.length > 0 ? tiles : defaultTiles

  return (
    <section id="standar-kerja" className="w-full py-12 sm:py-16">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-[#D2D2D7] bg-white px-3.5 py-1 text-xs font-semibold tracking-tight text-[#0071E3]">
          {sectionTag}
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#86868B] sm:text-base">
          {subtitle}
        </p>
      </div>

      {/* Apple-Style 4-Tile Asymmetric Bento Grid */}
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {bentoTiles.map((tile, idx) => {
          const isLarge = tile.span === 'large' || idx === 0 || idx === 3
          const hasInlineMedia = Boolean(tile.mediaLabel || tile.imageUrl)

          return (
            <article
              key={idx}
              className={`flex flex-col justify-between rounded-3xl border border-[#E5E5EA] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#D2D2D7] hover:shadow-md sm:p-8 ${
                isLarge ? 'md:col-span-2' : 'md:col-span-1'
              }`}
            >
              <div className={hasInlineMedia ? 'grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center' : ''}>
                <div className={hasInlineMedia ? 'lg:col-span-6' : ''}>
                  <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-3 py-1 text-[11px] font-semibold tracking-tight text-[#0071E3]">
                    {tile.badge}
                  </span>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-[#1D1D1F] sm:text-2xl">
                    {tile.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#86868B] sm:text-[15px]">
                    {tile.description}
                  </p>

                  {/* Extra Hardware Spec Pills for Tile 4 */}
                  {idx === 3 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {[
                        'Sensor Resolusi Murni',
                        'HDD Surveillance 24/7',
                        'Kabel Inti Tembaga Murni',
                        'Power Supply Terukur',
                      ].map((specPill) => (
                        <span
                          key={specPill}
                          className="rounded-lg border border-[#E5E5EA] bg-[#F5F5F7] px-3 py-1.5 text-xs font-medium text-[#1D1D1F]"
                        >
                          {specPill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inline Visual Placeholder for Tile 1 (or any tile with mediaLabel/imageUrl) */}
                {hasInlineMedia && (
                  <div className="lg:col-span-6">
                    <MediaPlaceholder
                      mode="image"
                      aspectRatio="4/3"
                      src={tile.imageUrl}
                      label={
                        tile.mediaLabel ||
                        'Foto Makro Kerapian Jalur Kabel Plafon & Pipa Conduit'
                      }
                      className="rounded-2xl"
                    />
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
