import type { Block } from 'payload'

export const StandarKerjaBentoBlock: Block = {
  slug: 'standarKerjaBento',
  labels: {
    singular: 'Standar Kerja (Bento Grid)',
    plural: 'Standar Kerja (Bento Grid)',
  },
  fields: [
    {
      name: 'sectionTag',
      type: 'text',
      defaultValue: 'Disiplin Teknis & Kerapian',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Standar Pengerjaan Lapangan Tanpa Kompromi',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Kualitas sistem CCTV ditentukan oleh kerapian instalasi fisik dan ketepatan konfigurasi. Berikut adalah standar kerja tetap pada setiap proyek CCTV APHIN.',
    },
    {
      name: 'tiles',
      type: 'array',
      label: 'Bento Tiles (4 Tile)',
      fields: [
        {
          name: 'span',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: 'Lebar (2 Kolom)', value: 'large' },
            { label: 'Standar (1 Kolom)', value: 'normal' },
          ],
        },
        {
          name: 'badge',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'mediaLabel',
          type: 'text',
          label: 'Label Placeholder Media (Opsional)',
        },
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          label: 'Foto Pendukung (Opsional)',
        },
      ],
    },
  ],
}
