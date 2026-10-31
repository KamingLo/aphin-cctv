import type { Block } from 'payload'

export const LayananUtamaBlock: Block = {
  slug: 'layananUtama',
  labels: {
    singular: 'Layanan Utama (3 Kolom)',
    plural: 'Layanan Utama (3 Kolom)',
  },
  fields: [
    {
      name: 'sectionTag',
      type: 'text',
      defaultValue: 'Cakupan Layanan Teknis',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Solusi Menyeluruh Sistem Kamera Pengawas',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Setiap pekerjaan ditangani langsung di lokasi dengan peralatan ukur lengkap, manajemen jalur kabel rapi, dan pengecekan fungsi menyeluruh sebelum serah terima.',
    },
    {
      name: 'services',
      type: 'array',
      label: 'Daftar Layanan (3 Kartu)',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'badge',
          type: 'text',
          defaultValue: 'Pengerjaan Langsung di Lokasi',
        },
        {
          name: 'scopePoints',
          type: 'array',
          label: 'Poin Lingkup Pekerjaan',
          fields: [
            {
              name: 'point',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
