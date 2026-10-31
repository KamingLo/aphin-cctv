import React from 'react'
import './styles.css'

export const metadata = {
  title: 'CCTV APHIN — Instalasi, Perawatan & Perbaikan CCTV Presisi',
  description:
    'Layanan instalasi baru, perawatan berkala, dan perbaikan sistem keamanan CCTV dengan standar kerapian pipa conduit, setting pantau HP stabil, dan garansi langsung oleh teknisi berpengalaman Pak Aphin.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="id" className="scroll-smooth bg-[#F5F5F7] text-[#1D1D1F] antialiased">
      <body className="min-h-dvh bg-[#F5F5F7] font-sans text-[#1D1D1F] selection:bg-[#0071E3]/15 selection:text-[#0071E3]">
        {children}
      </body>
    </html>
  )
}
