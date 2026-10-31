import type { Block } from 'payload'

export const AlurKerjaBlock: Block = {
  slug: 'alurKerja',
  labels: {
    singular: 'Alur Kerja, Area Layanan & CTA',
    plural: 'Alur Kerja, Area Layanan & CTA',
  },
  fields: [
    {
      name: 'sectionTag',
      type: 'text',
      defaultValue: 'Prosedur & Jangkauan Operasional',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Alur Pengerjaan Jelas dari Survei hingga Garansi',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Proses konsultasi praktis tanpa birokrasi berbelit. Anda berkomunikasi dan berkoordinasi langsung dengan teknisi pelaksana.',
    },
    {
      name: 'steps',
      type: 'array',
      label: '4 Tahap Alur Kerja',
      fields: [
        {
          name: 'number',
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
      ],
    },
    {
      name: 'serviceAreaTitle',
      type: 'text',
      defaultValue: 'Jangkauan Area Layanan Operasional',
    },
    {
      name: 'serviceAreaDescription',
      type: 'textarea',
      defaultValue:
        'Melayani kunjungan survei titik, instalasi baru, serta panggilan perbaikan langsung ke lokasi Anda pada cakupan wilayah berikut:',
    },
    {
      name: 'areas',
      type: 'array',
      label: 'Daftar Wilayah Cakupan',
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'serviceHours',
      type: 'text',
      defaultValue: 'Senin – Sabtu (08.00 – 18.00 WIB) • Penjadwalan Fleksibel Sesuai Kesepakatan',
    },
    {
      name: 'ctaTitle',
      type: 'text',
      defaultValue: 'Diskusikan Kebutuhan Pasang atau Perbaikan CCTV Anda',
    },
    {
      name: 'ctaDescription',
      type: 'textarea',
      defaultValue:
        'Sampaikan jumlah titik kamera, kondisi bangunan, atau kendala sistem CCTV yang sedang dialami. Pak Aphin siap memberikan rincian spesifikasi dan estimasi biaya yang jujur.',
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      defaultValue: 'Hubungi Pak Aphin via WhatsApp',
    },
    {
      name: 'whatsappUrl',
      type: 'text',
      defaultValue:
        'https://wa.me/6281234567890?text=Halo%20Pak%20Aphin%2C%20saya%20ingin%20konsultasi%20pemasangan%2Fperbaikan%20CCTV...',
    },
  ],
}
