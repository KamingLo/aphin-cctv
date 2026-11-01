import React from 'react'
import { Button, Pill } from '@payloadcms/ui'
import { getPayload, type BasePayload } from 'payload'
import config from '@payload-config'

interface InvoiceDoc {
  id?: string
  invoiceNumber?: string
  issueDate?: string
  createdAt?: string
  status?: 'unpaid' | 'paid' | 'draft' | string
  grandTotal?: number
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export async function DashboardMetrics(props?: { payload?: BasePayload }) {
  let invoices: InvoiceDoc[] = []

  try {
    const payload = props?.payload || (await getPayload({ config }))
    const result = await payload.find({
      collection: 'invoices',
      limit: 0,
      depth: 0,
    })
    invoices = (result?.docs as InvoiceDoc[]) || []
  } catch {
    invoices = []
  }

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let paidRevenue = 0
  let paidCount = 0
  let unpaidTotal = 0
  let unpaidCount = 0
  let monthlyInvoiceCount = 0

  for (const inv of invoices) {
    const total = Number(inv.grandTotal) || 0

    if (inv.status === 'paid') {
      paidRevenue += total
      paidCount += 1
    } else if (inv.status === 'unpaid') {
      unpaidTotal += total
      unpaidCount += 1
    }

    const rawDate = inv.issueDate || inv.createdAt
    if (rawDate) {
      const d = new Date(rawDate)
      if (!Number.isNaN(d.getTime())) {
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          monthlyInvoiceCount += 1
        }
      }
    }
  }

  const currentMonthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(now)

  // Styled with Payload theme tokens (see app/(payload)/custom.scss) to match native Payload UI
  return (
    <section
      className="aphin-metrics"
      aria-label="Ringkasan Metrik Pendapatan & Invoice CCTV APHIN"
    >
      <div className="aphin-metrics__header">
        <h2 className="aphin-metrics__label">Ringkasan Keuangan</h2>
        <span className="aphin-metrics__period">Periode Aktif: {currentMonthLabel}</span>
      </div>

      <ul className="aphin-metrics__grid">
        {/* Card 1: Total Pendapatan Lunas */}
        <li>
          <article className="aphin-metrics__card">
            <div>
              <div className="aphin-metrics__card-top">
                <h3 className="aphin-metrics__card-title">Total Pendapatan Lunas</h3>
                <Pill pillStyle="success" size="small">
                  Lunas ({paidCount})
                </Pill>
              </div>
              <div className="aphin-metrics__value" style={{ marginTop: '12px' }}>
                {formatRupiah(paidRevenue)}
              </div>
            </div>
            <p className="aphin-metrics__hint">Akumulasi seluruh invoice berstatus Lunas</p>
          </article>
        </li>

        {/* Card 2: Menunggu Pembayaran */}
        <li>
          <article className="aphin-metrics__card">
            <div>
              <div className="aphin-metrics__card-top">
                <h3 className="aphin-metrics__card-title">Menunggu Pembayaran</h3>
                <Pill pillStyle="warning" size="small">
                  {unpaidCount} Belum Lunas
                </Pill>
              </div>
              <div className="aphin-metrics__value" style={{ marginTop: '12px' }}>
                {formatRupiah(unpaidTotal)}
              </div>
            </div>
            <p className="aphin-metrics__hint">Tagihan aktif yang menunggu pelunasan klien</p>
          </article>
        </li>

        {/* Card 3: Total Invoice Bulan Ini */}
        <li>
          <article className="aphin-metrics__card">
            <div>
              <div className="aphin-metrics__card-top">
                <h3 className="aphin-metrics__card-title">Total Invoice Bulan Ini</h3>
                <Pill pillStyle="light-gray" size="small">
                  {currentMonthLabel}
                </Pill>
              </div>
              <div className="aphin-metrics__value" style={{ marginTop: '12px' }}>
                {monthlyInvoiceCount} <span className="aphin-metrics__unit">Nota</span>
              </div>
            </div>
            <p className="aphin-metrics__hint">
              Total keseluruhannya: {invoices.length} dokumen tersimpan
            </p>
          </article>
        </li>

        {/* Card 4: Quick Actions */}
        <li>
          <article className="aphin-metrics__card">
            <div>
              <h3 className="aphin-metrics__card-title">Aksi Cepat</h3>
              <p className="aphin-metrics__hint" style={{ marginTop: '4px' }}>
                Buat nota tagihan baru atau perbarui nomor rekening BCA &amp; profil.
              </p>
            </div>
            <div className="aphin-metrics__actions">
              <Button
                el="link"
                to="/admin/collections/invoices/create"
                buttonStyle="primary"
                size="small"
                icon="plus"
                iconPosition="left"
                margin={false}
              >
                Buat Invoice Baru
              </Button>
              <Button
                el="link"
                to="/admin/globals/company-settings"
                buttonStyle="secondary"
                size="small"
                margin={false}
              >
                Pengaturan Rekening &amp; Profil
              </Button>
            </div>
          </article>
        </li>
      </ul>
    </section>
  )
}

export default DashboardMetrics
