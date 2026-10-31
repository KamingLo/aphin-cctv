import type { Block } from 'payload'

export const HeroUtamaBlock: Block = {
  slug: 'heroUtama',
  labels: {
    singular: 'Hero Utama & Trust Bar',
    plural: 'Hero Utama & Trust Bar',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      label: 'Status Pill',
      defaultValue: 'Teknisi Spesialis Sistem Keamanan & CCTV',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue:
        'Instalasi CCTV Presisi, Rapi, & Bergaransi Langsung oleh Teknisi Berpengalaman',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'Pengerjaan jalur kabel terlindungi pipa conduit, penataan unit DVR/NVR yang bersih, pengaturan pantau jarak jauh via HP yang stabil, serta pertanggungjawaban teknis langsung oleh Pak Aphin.',
    },
    {
      name: 'ctaText',
      type: 'text',
      required: true,
      label: 'Teks Tombol Utama (WhatsApp)',
      defaultValue: 'Konsultasi via WhatsApp',
    },
    {
      name: 'ctaLink',
      type: 'text',
      required: true,
      label: 'URL Tombol Utama',
      defaultValue:
        'https://wa.me/6281234567890?text=Halo%20Pak%20Aphin%2C%20saya%20ingin%20konsultasi%20pemasangan%2Fperbaikan%20CCTV...',
    },
    {
      name: 'secondaryCtaText',
      type: 'text',
      label: 'Teks Tombol Sekunder',
      defaultValue: 'Lihat Bukti Pekerjaan',
    },
    {
      name: 'secondaryCtaLink',
      type: 'text',
      label: 'URL Tombol Sekunder',
      defaultValue: '#portofolio',
    },
    {
      name: 'showcaseLabel',
      type: 'text',
      label: 'Label Placeholder Video Showcase',
      defaultValue: 'Video Showcase: Dokumentasi Instalasi Lapangan CCTV APHIN',
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      label: 'Media Video / Foto Showcase Utama (16:9)',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Trust Bar (4 Pilar Bukti Kerja)',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'detail',
          type: 'text',
        },
      ],
    },
  ],
}
