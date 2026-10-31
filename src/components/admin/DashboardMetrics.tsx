import React from 'react'
import Link from 'next/link'
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

  return (
    <section
      aria-label="Ringkasan Metrik Pendapatan & Invoice CCTV APHIN"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: '#F5F5F7',
        border: '1px solid #E5E5EA',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '28px',
        color: '#1D1D1F',
      }}
    >
      <style>{`
        .aphin-kpi-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .aphin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 16px;
        }
        @media (min-width: 640px) {
          .aphin-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1100px) {
          .aphin-kpi-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .aphin-kpi-card {
          background-color: #FFFFFF;
          border: 1px solid #E5E5EA;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .aphin-kpi-card:hover {
          border-color: #D2D2D7;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .aphin-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 9999px;
          background-color: #0071E3;
          color: #FFFFFF !important;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none !important;
          transition: background-color 0.15s ease;
        }
        .aphin-btn-primary:hover {
          background-color: #0077ED;
        }
        .aphin-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 9px 14px;
          border-radius: 9999px;
          background-color: #F5F5F7;
          border: 1px solid #D2D2D7;
          color: #1D1D1F !important;
          font-size: 12.5px;
          font-weight: 500;
          text-decoration: none !important;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        .aphin-btn-secondary:hover {
          background-color: #EBEBED;
          border-color: #86868B;
        }
      `}</style>

      {/* Top Section Header */}
      <div className="aphin-kpi-header">
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D2D2D7',
              borderRadius: '9999px',
              padding: '3px 11px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#0071E3',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: '#0071E3',
              }}
            />
            PORTAL INTERNAL • CCTV APHIN
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1D1D1F',
            }}
          >
            Ringkasan Kas & Tagihan Proyek
          </h2>
        </div>

        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#86868B',
          }}
        >
          Periode Aktif: {currentMonthLabel}
        </span>
      </div>

      {/* 4-Card Apple HIG KPI Grid */}
      <div className="aphin-kpi-grid">
        {/* Card 1: Total Pendapatan Lunas */}
        <article className="aphin-kpi-card">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#86868B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Total Pendapatan Lunas
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#047857',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Lunas ({paidCount})
              </span>
            </div>

            <div
              style={{
                marginTop: '14px',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#1D1D1F',
              }}
            >
              {formatRupiah(paidRevenue)}
            </div>
          </div>

          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: '12px',
              color: '#86868B',
              lineHeight: 1.4,
            }}
          >
            Akumulasi seluruh invoice berstatus Lunas
          </p>
        </article>

        {/* Card 2: Menunggu Pembayaran / Pending */}
        <article className="aphin-kpi-card">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#86868B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Menunggu Pembayaran
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 9px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#B45309',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {unpaidCount} Belum Lunas
              </span>
            </div>

            <div
              style={{
                marginTop: '14px',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#1D1D1F',
              }}
            >
              {formatRupiah(unpaidTotal)}
            </div>
          </div>

          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: '12px',
              color: '#86868B',
              lineHeight: 1.4,
            }}
          >
            Tagihan aktif yang menunggu pelunasan klien
          </p>
        </article>

        {/* Card 3: Total Invoice Bulan Ini */}
        <article className="aphin-kpi-card">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#86868B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Total Invoice Bulan Ini
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: '#F5F5F7',
                  border: '1px solid #D2D2D7',
                  color: '#0071E3',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {currentMonthLabel}
              </span>
            </div>

            <div
              style={{
                marginTop: '14px',
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#1D1D1F',
              }}
            >
              {monthlyInvoiceCount}{' '}
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#86868B',
                }}
              >
                Nota
              </span>
            </div>
          </div>

          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: '12px',
              color: '#86868B',
              lineHeight: 1.4,
            }}
          >
            Total keseluruhannya: {invoices.length} dokumen tersimpan
          </p>
        </article>

        {/* Card 4: Quick Actions */}
        <article className="aphin-kpi-card">
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#86868B',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Aksi Cepat (Quick Actions)
            </span>
            <p
              style={{
                margin: '6px 0 12px 0',
                fontSize: '12px',
                color: '#86868B',
                lineHeight: 1.35,
              }}
            >
              Buat nota tagihan baru atau perbarui nomor rekening BCA & profil.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Link href="/admin/collections/invoices/create" className="aphin-btn-primary">
              <span>+ Buat Invoice Baru</span>
            </Link>
            <Link href="/admin/globals/company-settings" className="aphin-btn-secondary">
              <span>Pengaturan Rekening & Profil</span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

export default DashboardMetrics
