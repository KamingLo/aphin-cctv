import type { Block } from 'payload'

export const EkosistemPerangkatBlock: Block = {
  slug: 'ekosistemPerangkat',
  labels: {
    singular: 'Ekosistem Perangkat & Arsitektur',
    plural: 'Ekosistem Perangkat & Arsitektur',
  },
  fields: [
    {
      name: 'sectionTag',
      type: 'text',
      defaultValue: 'Kompatibilitas Perangkat Keras',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Ekosistem Merek Teruji & Pemilihan Arsitektur Tepat',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Berpengalaman menangani konfigurasi lintas merek terkemuka serta merancang topologi sistem yang paling efisien sesuai luas bangunan dan anggaran Anda.',
    },
    {
      name: 'brands',
      type: 'array',
      label: 'Merek Perangkat yang Ditangani',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
        },
      ],
    },
    {
      name: 'architectures',
      type: 'array',
      label: 'Perbandingan Arsitektur Sistem (3 Kartu)',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'badge',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'idealFor',
          type: 'text',
          required: true,
          label: 'Rekomendasi Penggunaan',
        },
        {
          name: 'specs',
          type: 'array',
          label: 'Spesifikasi Teknis Utama',
          fields: [
            {
              name: 'spec',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
