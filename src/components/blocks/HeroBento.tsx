import React from 'react'
import MediaPlaceholder from '@/components/ui/MediaPlaceholder'

export interface HeroFeature {
  title: string
  value: string
  detail?: string | null
}

export interface HeroBentoProps {
  title?: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  showcaseLabel?: string
  imageUrl?: string
  features?: HeroFeature[]
}

const defaultTrustItems: HeroFeature[] = [
  {
    title: 'Pengalaman Lapangan',
    value: 'Jam Terbang Tinggi',
    detail: 'Rekam jejak bertahun-tahun menangani instalasi & perbaikan sistem keamanan',
  },
  {
    title: 'Ragam Proyek',
    value: 'Skala Rumah & Bisnis',
    detail: 'Residensial, Ruko, Toko Komersial, Kantor, hingga Area Pergudangan',
  },
  {
    title: 'Kualitas Teruji',
    value: 'Instalasi Presisi',
    detail: 'Penyusunan kabel terlindungi pipa conduit & penataan rak DVR/NVR rapi',
  },
  {
    title: 'Dukungan Langsung',
    value: 'Garansi & Panduan',
    detail: 'Garansi pengerjaan teknis & konfigurasi pantau langsung di HP Anda',
  },
]

const defaultWhatsappUrl =
  'https://wa.me/6281234567890?text=Halo%20Pak%20Aphin%2C%20saya%20ingin%20konsultasi%20pemasangan%2Fperbaikan%20CCTV...'

export default function HeroBento({
  title = 'Instalasi CCTV Presisi, Rapi, & Bergaransi Langsung oleh Teknisi Berpengalaman',
  subtitle = 'Teknisi Spesialis Sistem Keamanan & CCTV',
  description = 'Pengerjaan jalur kabel terlindungi pipa conduit, penataan unit DVR/NVR yang bersih, pengaturan pantau jarak jauh via aplikasi HP yang stabil, serta pertanggungjawaban teknis langsung oleh Pak Aphin.',
  ctaText = 'Konsultasi via WhatsApp',
  ctaLink = defaultWhatsappUrl,
  secondaryCtaText = 'Lihat Bukti Pekerjaan',
  secondaryCtaLink = '#portofolio',
  showcaseLabel = 'Video Showcase: Dokumentasi Instalasi Lapangan CCTV APHIN',
  imageUrl,
  features,
}: HeroBentoProps) {
  const trustItems = features && features.length > 0 ? features : defaultTrustItems

  return (
    <section id="home" className="w-full pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Centered Hero Copy & CTAs */}
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Status Pill with subtle green pulse indicator */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#D2D2D7] bg-white px-4 py-1.5 text-xs font-medium tracking-tight text-[#1D1D1F] shadow-2xs sm:text-[13px]">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>[ ● {subtitle} ]</span>
        </div>

        {/* Primary Statement of Craft */}
        <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F] sm:text-5xl sm:leading-[1.1] lg:text-[54px]">
          {title}
        </h1>

        {/* Factual Subheading */}
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#86868B] sm:text-lg sm:leading-relaxed">
          {description}
        </p>

        {/* Dual Action CTAs */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row">
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0071E3] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0077ED] active:scale-[0.99] sm:w-auto sm:text-[15px]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>{ctaText}</span>
          </a>

          <a
            href={secondaryCtaLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D2D2D7] bg-white px-7 py-3.5 text-sm font-semibold text-[#1D1D1F] shadow-2xs transition-colors hover:border-[#86868B] hover:bg-[#F5F5F7] sm:w-auto sm:text-[15px]"
          >
            <span>{secondaryCtaText}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </a>
        </div>
      </div>

      {/* Visual Hero Anchor (16:9 Landscape Video Showcase Placeholder) */}
      <div className="mt-10 sm:mt-12">
        <div className="overflow-hidden rounded-3xl border border-[#D2D2D7] bg-white p-2 shadow-sm sm:p-3">
          <MediaPlaceholder
            mode="video"
            aspectRatio="16/9"
            src={imageUrl}
            label={showcaseLabel}
            tag="Dokumentasi Lapangan • 1080p HD"
            priority
            className="rounded-2xl border-0"
          />
        </div>
      </div>

      {/* Proof-Based Trust Bar Strip (4 Horizontal Columns) */}
      <div className="mt-6 rounded-3xl border border-[#E5E5EA] bg-white p-6 shadow-xs sm:p-8">
        <div className="grid grid-cols-1 gap-6 divide-y divide-[#E5E5EA] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-[#E5E5EA]">
          {trustItems.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-1.5 ${
                idx > 0 ? 'pt-5 sm:pt-0 lg:pl-6' : ''
              }`}
            >
              <span className="text-[11px] font-semibold tracking-wider text-[#0071E3] uppercase">
                0{idx + 1} • {item.title}
              </span>
              <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F] sm:text-[17px]">
                {item.value}
              </h2>
              {item.detail && (
                <p className="text-xs leading-relaxed text-[#86868B] sm:text-[13px]">
                  {item.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
