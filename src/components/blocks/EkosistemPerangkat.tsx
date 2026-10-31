import React from 'react'

export interface BrandItem {
  name: string
  category?: string | null
}

export interface ArchitectureCard {
  title: string
  badge: string
  description: string
  idealFor: string
  specs?: { spec: string }[] | null
}

export interface EkosistemPerangkatProps {
  sectionTag?: string | null
  title?: string | null
  subtitle?: string | null
  brands?: BrandItem[] | null
  architectures?: ArchitectureCard[] | null
}

const defaultBrands: BrandItem[] = [
  { name: 'HIKVISION', category: 'Pro Series & ColorVu' },
  { name: 'DAHUA', category: 'WizSense & Cooper HD' },
  { name: 'HiLook', category: 'By Hikvision' },
  { name: 'EZVIZ', category: 'Smart Cloud Camera' },
  { name: 'Imou', category: 'Consumer & Retail Wi-Fi' },
  { name: 'Uniview (UNV)', category: 'Enterprise IP System' },
]

const defaultArchitectures: ArchitectureCard[] = [
  {
    title: 'Analog High-Definition (HD Coaxial)',
    badge: 'Praktis & Efisien',
    description:
      'Sistem kamera berbasis kabel koaksial RG59/RG6 menuju mesin DVR. Sangat stabil, bebas jeda jaringan (zero latency), dan ekonomis untuk pengawasan menyeluruh.',
    idealFor: 'Rumah Tinggal, Ruko, & Toko Retail',
    specs: [
      { spec: 'Resolusi 2MP (1080p) hingga 5MP Super HD' },
      { spec: 'Dukungan Night Vision Infrared & Smart Full-Color' },
      { spec: 'Biaya perangkat dan pemeliharaan jangka panjang terjangkau' },
    ],
  },
  {
    title: 'IP Camera & Network PoE',
    badge: 'Detail Tinggi & Skala Luas',
    description:
      'Transmisi video digital murni melalui satu tarikan kabel jaringan LAN CAT6 (Power over Ethernet) menuju NVR. Kualitas detail tajam dan mudah dikembangkan.',
    idealFor: 'Kantor, Gudang, Klinik, & Area Komersial',
    specs: [
      { spec: 'Kabel tunggal CAT6 untuk data video + daya listrik (PoE)' },
      { spec: 'Ketajaman gambar tinggi dengan fitur analitik gerak cerdas' },
      { spec: 'Integrasi fleksibel dengan jaringan switch / router lokal' },
    ],
  },
  {
    title: 'Smart Wi-Fi Cameras',
    badge: 'Ringkas & Interaktif',
    description:
      'Kamera mandiri terhubung ke jaringan Wi-Fi ruangan dengan penyimpanan kartu MicroSD maupun NVR. Dilengkapi mikrofon dan speaker untuk komunikasi dua arah.',
    idealFor: 'Ruang Dalam, Kasir, Kamar Anak, & Kantor Kecil',
    specs: [
      { spec: 'Pemasangan cepat dengan fitur Two-Way Audio (Suara 2 Arah)' },
      { spec: 'Tersedia varian putar 360° (Pan & Tilt) via aplikasi HP' },
      { spec: 'Notifikasi deteksi pergerakan manusia langsung ke ponsel' },
    ],
  },
]

export default function EkosistemPerangkat({
  sectionTag = 'Ekosistem Perangkat & Kapabilitas Teknis',
  title = 'Kompatibilitas Multi-Merek & Pemilihan Topologi Tepat',
  subtitle = 'Tidak terikat pada satu merek tunggal. Pak Aphin membantu memilih arsitektur perangkat keras yang paling sesuai dengan struktur bangunan dan kebutuhan pengawasan Anda.',
  brands,
  architectures,
}: EkosistemPerangkatProps) {
  const brandList = brands && brands.length > 0 ? brands : defaultBrands
  const archList =
    architectures && architectures.length > 0 ? architectures : defaultArchitectures

  return (
    <section className="w-full py-12 sm:py-16">
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

      {/* Monochrome Trusted Hardware Ecosystem Strip */}
      <div className="mt-9 rounded-2xl border border-[#E5E5EA] bg-white p-5 shadow-2xs sm:p-6">
        <p className="mb-4 text-center text-xs font-semibold tracking-wider text-[#86868B] uppercase">
          Pengalaman Konfigurasi & Perbaikan Ekosistem Perangkat:
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brandList.map((brand, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-xl border border-[#E5E5EA] bg-[#F5F5F7]/70 px-3 py-3.5 text-center transition-colors hover:border-[#D2D2D7] hover:bg-white"
            >
              <span className="text-sm font-bold tracking-tight text-[#1D1D1F]">
                {brand.name}
              </span>
              {brand.category && (
                <span className="mt-0.5 text-[11px] font-medium text-[#86868B]">
                  {brand.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3 Architecture Comparison Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {archList.map((arch, idx) => (
          <article
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-[#E5E5EA] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#D2D2D7] hover:shadow-md sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-3 py-1 text-xs font-semibold text-[#0071E3]">
                  {arch.badge}
                </span>
                <span className="font-mono text-xs text-[#86868B]">0{idx + 1}</span>
              </div>

              <h3 className="mt-4 text-lg font-bold tracking-tight text-[#1D1D1F] sm:text-xl">
                {arch.title}
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-[#86868B]">
                {arch.description}
              </p>

              {/* Specs List */}
              {arch.specs && arch.specs.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-[#E5E5EA] pt-4">
                  {arch.specs.map((s, sIdx) => (
                    <li
                      key={sIdx}
                      className="flex items-start gap-2 text-xs leading-relaxed text-[#1D1D1F]/90 sm:text-[13px]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0071E3]"
                        aria-hidden="true"
                      />
                      <span>{s.spec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="mt-6 rounded-xl bg-[#F5F5F7] px-4 py-3">
              <span className="block text-[10px] font-semibold tracking-wider text-[#86868B] uppercase">
                Ideal Untuk:
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-[#1D1D1F] sm:text-[13px]">
                {arch.idealFor}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
