import React from 'react'

export interface ServiceCardItem {
  title: string
  subtitle?: string | null
  description: string
  badge?: string | null
  scopePoints?: { point: string }[] | null
}

export interface LayananUtamaProps {
  sectionTag?: string | null
  title?: string | null
  subtitle?: string | null
  services?: ServiceCardItem[] | null
}

const defaultServices: ServiceCardItem[] = [
  {
    title: 'Pemasangan Baru',
    subtitle: 'New Installation',
    description:
      'Perancangan dan instalasi sistem kamera pengawas dari nol dengan penentuan sudut pandang optimal serta perlindungan jalur kabel penuh.',
    badge: 'Pengerjaan Langsung di Lokasi',
    scopePoints: [
      { point: 'Penarikan jalur kabel rapi menggunakan pelindung pipa conduit PVC' },
      { point: 'Penempatan titik kamera presisi untuk mengeliminasi area blind spot' },
      { point: 'Instalasi & manajemen rak DVR/NVR, power supply central, dan konektor' },
      { point: 'Inisialisasi harddisk khusus CCTV & pengaturan rekam otomatis 24 jam' },
    ],
  },
  {
    title: 'Perawatan Berkala',
    subtitle: 'Preventive Maintenance',
    description:
      'Pemeriksaan rutin terjadwal untuk memastikan seluruh kamera merekam dengan jernih dan sistem penyimpanan bekerja tanpa gagal.',
    badge: 'Pengerjaan Langsung di Lokasi',
    scopePoints: [
      { point: 'Pembersihan kubah lensa kamera & sensor infrared dari debu/jaring laba-laba' },
      { point: 'Pengecekan kesehatan baca/tulis (S.M.A.R.T) Harddisk DVR/NVR' },
      { point: 'Pengukuran kestabilan tegangan adaptor / PSU untuk mencegah kamera mati-hidup' },
      { point: 'Peremajaan konektor BNC, jack DC, atau RJ45 yang mulai korosi/longgar' },
    ],
  },
  {
    title: 'Perbaikan & Troubleshooting',
    subtitle: 'System Repair & Recovery',
    description:
      'Penanganan cepat untuk sistem CCTV lama yang bermasalah, gambar hilang, DVR berbunyi alarm, atau perapian kabel semrawut.',
    badge: 'Pengerjaan Langsung di Lokasi',
    scopePoints: [
      { point: 'Perbaikan tampilan kamera mati (No Video), gambar bergaris, atau buram' },
      { point: 'Penanganan DVR/NVR bunyi beep berulang, gagal rekam, atau lupa password' },
      { point: 'Pelacakan & penyambungan ulang jalur kabel putus atau digigit hama' },
      { point: 'Konfigurasi ulang akses pantau HP yang berstatus Offline / gagal konek' },
    ],
  },
]

function ServiceIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    )
  }
  if (index === 1) {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export default function LayananUtama({
  sectionTag = 'Layanan Utama',
  title = 'Tiga Fokus Layanan Teknis CCTV APHIN',
  subtitle = 'Baik pemasangan unit baru dari awal maupun perbaikan sistem CCTV lama yang bermasalah, seluruh pengerjaan dilakukan secara teliti dan terukur.',
  services,
}: LayananUtamaProps) {
  const items = services && services.length > 0 ? services : defaultServices

  return (
    <section id="layanan" className="w-full py-12 sm:py-16">
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

      {/* 3-Column Card Layout */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {items.map((service, idx) => (
          <article
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-[#E5E5EA] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#D2D2D7] hover:shadow-md sm:p-8"
          >
            <div>
              {/* Top Icon & Subtitle */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E5EA] bg-[#F5F5F7] text-[#0071E3]">
                  <ServiceIcon index={idx} />
                </div>
                {service.subtitle && (
                  <span className="font-mono text-xs font-medium text-[#86868B]">
                    {service.subtitle}
                  </span>
                )}
              </div>

              {/* Card Title & Description */}
              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#1D1D1F]">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#86868B]">
                {service.description}
              </p>

              {/* Hairline Divider */}
              <div className="my-5 h-px w-full bg-[#E5E5EA]" />

              {/* Bulleted Scope of Work */}
              <p className="mb-3 text-xs font-semibold tracking-wider text-[#1D1D1F] uppercase">
                Lingkup Pengerjaan:
              </p>
              <ul className="space-y-2.5">
                {service.scopePoints?.map((sp, spIdx) => (
                  <li
                    key={spIdx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-[#1D1D1F]/90 sm:text-[13px]"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0071E3"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{sp.point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Operational Footer Badge */}
            <footer className="mt-7 pt-4 border-t border-[#F5F5F7]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F7] px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0071E3]" aria-hidden="true" />
                {service.badge || 'Pengerjaan Langsung di Lokasi'}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
