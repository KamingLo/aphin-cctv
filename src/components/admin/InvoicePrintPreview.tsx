'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAllFormFields } from '@payloadcms/ui'

interface LineItem {
  description: string
  qty: number
  unit: string
  unitPrice: number
  rowTotal: number
}

interface CompanyFallback {
  companyName: string
  tagline: string
  whatsapp: string
  address: string
  logoUrl: string
  bankName: string
  accountNumber: string
  accountHolder: string
  signerName: string
  signatureUrl: string
  notes: string
}

const DEFAULT_COMPANY: CompanyFallback = {
  companyName: 'CCTV APHIN',
  tagline: 'Spesialis Instalasi, Perawatan, & Perbaikan CCTV',
  whatsapp: '6281234567890',
  address: 'Bekasi & Jakarta — Layanan Kunjungan Langsung ke Lokasi',
  logoUrl: '',
  bankName: 'BCA',
  accountNumber: '8420123456',
  accountHolder: 'Tju Chi Phin',
  signerName: 'Aphin (Tju Chi Phin)',
  signatureUrl: '',
  notes:
    'Garansi pengerjaan instalasi 1 bulan. Seluruh perangkat telah diuji dan berfungsi normal saat serah terima.',
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDateID(dateStr?: string): string {
  if (!dateStr) {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  }
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) return dateStr
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}

export const InvoicePrintPreview: React.FC = () => {
  const [fields] = useAllFormFields()
  const [globalCompany, setGlobalCompany] = useState<CompanyFallback>(DEFAULT_COMPANY)

  useEffect(() => {
    let active = true
    fetch('/api/globals/company-settings?depth=1')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return
        const extractMediaUrl = (mediaField: unknown): string => {
          if (mediaField && typeof mediaField === 'object' && 'url' in mediaField) {
            return String((mediaField as { url?: string | null }).url || '')
          }
          return ''
        }
        setGlobalCompany({
          companyName: data.companyName || DEFAULT_COMPANY.companyName,
          tagline: data.tagline || DEFAULT_COMPANY.tagline,
          whatsapp: data.whatsapp || DEFAULT_COMPANY.whatsapp,
          address: data.address || DEFAULT_COMPANY.address,
          logoUrl: extractMediaUrl(data.logo) || DEFAULT_COMPANY.logoUrl,
          bankName: data.bankDetails?.bankName || DEFAULT_COMPANY.bankName,
          accountNumber: data.bankDetails?.accountNumber || DEFAULT_COMPANY.accountNumber,
          accountHolder: data.bankDetails?.accountHolder || DEFAULT_COMPANY.accountHolder,
          signerName: data.signerName || DEFAULT_COMPANY.signerName,
          signatureUrl: extractMediaUrl(data.signatureImage) || DEFAULT_COMPANY.signatureUrl,
          notes: data.defaultWarrantyNotes || DEFAULT_COMPANY.notes,
        })
      })
      .catch(() => {
        // Keep default fallback
      })
    return () => {
      active = false
    }
  }, [])

  const getFieldValue = <T,>(path: string, fallback: T): T => {
    const entry = fields?.[path]
    if (entry && entry.value !== undefined && entry.value !== null && entry.value !== '') {
      return entry.value as T
    }
    return fallback
  }

  const invoiceNumber = getFieldValue<string>('invoiceNumber', 'INV/APH/----/--/---')
  const issueDate = getFieldValue<string>('issueDate', new Date().toISOString())
  const status = getFieldValue<string>('status', 'unpaid')
  const clientName = getFieldValue<string>('clientName', 'Nama Klien / Instansi')
  const clientLocation = getFieldValue<string>('clientLocation', 'Alamat / Lokasi Pemasangan')
  const discount = Number(getFieldValue<number>('discount', 0)) || 0
  const downPayment = Number(getFieldValue<number>('downPayment', 0)) || 0
  const customNotes = getFieldValue<string>('customNotes', '')

  // Extract array line items from Payload flat form fields (items.0.description, etc.)
  const lineItems: LineItem[] = useMemo(() => {
    if (!fields) return []
    const indexSet = new Set<number>()
    for (const key of Object.keys(fields)) {
      const match = /^items\.(\d+)\./.exec(key)
      if (match) {
        indexSet.add(Number(match[1]))
      }
    }
    const indices = Array.from(indexSet).sort((a, b) => a - b)
    return indices.map((idx) => {
      const description = String(fields[`items.${idx}.description`]?.value || '')
      const qty = Number(fields[`items.${idx}.qty`]?.value ?? 1) || 0
      const unit = String(fields[`items.${idx}.unit`]?.value || 'Unit')
      const unitPrice = Number(fields[`items.${idx}.unitPrice`]?.value ?? 0) || 0
      const rowTotal = Math.round(qty * unitPrice)
      return {
        description: description || `Item Pekerjaan #${idx + 1}`,
        qty,
        unit,
        unitPrice,
        rowTotal,
      }
    })
  }, [fields])

  const subtotal = useMemo(
    () => lineItems.reduce((acc, item) => acc + item.rowTotal, 0),
    [lineItems],
  )
  const grandTotal = subtotal - discount - downPayment

  // Company Snapshot (prefer saved snapshot on document, fallback to live CompanySettings Global)
  const company = {
    companyName: getFieldValue<string>(
      'companySnapshot.companyName',
      globalCompany.companyName,
    ),
    tagline: getFieldValue<string>('companySnapshot.tagline', globalCompany.tagline),
    whatsapp: getFieldValue<string>('companySnapshot.whatsapp', globalCompany.whatsapp),
    address: getFieldValue<string>('companySnapshot.address', globalCompany.address),
    logoUrl: getFieldValue<string>('companySnapshot.logoUrl', globalCompany.logoUrl),
    bankName: getFieldValue<string>('companySnapshot.bankName', globalCompany.bankName),
    accountNumber: getFieldValue<string>(
      'companySnapshot.accountNumber',
      globalCompany.accountNumber,
    ),
    accountHolder: getFieldValue<string>(
      'companySnapshot.accountHolder',
      globalCompany.accountHolder,
    ),
    signerName: getFieldValue<string>('companySnapshot.signerName', globalCompany.signerName),
    signatureUrl: getFieldValue<string>(
      'companySnapshot.signatureUrl',
      globalCompany.signatureUrl,
    ),
    notes:
      customNotes.trim() ||
      getFieldValue<string>('companySnapshot.notes', globalCompany.notes),
  }

  const statusConfig =
    status === 'paid'
      ? {
          label: 'LUNAS',
          bg: '#ECFDF5',
          border: '#10B981',
          text: '#047857',
        }
      : status === 'draft'
        ? {
            label: 'DRAFT',
            bg: '#F5F5F7',
            border: '#86868B',
            text: '#1D1D1F',
          }
        : {
            label: 'BELUM LUNAS',
            bg: '#FFFBEB',
            border: '#F59E0B',
            text: '#B45309',
          }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div
      className="aphin-invoice-preview-wrapper"
      style={{
        marginTop: '28px',
        marginBottom: '32px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body * {
            visibility: hidden !important;
          }
          /* Hide Payload Admin chrome & action bars when printing */
          .template-default__nav,
          .app-header,
          .doc-controls,
          .aphin-print-toolbar,
          nav,
          header,
          aside {
            display: none !important;
          }
          #aphin-invoice-print-sheet,
          #aphin-invoice-print-sheet * {
            visibility: visible !important;
          }
          #aphin-invoice-print-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #FFFFFF !important;
            color: #1D1D1F !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Non-Printed Action Bar inside Payload Editor */}
      <div
        className="aphin-print-toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: '#F5F5F7',
          border: '1px solid #D2D2D7',
          borderRadius: '14px',
          padding: '14px 20px',
          marginBottom: '16px',
        }}
      >
        <div>
          <span
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: '#1D1D1F',
            }}
          >
            Pratinjau Nota / Invoice A4 (Siap Cetak)
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '12px',
              color: '#86868B',
              marginTop: '2px',
            }}
          >
            Pratinjau ini otomatis mengikuti perubahan item, harga, diskon, dan DP secara langsung.
          </span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#0071E3',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 113, 227, 0.25)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>Cetak / Download PDF</span>
        </button>
      </div>

      {/* Printable A4 Sheet */}
      <div
        id="aphin-invoice-print-sheet"
        style={{
          backgroundColor: '#FFFFFF',
          color: '#1D1D1F',
          border: '1px solid #D2D2D7',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '840px',
          margin: '0 auto',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* 1. Top Header: Brand Identity + Status Badge */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            paddingBottom: '24px',
            borderBottom: '2px solid #1D1D1F',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {company.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logoUrl}
                  alt={company.companyName}
                  style={{
                    height: '36px',
                    width: 'auto',
                    maxWidth: '120px',
                    objectFit: 'contain',
                    borderRadius: '6px',
                  }}
                />
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#1D1D1F',
                    color: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  CA
                </span>
              )}
              <h1
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#1D1D1F',
                }}
              >
                {company.companyName}
              </h1>
            </div>
            <p
              style={{
                margin: '6px 0 0 0',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0071E3',
              }}
            >
              {company.tagline}
            </p>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#86868B',
                maxWidth: '400px',
                lineHeight: 1.4,
              }}
            >
              {company.address} • WhatsApp: {company.whatsapp}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: statusConfig.bg,
                border: `1.5px solid ${statusConfig.border}`,
                color: statusConfig.text,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.06em',
              }}
            >
              {statusConfig.label}
            </span>
            <div style={{ marginTop: '10px' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#86868B',
                }}
              >
                Nomor Invoice
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  color: '#1D1D1F',
                }}
              >
                {invoiceNumber}
              </span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <span style={{ fontSize: '12px', color: '#86868B' }}>
                Tanggal: <strong style={{ color: '#1D1D1F' }}>{formatDateID(issueDate)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Client Information Box */}
        <div
          style={{
            marginTop: '24px',
            backgroundColor: '#F5F5F7',
            border: '1px solid #E5E5EA',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#86868B',
              }}
            >
              Ditujukan Kepada (Klien):
            </span>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '15px',
                fontWeight: 700,
                color: '#1D1D1F',
              }}
            >
              {clientName}
            </p>
          </div>
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#86868B',
              }}
            >
              Lokasi Pekerjaan / Instalasi:
            </span>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: '#1D1D1F',
                lineHeight: 1.4,
                whiteSpace: 'pre-line',
              }}
            >
              {clientLocation}
            </p>
          </div>
        </div>

        {/* 3. Bordered Line Item Table */}
        <div
          role="region"
          aria-label="Rincian Item Invoice"
          tabIndex={0}
          style={{ marginTop: '24px', overflowX: 'auto' }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#F5F5F7',
                  borderTop: '1px solid #D2D2D7',
                  borderBottom: '1px solid #D2D2D7',
                }}
              >
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: '#1D1D1F',
                    width: '44px',
                    border: '1px solid #E5E5EA',
                  }}
                >
                  No
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontWeight: 700,
                    color: '#1D1D1F',
                    border: '1px solid #E5E5EA',
                  }}
                >
                  Deskripsi Pekerjaan / Perangkat
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: '#1D1D1F',
                    width: '64px',
                    border: '1px solid #E5E5EA',
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: '#1D1D1F',
                    width: '80px',
                    border: '1px solid #E5E5EA',
                  }}
                >
                  Satuan
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: '#1D1D1F',
                    width: '140px',
                    border: '1px solid #E5E5EA',
                  }}
                >
                  Harga Satuan
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: '#1D1D1F',
                    width: '150px',
                    border: '1px solid #E5E5EA',
                  }}
                >
                  Jumlah (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length > 0 ? (
                lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'center',
                        border: '1px solid #E5E5EA',
                        color: '#86868B',
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #E5E5EA',
                        color: '#1D1D1F',
                        fontWeight: 500,
                      }}
                    >
                      {item.description}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'center',
                        border: '1px solid #E5E5EA',
                        color: '#1D1D1F',
                      }}
                    >
                      {item.qty}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'center',
                        border: '1px solid #E5E5EA',
                        color: '#86868B',
                      }}
                    >
                      {item.unit}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'right',
                        border: '1px solid #E5E5EA',
                        color: '#1D1D1F',
                      }}
                    >
                      {formatIDR(item.unitPrice)}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'right',
                        border: '1px solid #E5E5EA',
                        color: '#1D1D1F',
                        fontWeight: 600,
                      }}
                    >
                      {formatIDR(item.rowTotal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      border: '1px solid #E5E5EA',
                      color: '#86868B',
                      fontStyle: 'italic',
                    }}
                  >
                    Belum ada item pekerjaan yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Payment Transfer Box & Totals Calculation Grid */}
        <div
          style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left: Prominent BCA Transfer Box + Warranty Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                backgroundColor: '#F5F5F7',
                border: '1.5px solid #0071E3',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#0071E3',
                }}
              >
                Informasi Rekening Pembayaran
              </span>
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#1D1D1F',
                }}
              >
                Bank {company.bankName} — {company.accountNumber}
              </div>
              <div
                style={{
                  marginTop: '2px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1D1D1F',
                }}
              >
                a.n. {company.accountHolder}
              </div>
            </div>

            <div
              style={{
                border: '1px solid #E5E5EA',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '12px',
                color: '#86868B',
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: '#1D1D1F', display: 'block', marginBottom: '3px' }}>
                Catatan & Garansi:
              </strong>
              {company.notes}
            </div>
          </div>

          {/* Right: Totals Breakdown */}
          <div
            style={{
              border: '1px solid #E5E5EA',
              borderRadius: '12px',
              padding: '16px 20px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                fontSize: '13px',
                color: '#86868B',
              }}
            >
              <span>Subtotal</span>
              <strong style={{ color: '#1D1D1F' }}>{formatIDR(subtotal)}</strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                fontSize: '13px',
                color: '#86868B',
              }}
            >
              <span>Potongan / Diskon</span>
              <span style={{ color: '#1D1D1F' }}>- {formatIDR(discount)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0 12px 0',
                fontSize: '13px',
                color: '#86868B',
                borderBottom: '1px solid #E5E5EA',
              }}
            >
              <span>Uang Muka / DP</span>
              <span style={{ color: '#1D1D1F' }}>- {formatIDR(downPayment)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                fontSize: '16px',
                fontWeight: 800,
                color: '#1D1D1F',
              }}
            >
              <span>TOTAL TAGIHAN</span>
              <span style={{ color: '#0071E3', fontSize: '18px' }}>
                {formatIDR(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Footer Signature Area */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid #E5E5EA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '12px',
            color: '#86868B',
          }}
        >
          <div>
            <p style={{ margin: 0 }}>Terima kasih atas kepercayaan Anda pada layanan</p>
            <strong style={{ color: '#1D1D1F' }}>{company.companyName}</strong>
          </div>

          <div style={{ textAlign: 'center', minWidth: '190px' }}>
            <span style={{ display: 'block', marginBottom: '8px', color: '#86868B' }}>
              Hormat Kami,
            </span>
            {company.signatureUrl ? (
              <div
                style={{
                  height: '68px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.signatureUrl}
                  alt={`Tanda Tangan ${company.signerName}`}
                  style={{
                    maxHeight: '64px',
                    maxWidth: '160px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ) : (
              <div style={{ height: '52px' }} />
            )}
            <strong
              style={{
                display: 'block',
                color: '#1D1D1F',
                fontSize: '13px',
                borderTop: '1px solid #1D1D1F',
                paddingTop: '6px',
              }}
            >
              {company.signerName}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePrintPreview
