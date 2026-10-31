import type { CollectionConfig } from 'payload'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  labels: {
    singular: 'Portofolio Proyek',
    plural: 'Portofolio Proyek',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'category', 'techSpecTag', 'updatedAt'],
    description:
      'Dokumentasi foto hasil instalasi rapi dan video lapangan untuk ditampilkan pada halaman utama CCTV APHIN.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul Dokumentasi Proyek',
      required: true,
      admin: {
        placeholder:
          'Contoh: Kemenangan Galaxy, Bekasi — Instalasi & Perawatan Sistem Kamera Komersial',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          label: 'Lokasi / Konteks Klien',
          required: true,
          admin: {
            width: '50%',
            placeholder: 'Contoh: Kemenangan Galaxy • Bekasi',
          },
        },
        {
          name: 'techSpecTag',
          type: 'text',
          label: 'Tag Spesifikasi Teknis',
          required: true,
          admin: {
            width: '50%',
            placeholder: 'Contoh: 8 Channel IP Cam / Full Conduit',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          label: 'Kategori Portofolio',
          required: true,
          defaultValue: 'Toko & Komersial',
          options: [
            { label: 'Toko & Komersial', value: 'Toko & Komersial' },
            { label: 'Rumah Tinggal', value: 'Rumah Tinggal' },
            { label: 'Kerapian Instalasi', value: 'Kerapian Instalasi' },
            { label: 'Dokumentasi Video', value: 'Dokumentasi Video' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto / Video Lapangan',
          admin: {
            width: '50%',
            description: 'Unggah foto hasil pemasangan atau video dokumentasi lapangan.',
          },
        },
      ],
    },
  ],
}
