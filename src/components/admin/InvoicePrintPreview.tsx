'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, useAllFormFields } from '@payloadcms/ui'

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
    companyName: getFieldValue<string>('companySnapshot.companyName', globalCompany.companyName),
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
    signatureUrl: getFieldValue<string>('companySnapshot.signatureUrl', globalCompany.signatureUrl),
    notes:
      customNotes.trim() || getFieldValue<string>('companySnapshot.notes', globalCompany.notes),
  }

  // Print the A4 sheet inside an isolated iframe so the printed output is a 1:1 copy
  // of the on-screen preview (same width, same layout, no Payload admin chrome).
  const handlePrint = () => {
    if (typeof window === 'undefined') return
    const sheet = document.getElementById('aphin-invoice-print-sheet')
    if (!sheet) return

    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentDocument
    const win = iframe.contentWindow
    if (!doc || !win) {
      iframe.remove()
      return
    }

    // Reuse the admin stylesheets (fonts, resets) so typography matches the preview.
    const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((node) => node.outerHTML)
      .join('\n')

    const clone = sheet.cloneNode(true) as HTMLElement
    clone.style.fontFamily = window.getComputedStyle(sheet).fontFamily
    clone.style.border = 'none'
    clone.style.borderRadius = '0'
    clone.style.boxShadow = 'none'
    clone.style.margin = '0'

    const safeTitle = String(invoiceNumber).replace(/[\\/:*?"<>|]+/g, '-')

    doc.open()
    doc.write(`<!DOCTYPE html>
<html data-theme="light">
<head>
<meta charset="utf-8" />
<title>${safeTitle}</title>
${headStyles}
<style>
  @page { size: A4 portrait; margin: 0; }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #FFFFFF !important;
    overflow: visible !important;
    height: auto !important;
  }
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #aphin-invoice-print-sheet { box-sizing: border-box; }
  tr, img { break-inside: avoid; page-break-inside: avoid; }
</style>
</head>
<body>${clone.outerHTML}</body>
</html>`)
    doc.close()

    const cleanup = () => {
      setTimeout(() => iframe.remove(), 500)
    }

    const triggerPrint = () => {
      const images = Array.from(doc.images)
      Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve()
                img.onerror = () => resolve()
              }),
        ),
      )
        .then(() => (doc.fonts ? doc.fonts.ready : undefined))
        .then(() => {
          win.addEventListener('afterprint', cleanup, { once: true })
          win.focus()
          win.print()
          // Fallback cleanup for browsers that don't fire afterprint
          setTimeout(cleanup, 60000)
        })
    }

    if (doc.readyState === 'complete') {
      setTimeout(triggerPrint, 300)
    } else {
      iframe.onload = () => setTimeout(triggerPrint, 100)
    }
  }

  return (
    <div
      className="aphin-invoice-preview-wrapper"
      style={{
        marginTop: '28px',
        marginBottom: '32px',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Non-Printed Action Bar inside Payload Editor (Payload theme tokens via custom.scss) */}
      <div className="aphin-print-toolbar">
        <div>
          <span className="aphin-print-toolbar__title">
            Pratinjau Nota / Invoice A4 (Siap Cetak)
          </span>
          <span className="aphin-print-toolbar__desc">
            Pratinjau ini otomatis mengikuti perubahan item, harga, diskon, dan DP secara langsung.
          </span>
        </div>

        <Button
          buttonStyle="primary"
          size="medium"
          margin={false}
          onClick={handlePrint}
          iconPosition="left"
          icon={
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
          }
        >
          Cetak / Download PDF
        </Button>
      </div>

      {/* Printable A4 Sheet (fixed 210mm x 297mm white paper so preview matches print 1:1) */}
      <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        <div
          id="aphin-invoice-print-sheet"
          style={{
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            color: '#1D1D1F',
            border: '1px solid var(--theme-border-color)',
            borderRadius: 'var(--style-radius-m)',
            padding: '12mm',
            width: '210mm',
            minWidth: '210mm',
            minHeight: '297mm',
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
            lineHeight: 1.4,
          }}
        >
          {/* 1. Top Header: Brand Identity + Invoice Number & Date */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
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
                  color: '#1D1D1F',
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
              <div>
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
              gridTemplateColumns: '1fr 1fr',
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
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            {/* Left: Prominent BCA Transfer Box + Warranty Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: '#F5F5F7',
                  border: '1px solid #1D1D1F',
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
                    color: '#1D1D1F',
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
                <span style={{ color: '#1D1D1F', fontSize: '18px' }}>{formatIDR(grandTotal)}</span>
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
    </div>
  )
}

export default InvoicePrintPreview
