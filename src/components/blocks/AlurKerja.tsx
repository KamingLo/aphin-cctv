import React from 'react'

export interface WorkflowStep {
  number: string
  title: string
  description: string
}

export interface AlurKerjaProps {
  sectionTag?: string | null
  title?: string | null
  subtitle?: string | null
  steps?: WorkflowStep[] | null
  serviceAreaTitle?: string | null
  serviceAreaDescription?: string | null
  areas?: { area: string }[] | null
  serviceHours?: string | null
  ctaTitle?: string | null
  ctaDescription?: string | null
  ctaButtonText?: string | null
  whatsappUrl?: string | null
}

const defaultSteps: WorkflowStep[] = [
  {
    number: '01',
    title: '01. Konsultasi Kebutuhan (Via WhatsApp / Cek Lokasi)',
    description:
      'Sampaikan keluhan sistem lama atau jumlah titik kamera yang dibutuhkan. Bila diperlukan untuk area luas/kompleks, dilakukan pengecekan jalur langsung di lokasi.',
  },
  {
    number: '02',
    title: '02. Estimasi & Spesifikasi Transparan',
    description:
      'Rincian tipe kamera, kapasitas Harddisk, kebutuhan pipa conduit, serta biaya jasa diinformasikan secara terbuka di awal sebelum pekerjaan dimulai.',
  },
  {
    number: '03',
    title: '03. Pengerjaan Lapangan dengan Standar Rapi',
    description:
      'Proses penarikan kabel, pemasangan bracket kamera, dan penataan konektor DVR/NVR dikerjakan dengan disiplin kerapian tanpa merusak interior bangunan.',
  },
  {
    number: '04',
    title: '04. Uji Coba, Training HP, & Garansi',
    description:
      'Pengecekan sudut pandang tiap kamera bersama pemilik, instalasi aplikasi pantau di HP (termasuk cara lihat rekaman ulang), disertai jaminan garansi pengerjaan.',
  },
]

const defaultAreas = [
  { area: 'Kota & Kabupaten Bekasi (Galaxy, Pekayon, Harapan Indah, Jatiasih, Tambun, Cibitung)' },
  { area: 'Jakarta Timur (Duren Sawit, Pondok Kelapa, Cakung, Rawamangun, Jatinegara, Cibubur)' },
  { area: 'Jakarta Utara (Kelapa Gading, Sunter, Pantai Indah Kapuk, Pluit, Tanjung Priok)' },
  { area: 'Area Sekitarnya (Jabodetabek sesuai kesepakatan jadwal kunjungan)' },
]

const defaultWhatsappUrl =
  'https://wa.me/6281234567890?text=Halo%20Pak%20Aphin%2C%20saya%20ingin%20konsultasi%20pemasangan%2Fperbaikan%20CCTV...'

export default function AlurKerja({
  sectionTag = 'Alur Kerja & Area Layanan',
  title = 'Prosedur Terstruktur dari Konsultasi hingga Garansi',
  subtitle = 'Komunikasi langsung dengan teknisi pelaksana memastikan kebutuhan keamanan lokasi Anda diterjemahkan secara tepat tanpa salah paham.',
  steps,
  serviceAreaTitle = 'Jangkauan Area Layanan Operasional',
  serviceAreaDescription = 'Melayani kunjungan survei titik, instalasi baru, perawatan rutin, serta panggilan perbaikan langsung ke lokasi Anda pada cakupan wilayah:',
  areas,
  serviceHours = 'Senin – Sabtu (08.00 – 18.00 WIB) • Jadwal Kunjungan Fleksibel Sesuai Kesepakatan',
  ctaTitle = 'Siap Memasang atau Memperbaiki Sistem CCTV Anda?',
  ctaDescription = 'Hubungi Pak Aphin langsung melalui WhatsApp untuk mendiskusikan kebutuhan titik kamera, pengecekan masalah DVR/kamera mati, atau meminta estimasi biaya yang transparan.',
  ctaButtonText = 'Konsultasi Langsung via WhatsApp',
  whatsappUrl = defaultWhatsappUrl,
}: AlurKerjaProps) {
  const stepList = steps && steps.length > 0 ? steps : defaultSteps
  const areaList = areas && areas.length > 0 ? areas : defaultAreas

  return (
    <section id="alur-kerja" className="w-full py-12 sm:py-16">
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

      {/* 4-Step Linear Workflow Grid */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stepList.map((step, idx) => (
          <article
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-[#E5E5EA] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#D2D2D7] hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0071E3]/10 font-mono text-xs font-bold text-[#0071E3]">
                  {step.number || `0${idx + 1}`}
                </span>
                {idx < stepList.length - 1 && (
                  <span
                    className="hidden text-xs font-medium text-[#D2D2D7] lg:inline"
                    aria-hidden="true"
                  >
                    ───►
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-base font-bold tracking-tight text-[#1D1D1F]">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#86868B] sm:text-[13px]">
                {step.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Service Area & WhatsApp Action Split / Stack */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Service Area Card */}
        <article className="flex flex-col justify-between rounded-3xl border border-[#E5E5EA] bg-white p-6 shadow-xs sm:p-8 lg:col-span-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F7] px-3.5 py-1 text-xs font-semibold text-[#1D1D1F]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0071E3"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Cakupan Wilayah Teknis</span>
            </div>

            <h3 className="mt-4 text-xl font-bold tracking-tight text-[#1D1D1F] sm:text-2xl">
              {serviceAreaTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#86868B]">
              {serviceAreaDescription}
            </p>

            <ul className="mt-5 space-y-2.5">
              {areaList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-[#1D1D1F] sm:text-[13px]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0071E3]"
                    aria-hidden="true"
                  />
                  <span>{item.area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-[#E5E5EA] bg-[#F5F5F7] px-4 py-3 text-xs font-medium text-[#1D1D1F]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0071E3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{serviceHours}</span>
          </div>
        </article>

        {/* WhatsApp Consultation Action Card */}
        <article className="flex flex-col justify-between rounded-3xl border border-[#D2D2D7] bg-white p-6 shadow-sm sm:p-8 lg:col-span-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Respon Cepat & Langsung Teknisi
            </span>

            <h3 className="mt-4 text-xl font-bold tracking-tight text-[#1D1D1F] sm:text-2xl">
              {ctaTitle}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[#86868B] sm:text-[15px]">
              {ctaDescription}
            </p>

            {/* Pre-filled Message Preview Box */}
            <div className="mt-5 rounded-2xl border border-[#E5E5EA] bg-[#F5F5F7] p-4">
              <span className="block font-mono text-[11px] font-medium text-[#86868B]">
                Format Pesan Otomatis WhatsApp:
              </span>
              <p className="mt-1 text-xs italic text-[#1D1D1F]/85 sm:text-[13px]">
                &ldquo;Halo Pak Aphin, saya ingin konsultasi pemasangan/perbaikan CCTV...&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={whatsappUrl || defaultWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#0071E3] px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0077ED] active:scale-[0.99] sm:text-[15px]"
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
              <span>{ctaButtonText}</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}
