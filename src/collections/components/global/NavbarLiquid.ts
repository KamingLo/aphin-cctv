import type { CollectionConfig } from 'payload'

export const NavbarLiquid: CollectionConfig = {
  slug: 'navbar-liquid',
  admin: {
    useAsTitle: 'brandName',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      required: true,
      defaultValue: 'CCTV APHIN',
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Konsultasi WhatsApp',
    },
    {
      name: 'ctaLink',
      type: 'text',
      defaultValue:
        'https://wa.me/6281234567890?text=Halo%20Pak%20Aphin%2C%20saya%20ingin%20konsultasi%20pemasangan%2Fperbaikan%20CCTV...',
    },
  ],
}
