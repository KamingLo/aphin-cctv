import type { GlobalConfig } from 'payload'

export const CompanySettings: GlobalConfig = {
  slug: 'company-settings',
  label: 'Profil & Rekening Perusahaan',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Nama Usaha / Bisnis',
      defaultValue: 'CCTV APHIN',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline Layanan',
      defaultValue: 'Spesialis Instalasi, Perawatan, & Perbaikan CCTV',
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'Nomor WhatsApp Aktif (Contoh: 6281234567890)',
      defaultValue: '6281234567890',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Alamat / Area Operasional',
      defaultValue: 'Bekasi & Jakarta — Layanan Kunjungan Langsung ke Lokasi',
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo Usaha (Opsional)',
      relationTo: 'media',
    },
    {
      name: 'bankDetails',
      type: 'group',
      label: 'Informasi Rekening Pembayaran',
      fields: [
        {
          name: 'bankName',
          type: 'text',
          label: 'Nama Bank',
          defaultValue: 'BCA',
          required: true,
        },
        {
          name: 'accountNumber',
          type: 'text',
          label: 'Nomor Rekening',
          defaultValue: '8420123456',
          required: true,
        },
        {
          name: 'accountHolder',
          type: 'text',
          label: 'Atas Nama Rekening',
          defaultValue: 'Tju Chi Phin',
          required: true,
        },
      ],
    },
    {
      name: 'signerName',
      type: 'text',
      label: 'Nama Penandatangan Invoice',
      defaultValue: 'Aphin (Tju Chi Phin)',
    },
    {
      name: 'signatureImage',
      type: 'upload',
      label: 'Foto / Gambar Tanda Tangan Invoice (PNG Transparan disarankan)',
      relationTo: 'media',
    },
    {
      name: 'defaultWarrantyNotes',
      type: 'textarea',
      label: 'Catatan Garansi Default (Tercantum di Invoice)',
      defaultValue:
        'Garansi pengerjaan instalasi 1 bulan. Seluruh perangkat telah diuji dan berfungsi normal saat serah terima.',
    },
  ],
}
