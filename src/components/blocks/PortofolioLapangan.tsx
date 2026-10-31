'use client'
import React, { useState } from 'react'
import MediaPlaceholder, {
  MediaAspectRatio,
  MediaPlaceholderMode,
} from '@/components/ui/MediaPlaceholder'

export type PortfolioCategory = 'semua' | 'toko' | 'rumah' | 'video'

export interface PortfolioItem {
  title: string
  locationContext: string
  scopeTag: string
  category: 'toko' | 'rumah' | 'video'
  mediaMode: MediaPlaceholderMode
  aspectRatio: MediaAspectRatio
  overlayTag?: string | null
  mediaUrl?: string
}

export interface PortofolioLapanganProps {
  sectionTag?: string | null
  title?: string | null
  subtitle?: string | null
  items?: PortfolioItem[] | null
}

const defaultPortfolioItems: PortfolioItem[] = [
  {
    title: 'Proses Instalasi Jalur Plafon di Ruko',
    locationContext: 'Ruko Komersial • Bekasi Selatan',
    scopeTag: '8 Channel IP Cam PoE',
    category: 'video',
    mediaMode: 'video',
    aspectRatio: '9/16',
    overlayTag: 'Video Lapangan',
  },
  {
    title: 'Kemenangan Galaxy, Bekasi — Instalasi & Perawatan Sistem Kamera Komersial',
    locationContext: 'Kemenangan Galaxy • Bekasi',
    scopeTag: '16 Channel Analog HD 5MP',
    category: 'toko',
    mediaMode: 'image',
    aspectRatio: '4/3',
    overlayTag: 'Toko & Usaha',
  },
  {
    title: 'Penataan Rack Server & DVR Box Rapi Bebas Kabel Semrawut',
    locationContext: 'Ruang Kontrol Toko & Gudang • Jakarta Timur',
    scopeTag: 'Manajemen Rack & PSU Central',
    category: 'toko',
    mediaMode: 'image',
    aspectRatio: '4/3',
    overlayTag: 'Standar Kerapian',
  },
  {
    title: 'Hasil Gambar Monitor Siang/Malam (Infrared & Full-Color) Area Gerbang Utama',
    locationContext: 'Hunian Residensial • Kelapa Gading, Jakarta Utara',
    scopeTag: 'ColorVu / Full-Color 24 Jam',
    category: 'rumah',
    mediaMode: 'image',
    aspectRatio: '4/3',
    overlayTag: 'Rumah Tinggal',
  },
  {
    title: 'Demonstrasi Live Monitoring & Uji Playback di Ponsel Pemilik',
    locationContext: 'Serah Terima & Training Klien • Bekasi Barat',
    scopeTag: 'Remote App iOS & Android',
    category: 'video',
    mediaMode: 'video',
    aspectRatio: '16/9',
    overlayTag: 'Video Lapangan',
  },
  {
    title: 'Perapian Ulang Sistem CCTV Lama yang Terbengkalai',
    locationContext: 'Revitalisasi Jalur & Konektor • Pondok Kelapa',
    scopeTag: 'Troubleshooting & Re-Cabling',
    category: 'rumah',
    mediaMode: 'image',
    aspectRatio: '4/3',
    overlayTag: 'Before / After Perbaikan',
  },
]

const filterTabs: { id: PortfolioCategory; label: string }[] = [
  { id: 'semua', label: 'Semua' },
  { id: 'toko', label: 'Toko & Usaha' },
  { id: 'rumah', label: 'Rumah Tinggal' },
  { id: 'video', label: 'Dokumentasi Video' },
]

export default function PortofolioLapangan({
  sectionTag = 'Bukti Hasil Kerja Nyata',
  title = 'Dokumentasi Proyek & Galeri Lapangan',
  subtitle = 'Transparansi kualitas pengerjaan di lapangan—mulai dari penarikan pipa conduit di atas plafon, perapian box DVR, hingga kejernihan tangkapan layar monitor dan ponsel.',
  items,
}: PortofolioLapanganProps) {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>('semua')
  const portfolioList = items && items.length > 0 ? items : defaultPortfolioItems

  const filteredItems = portfolioList.filter((item) => {
    if (activeFilter === 'semua') return true
    if (activeFilter === 'video') {
      return item.category === 'video' || item.mediaMode === 'video'
    }
    return item.category === activeFilter
  })

  return (
    <section id="portofolio" className="w-full py-12 sm:py-16">
      {/* Header & Segmented Control Filter Bar */}
      <div className="flex flex-col items-center text-center">
        <span className="inline-block rounded-full border border-[#D2D2D7] bg-white px-3.5 py-1 text-xs font-semibold tracking-tight text-[#0071E3]">
          {sectionTag}
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#86868B] sm:text-base">
          {subtitle}
        </p>

        {/* Apple-Style Segmented Control Pills */}
        <div
          role="tablist"
          aria-label="Filter Kategori Portofolio"
          className="mt-7 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-[#D2D2D7]/80 bg-[#E5E5EA]/70 p-1.5 sm:rounded-full"
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab.id)}
                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold tracking-tight transition-all sm:rounded-full sm:text-[13px] ${
                  isActive
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                [ {tab.label} ]
              </button>
            )
          })}
        </div>
      </div>

      {/* Mixed-Media Portfolio Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, idx) => {
          const isPortrait = item.aspectRatio === '9/16'

          return (
            <article
              key={`${item.title}-${idx}`}
              className={`flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E5E5EA] bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-[#D2D2D7] hover:shadow-md ${
                isPortrait ? 'md:row-span-2' : ''
              }`}
            >
              {/* Media Placeholder Container */}
              <div className="w-full overflow-hidden rounded-2xl">
                <MediaPlaceholder
                  mode={item.mediaMode}
                  aspectRatio={item.aspectRatio}
                  src={item.mediaUrl}
                  label={item.title}
                  tag={item.overlayTag || undefined}
                  className="rounded-2xl border-0"
                />
              </div>

              {/* Project Metadata: Client/Location Context, Scope Tag, and Clean Caption */}
              <div className="flex flex-1 flex-col justify-between px-2 pt-4 pb-1.5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#86868B]">
                      {item.locationContext}
                    </span>
                    <span className="inline-flex items-center rounded-md border border-[#E5E5EA] bg-[#F5F5F7] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0071E3]">
                      {item.scopeTag}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-[15px] font-semibold leading-snug tracking-tight text-[#1D1D1F] sm:text-base">
                    {item.title}
                  </h3>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
