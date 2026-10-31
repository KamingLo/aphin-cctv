'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export interface NavLink {
  label: string
  url: string
  isActive?: boolean | null
}

export interface NavbarLiquidProps {
  brandName?: string
  logoUrl?: string
  links?: NavLink[]
  ctaText?: string
  ctaLink?: string
}

const defaultLinks: NavLink[] = [
  { label: 'Layanan', url: '#layanan', isActive: false },
  { label: 'Standar Kerja', url: '#standar-kerja', isActive: false },
  { label: 'Portofolio', url: '#portofolio', isActive: false },
  { label: 'Alur Kerja', url: '#alur-kerja', isActive: false },
]

const defaultWhatsappUrl =
  'https://wa.me/6281234567890?text=Halo%20Pak%20Aphin%2C%20saya%20ingin%20konsultasi%20pemasangan%2Fperbaikan%20CCTV...'

export default function NavbarLiquid({
  brandName = 'CCTV APHIN',
  logoUrl,
  links,
  ctaText = 'Konsultasi WhatsApp',
  ctaLink = defaultWhatsappUrl,
}: NavbarLiquidProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Use CCTV APHIN jump links when CMS links are empty or still have generic starter template URLs
  const hasCustomLinks =
    links &&
    links.length > 0 &&
    !links.some((l) => l.url === '/about-us' || l.label === 'Template Merek')
  const navLinks = hasCustomLinks ? links : defaultLinks
  const displayBrand =
    !brandName || brandName === 'Template Merek' || brandName === 'Arang & Brisket'
      ? 'CCTV APHIN'
      : brandName

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E5EA] bg-white/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand with Subtle Camera Lens Glyph */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-[#1D1D1F] focus:outline-none"
          aria-label={displayBrand}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={displayBrand}
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D2D2D7] bg-[#F5F5F7] text-[#1D1D1F] shadow-2xs transition-colors group-hover:border-[#0071E3]/40 group-hover:text-[#0071E3]">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="3" x2="14.5" y2="8.5" />
                <line x1="21" y1="12" x2="15.5" y2="14.5" />
                <line x1="12" y1="21" x2="9.5" y2="15.5" />
                <line x1="3" y1="12" x2="8.5" y2="9.5" />
              </svg>
            </span>
          )}
          <span className="text-[15px] font-semibold tracking-tight text-[#1D1D1F]">
            {displayBrand}
          </span>
        </a>

        {/* Desktop Jump Links */}
        <nav className="hidden md:flex md:items-center md:gap-8" aria-label="Navigasi Utama">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              className="text-[13px] font-medium text-[#1D1D1F]/80 transition-colors hover:text-[#0071E3]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Quick WhatsApp Pill CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0071E3] px-4 py-2 text-xs font-medium text-white shadow-2xs transition-all hover:bg-[#0077ED] active:scale-[0.99] sm:text-[13px]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>{ctaText}</span>
          </a>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Buka menu navigasi"
            aria-expanded={isOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D2D2D7] bg-white text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7] md:hidden"
          >
            {isOpen ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <nav
          aria-label="Navigasi Seluler"
          className="border-t border-[#E5E5EA] bg-white/95 px-4 py-4 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7] hover:text-[#0071E3]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
