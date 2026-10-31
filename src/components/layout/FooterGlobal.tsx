import React from 'react'

export interface FooterLink {
  label: string
  url: string
}

export interface FooterGlobalProps {
  copyright?: string
  portalLabel?: string
  portalUrl?: string
  links?: FooterLink[]
}

export default function FooterGlobal({
  copyright = '© 2026 CCTV APHIN. Spesialis Sistem Keamanan & Kamera Pengawas.',
  portalLabel = 'Portal Internal',
  portalUrl = '/admin',
  links,
}: FooterGlobalProps) {
  const displayCopyright =
    !copyright ||
    copyright.includes('Template Web') ||
    copyright.includes('Arang Premium')
      ? '© 2026 CCTV APHIN. Spesialis Sistem Keamanan & Kamera Pengawas.'
      : copyright

  const resolvedPortalUrl =
    !portalUrl || portalUrl === '/login' ? '/admin' : portalUrl

  return (
    <footer className="w-full border-t border-[#D2D2D7] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-[#86868B] sm:flex-row sm:px-6 lg:px-8">
        {/* Left: Copyright */}
        <p className="text-center sm:text-left">{displayCopyright}</p>

        {/* Right: Optional CMS Links + Subtle Discrete Internal Portal Link */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          {links &&
            links
              .filter((l) => !l.url.startsWith('#privacy') && !l.url.startsWith('#terms'))
              .map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="text-xs text-[#86868B] transition-colors hover:text-[#1D1D1F]"
                >
                  {link.label}
                </a>
              ))}

          <a
            href={resolvedPortalUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-[11px] font-medium text-[#86868B]/85 transition-colors hover:border-[#E5E5EA] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
            title="Akses Portal Internal & Pembuatan Invoice"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>[ {portalLabel} ↗ ]</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
