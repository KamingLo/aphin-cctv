import type { Block } from 'payload'

export const PortofolioLapanganBlock: Block = {
  slug: 'portofolioLapangan',
  labels: {
    singular: 'Portofolio & Galeri Lapangan',
    plural: 'Portofolio & Galeri Lapangan',
  },
  fields: [
    {
      name: 'sectionTag',
      type: 'text',
      defaultValue: 'Bukti Hasil Kerja Nyata',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Dokumentasi Proyek & Instalasi di Lapangan',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Rekam jejak pemasangan baru, penataan ulang jalur kabel, serta pemeliharaan sistem kamera pada berbagai lokasi komersial dan hunian.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Item Portofolio',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul / Caption Dokumentasi',
        },
        {
          name: 'locationContext',
          type: 'text',
          required: true,
          label: 'Konteks Klien / Lokasi',
        },
        {
          name: 'scopeTag',
          type: 'text',
          required: true,
          label: 'Tag Spesifikasi (Contoh: 8 Channel IP Cam)',
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'toko',
          options: [
            { label: 'Toko & Usaha', value: 'toko' },
            { label: 'Rumah Tinggal', value: 'rumah' },
            { label: 'Dokumentasi Video', value: 'video' },
          ],
        },
        {
          name: 'mediaMode',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Foto (Image)', value: 'image' },
            { label: 'Video Lapangan (Video)', value: 'video' },
          ],
        },
        {
          name: 'aspectRatio',
          type: 'select',
          required: true,
          defaultValue: '4/3',
          options: [
            { label: 'Landscape (4:3)', value: '4/3' },
            { label: 'Wide Video (16:9)', value: '16/9' },
            { label: 'Portrait / Reels (9:16)', value: '9/16' },
          ],
        },
        {
          name: 'overlayTag',
          type: 'text',
          label: 'Badge Overlay (Opsional, misal: Video Lapangan)',
        },
        {
          name: 'media',
          type: 'relationship',
          relationTo: 'media',
          label: 'File Foto / Video',
        },
      ],
    },
  ],
}
