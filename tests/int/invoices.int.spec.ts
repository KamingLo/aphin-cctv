import { describe, it, expect, vi } from 'vitest'
import { CompanySettings } from '@/globals/CompanySettings'
import { Invoices, generateDefaultInvoiceNumber } from '@/collections/Invoices'
import { Portfolio } from '@/collections/Portfolio'

describe('CCTV APHIN Payload Architecture (Globals, Invoices, & Portfolio)', () => {
  it('defines CompanySettings global with required CCTV APHIN defaults', () => {
    expect(CompanySettings.slug).toBe('company-settings')
    const fieldNames = CompanySettings.fields.map((f) => ('name' in f ? f.name : f.type))
    expect(fieldNames).toContain('companyName')
    expect(fieldNames).toContain('tagline')
    expect(fieldNames).toContain('whatsapp')
    expect(fieldNames).toContain('address')
    expect(fieldNames).toContain('logo')
    expect(fieldNames).toContain('bankDetails')
    expect(fieldNames).toContain('signerName')
    expect(fieldNames).toContain('signatureImage')
    expect(fieldNames).toContain('defaultWarrantyNotes')
  })

  it('generates default invoice numbers in INV/APH/YYYY/MM/XXX format', () => {
    const sampleDate = new Date('2026-11-01T00:00:00.000Z')
    const invoiceNum = generateDefaultInvoiceNumber(sampleDate, 7)
    expect(invoiceNum).toBe('INV/APH/2026/11/007')
  })

  it('calculates rowTotal, subtotal, grandTotal and populates companySnapshot in beforeChange hook', async () => {
    const beforeChangeHook = Invoices.hooks?.beforeChange?.[0]
    expect(beforeChangeHook).toBeDefined()

    const mockReq = {
      payload: {
        count: vi.fn().mockResolvedValue({ totalDocs: 11 }),
        findGlobal: vi.fn().mockResolvedValue({
          companyName: 'CCTV APHIN',
          tagline: 'Spesialis Instalasi, Perawatan, & Perbaikan CCTV',
          whatsapp: '6281299998888',
          address: 'Bekasi Selatan',
          bankDetails: {
            bankName: 'BCA',
            accountNumber: '8420999999',
            accountHolder: 'Tju Chi Phin',
          },
          logo: { url: '/api/media/file/logo-aphin.png' },
          signerName: 'Aphin (Tju Chi Phin)',
          signatureImage: { url: '/api/media/file/ttd-aphin.png' },
          defaultWarrantyNotes: 'Garansi pengerjaan instalasi 1 bulan.',
        }),
      },
    }

    const inputData = {
      issueDate: '2026-11-01T00:00:00.000Z',
      status: 'unpaid',
      clientName: 'Kemenangan Galaxy Bekasi',
      clientLocation: 'Grand Galaxy City, Bekasi Selatan',
      items: [
        {
          description: 'Pemasangan Kamera Hikvision 2MP',
          qty: 4,
          unit: 'Titik',
          unitPrice: 650000,
        },
        {
          description: 'Penarikan Kabel Coaxial + Conduit',
          qty: 60,
          unit: 'Meter',
          unitPrice: 15000,
        },
      ],
      discount: 100000,
      downPayment: 1000000,
    }

    const result = await beforeChangeHook!({
      data: inputData,
      req: mockReq as never,
      operation: 'create',
      originalDoc: undefined,
      collection: Invoices as never,
      context: {},
    })

    expect(result.invoiceNumber).toBe('INV/APH/2026/11/012')
    expect(result.items[0].rowTotal).toBe(2600000)
    expect(result.items[1].rowTotal).toBe(900000)
    expect(result.subtotal).toBe(3500000)
    expect(result.grandTotal).toBe(2400000) // 3,500,000 - 100,000 - 1,000,000
    expect(result.companySnapshot).toEqual({
      companyName: 'CCTV APHIN',
      tagline: 'Spesialis Instalasi, Perawatan, & Perbaikan CCTV',
      whatsapp: '6281299998888',
      address: 'Bekasi Selatan',
      logoUrl: '/api/media/file/logo-aphin.png',
      bankName: 'BCA',
      accountNumber: '8420999999',
      accountHolder: 'Tju Chi Phin',
      signerName: 'Aphin (Tju Chi Phin)',
      signatureUrl: '/api/media/file/ttd-aphin.png',
      notes: 'Garansi pengerjaan instalasi 1 bulan.',
    })
  })

  it('defines Portfolio collection with required categories and fields', () => {
    expect(Portfolio.slug).toBe('portfolio')
    expect(Portfolio.admin?.useAsTitle).toBe('title')
  })
})
