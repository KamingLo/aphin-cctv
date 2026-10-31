import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

export function generateDefaultInvoiceNumber(date = new Date(), sequence?: number): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const seqStr =
    typeof sequence === 'number'
      ? String(sequence).padStart(3, '0')
      : String(Math.floor(100 + Math.random() * 900))
  return `INV/APH/${year}/${month}/${seqStr}`
}

const calculateAndSnapshotHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data) return data

  // 1. Ensure invoiceNumber is populated if empty
  if (!data.invoiceNumber && !originalDoc?.invoiceNumber) {
    try {
      const now = data.issueDate ? new Date(data.issueDate) : new Date()
      const countRes = await req.payload.count({ collection: 'invoices' })
      data.invoiceNumber = generateDefaultInvoiceNumber(now, (countRes.totalDocs || 0) + 1)
    } catch {
      data.invoiceNumber = generateDefaultInvoiceNumber()
    }
  }

  // 2. Automatically calculate rowTotal for each line item, subtotal, and grandTotal
  const rawItems = Array.isArray(data.items)
    ? data.items
    : Array.isArray(originalDoc?.items)
      ? originalDoc.items
      : []

  let subtotal = 0
  const calculatedItems = rawItems.map((item: Record<string, unknown>) => {
    const qty = Number(item?.qty ?? 1) || 0
    const unitPrice = Number(item?.unitPrice ?? 0) || 0
    const rowTotal = Math.round(qty * unitPrice)
    subtotal += rowTotal

    return {
      ...item,
      qty,
      unitPrice,
      rowTotal,
    }
  })

  const discount = Number(data.discount ?? originalDoc?.discount ?? 0) || 0
  const downPayment = Number(data.downPayment ?? originalDoc?.downPayment ?? 0) || 0
  const grandTotal = subtotal - discount - downPayment

  data.items = calculatedItems
  data.subtotal = subtotal
  data.discount = discount
  data.downPayment = downPayment
  data.grandTotal = grandTotal

  // 3. Populate historical companySnapshot from CompanySettings Global on create or if empty
  const existingSnapshot = data.companySnapshot || originalDoc?.companySnapshot || {}
  const isSnapshotEmpty =
    !existingSnapshot.companyName ||
    !existingSnapshot.accountNumber ||
    !existingSnapshot.bankName

  if (operation === 'create' || isSnapshotEmpty) {
    try {
      const companySettings = await req.payload.findGlobal({
        slug: 'company-settings',
        depth: 1,
        req,
      })

      const extractMediaUrl = (mediaField: unknown): string => {
        if (mediaField && typeof mediaField === 'object' && 'url' in mediaField) {
          return String((mediaField as { url?: string | null }).url || '')
        }
        return ''
      }

      const defaultNotes =
        companySettings?.defaultWarrantyNotes ||
        'Garansi pengerjaan instalasi 1 bulan. Seluruh perangkat telah diuji dan berfungsi normal saat serah terima.'

      data.companySnapshot = {
        companyName: companySettings?.companyName || 'CCTV APHIN',
        tagline:
          companySettings?.tagline || 'Spesialis Instalasi, Perawatan, & Perbaikan CCTV',
        whatsapp: companySettings?.whatsapp || '6281234567890',
        address:
          companySettings?.address ||
          'Bekasi & Jakarta — Layanan Kunjungan Langsung ke Lokasi',
        logoUrl: extractMediaUrl(companySettings?.logo) || existingSnapshot.logoUrl || '',
        bankName: companySettings?.bankDetails?.bankName || 'BCA',
        accountNumber: companySettings?.bankDetails?.accountNumber || '8420123456',
        accountHolder: companySettings?.bankDetails?.accountHolder || 'Tju Chi Phin',
        signerName: companySettings?.signerName || 'Aphin (Tju Chi Phin)',
        signatureUrl:
          extractMediaUrl(companySettings?.signatureImage) ||
          existingSnapshot.signatureUrl ||
          '',
        notes: data.customNotes?.trim() ? data.customNotes.trim() : defaultNotes,
      }
    } catch {
      data.companySnapshot = {
        companyName: existingSnapshot.companyName || 'CCTV APHIN',
        tagline:
          existingSnapshot.tagline || 'Spesialis Instalasi, Perawatan, & Perbaikan CCTV',
        whatsapp: existingSnapshot.whatsapp || '6281234567890',
        address:
          existingSnapshot.address ||
          'Bekasi & Jakarta — Layanan Kunjungan Langsung ke Lokasi',
        logoUrl: existingSnapshot.logoUrl || '',
        bankName: existingSnapshot.bankName || 'BCA',
        accountNumber: existingSnapshot.accountNumber || '8420123456',
        accountHolder: existingSnapshot.accountHolder || 'Tju Chi Phin',
        signerName: existingSnapshot.signerName || 'Aphin (Tju Chi Phin)',
        signatureUrl: existingSnapshot.signatureUrl || '',
        notes:
          data.customNotes?.trim() ||
          existingSnapshot.notes ||
          'Garansi pengerjaan instalasi 1 bulan. Seluruh perangkat telah diuji dan berfungsi normal saat serah terima.',
      }
    }
  } else if (typeof data.customNotes === 'string' && data.customNotes.trim().length > 0) {
    // Allow customNotes override to sync into snapshot notes while keeping historical bank details intact
    data.companySnapshot = {
      ...existingSnapshot,
      notes: data.customNotes.trim(),
    }
  }

  return data
}

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  labels: {
    singular: 'Invoice',
    plural: 'Invoices',
  },
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'clientName', 'issueDate', 'grandTotal', 'status'],
    description:
      'Manajemen pembuatan nota/invoice proyek instalasi, perawatan, dan perbaikan CCTV APHIN.',
  },
  hooks: {
    beforeChange: [calculateAndSnapshotHook],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'invoiceNumber',
          type: 'text',
          label: 'Nomor Invoice',
          unique: true,
          required: true,
          defaultValue: () => generateDefaultInvoiceNumber(),
          admin: {
            width: '40%',
            description: 'Format otomatis: INV/APH/YYYY/MM/XXX',
          },
        },
        {
          name: 'issueDate',
          type: 'date',
          label: 'Tanggal Invoice',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            width: '30%',
          },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status Pembayaran',
          required: true,
          defaultValue: 'unpaid',
          options: [
            { label: 'Belum Lunas', value: 'unpaid' },
            { label: 'Lunas', value: 'paid' },
            { label: 'Draft', value: 'draft' },
          ],
          admin: {
            width: '30%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'clientName',
          type: 'text',
          label: 'Nama Klien / Instansi',
          required: true,
          admin: {
            width: '50%',
            placeholder: 'Contoh: Kemenangan Galaxy Bekasi',
          },
        },
        {
          name: 'clientLocation',
          type: 'textarea',
          label: 'Lokasi / Alamat Pemasangan',
          required: true,
          admin: {
            width: '50%',
            placeholder: 'Contoh: Ruko Grand Galaxy City, Bekasi Selatan',
          },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Rincian Pekerjaan & Perangkat (Line Items)',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Item Pekerjaan / Perangkat',
        plural: 'Daftar Item Pekerjaan / Perangkat',
      },
      fields: [
        {
          name: 'description',
          type: 'text',
          label: 'Deskripsi Pekerjaan / Perangkat',
          required: true,
          admin: {
            placeholder:
              'Contoh: Pemasangan Kamera Hikvision 2MP / Penarikan Kabel Coaxial + Conduit',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'qty',
              type: 'number',
              label: 'Qty',
              defaultValue: 1,
              required: true,
              min: 0,
              admin: {
                width: '20%',
              },
            },
            {
              name: 'unit',
              type: 'select',
              label: 'Satuan',
              defaultValue: 'Unit',
              options: [
                { label: 'Unit', value: 'Unit' },
                { label: 'Titik', value: 'Titik' },
                { label: 'Meter', value: 'Meter' },
                { label: 'Paket', value: 'Paket' },
                { label: 'Roll', value: 'Roll' },
                { label: 'Lot', value: 'Lot' },
              ],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'unitPrice',
              type: 'number',
              label: 'Harga Satuan (Rp)',
              required: true,
              min: 0,
              admin: {
                width: '30%',
                placeholder: 'Contoh: 450000',
              },
            },
            {
              name: 'rowTotal',
              type: 'number',
              label: 'Subtotal Baris (Rp)',
              admin: {
                readOnly: true,
                width: '25%',
                description: 'Dihitung otomatis (Qty × Harga)',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          label: 'Subtotal (Rp)',
          defaultValue: 0,
          admin: {
            readOnly: true,
            width: '25%',
          },
        },
        {
          name: 'discount',
          type: 'number',
          label: 'Potongan / Diskon (Rp)',
          defaultValue: 0,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'downPayment',
          type: 'number',
          label: 'Uang Muka / DP (Rp)',
          defaultValue: 0,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'grandTotal',
          type: 'number',
          label: 'Total Tagihan Akhir / Grand Total (Rp)',
          defaultValue: 0,
          admin: {
            readOnly: true,
            width: '25%',
            description: 'Subtotal - Diskon - DP',
          },
        },
      ],
    },
    {
      name: 'customNotes',
      type: 'textarea',
      label: 'Catatan Garansi / Keterangan Tambahan (Opsional)',
      admin: {
        description:
          'Kosongkan untuk menggunakan catatan garansi default dari Pengaturan Perusahaan.',
      },
    },
    {
      name: 'invoicePreview',
      type: 'ui',
      label: 'Pratinjau Cetak Invoice A4',
      admin: {
        components: {
          Field: '/components/admin/InvoicePrintPreview.tsx#InvoicePrintPreview',
        },
      },
    },
    {
      name: 'companySnapshot',
      type: 'group',
      label: 'Arsip Snapshot Profil & Rekening (Tersimpan Otomatis)',
      admin: {
        readOnly: true,
        description:
          'Data profil dan rekening saat invoice diterbitkan agar riwayat invoice lama tetap akurat.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              label: 'Nama Usaha',
              admin: { readOnly: true, width: '50%' },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              admin: { readOnly: true, width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'whatsapp',
              type: 'text',
              label: 'WhatsApp',
              admin: { readOnly: true, width: '40%' },
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Alamat',
              admin: { readOnly: true, width: '60%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'bankName',
              type: 'text',
              label: 'Bank',
              admin: { readOnly: true, width: '25%' },
            },
            {
              name: 'accountNumber',
              type: 'text',
              label: 'No. Rekening',
              admin: { readOnly: true, width: '35%' },
            },
            {
              name: 'accountHolder',
              type: 'text',
              label: 'Atas Nama',
              admin: { readOnly: true, width: '40%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'signerName',
              type: 'text',
              label: 'Penandatangan',
              admin: { readOnly: true, width: '35%' },
            },
            {
              name: 'signatureUrl',
              type: 'text',
              label: 'URL Foto Tanda Tangan',
              admin: { readOnly: true, width: '35%' },
            },
            {
              name: 'logoUrl',
              type: 'text',
              label: 'URL Logo Usaha',
              admin: { readOnly: true, width: '30%' },
            },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Catatan Garansi Tercetak',
          admin: { readOnly: true },
        },
      ],
    },
  ],
}
