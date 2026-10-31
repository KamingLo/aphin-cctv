import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import NavbarLiquid, { NavLink } from '@/components/layout/NavbarLiquid'
import FooterGlobal, { FooterLink } from '@/components/layout/FooterGlobal'
import RenderBlocks from '@/components/RenderBlocks'
import type { PortfolioItem } from '@/components/blocks/PortofolioLapangan'
import type {
  CompanySetting,
  FooterGlobal as FooterGlobalType,
  Media,
  NavbarLiquid as NavbarLiquidType,
  Page,
  Portfolio,
} from '@/payload-types'
import './styles.css'

function buildWhatsappUrl(rawNumber?: string | null): string | undefined {
  if (!rawNumber) return undefined
  const digits = rawNumber.replace(/[^0-9]/g, '')
  if (!digits) return undefined
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  const text = encodeURIComponent(
    'Halo Pak Aphin, saya ingin konsultasi pemasangan/perbaikan CCTV...',
  )
  return `https://wa.me/${normalized}?text=${text}`
}

export default async function HomePage() {
  let companySettings: CompanySetting | undefined
  let portfolioDocs: Portfolio[] = []
  let navbarData: NavbarLiquidType | undefined
  let pageData: Page | undefined
  let footerData: FooterGlobalType | undefined

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // 1. Fetch CompanySettings Global (Single Source of Truth for Brand & WhatsApp)
    companySettings = await payload.findGlobal({
      slug: 'company-settings',
    })

    // 2. Fetch Portfolio Collection (Real-world field photos & videos)
    const portfolioRes = await payload.find({
      collection: 'portfolio',
      sort: '-createdAt',
      limit: 24,
    })
    portfolioDocs = portfolioRes.docs

    // 3. Fetch Navbar
    const navbarRes = await payload.find({
      collection: 'navbar-liquid',
      limit: 1,
    })
    navbarData = navbarRes.docs[0]

    // 4. Fetch Page with slug 'home' or 'main'
    const pageRes = await payload.find({
      collection: 'pages',
      where: {
        or: [{ slug: { equals: 'home' } }, { slug: { equals: 'main' } }],
      },
      limit: 1,
    })
    pageData = pageRes.docs[0]

    // 5. Fetch Footer
    const footerRes = await payload.find({
      collection: 'footer-global',
      limit: 1,
    })
    footerData = footerRes.docs[0]
  } catch {
    // Gracefully fallback to CCTV APHIN default craftsmanship content if DB is unavailable
  }

  // Helper: extract URL from a Media upload field
  const getMediaInfo = (
    mediaField: unknown,
  ): { url?: string; mimeType?: string | null } => {
    if (!mediaField || typeof mediaField !== 'object') return {}
    const mediaObj = mediaField as Partial<Media>
    return {
      url: mediaObj.url || undefined,
      mimeType: mediaObj.mimeType,
    }
  }

  // Build dynamic WhatsApp URL from CompanySettings Global
  const whatsappUrl = buildWhatsappUrl(companySettings?.whatsapp)

  // Map Portfolio Collection documents to PortofolioLapangan items
  const portfolioItems: PortfolioItem[] | undefined =
    portfolioDocs.length > 0
      ? portfolioDocs.map((doc) => {
          const mediaInfo = getMediaInfo(doc.media)
          const isVideo =
            doc.category === 'Dokumentasi Video' ||
            Boolean(mediaInfo.mimeType && mediaInfo.mimeType.startsWith('video/'))

          return {
            title: doc.title,
            locationContext: doc.location,
            scopeTag: doc.techSpecTag,
            category: doc.category,
            mediaMode: isVideo ? 'video' : 'image',
            aspectRatio: isVideo ? '16/9' : '4/3',
            overlayTag: doc.category,
            mediaUrl: mediaInfo.url,
          }
        })
      : undefined

  // Parse Navbar props (prefer CompanySettings brand/logo & WhatsApp CTA)
  const companyLogoUrl = getMediaInfo(companySettings?.logo).url
  const navbarLogoUrl = getMediaInfo(navbarData?.logo).url

  const navbarProps = {
    brandName: companySettings?.companyName || navbarData?.brandName || 'CCTV APHIN',
    logoUrl: companyLogoUrl || navbarLogoUrl,
    ctaText: navbarData?.ctaText || 'Konsultasi WhatsApp',
    ctaLink: whatsappUrl || navbarData?.ctaLink || undefined,
    links: navbarData?.links?.map((l) => ({
      label: l.label,
      url: l.url,
      isActive: l.isActive,
    })) as NavLink[] | undefined,
  }

  // Parse Footer props (ensure discrete link [ Portal Internal ↗ ] points to /admin)
  const footerProps = {
    copyright:
      footerData?.copyright ||
      `© ${new Date().getFullYear()} ${companySettings?.companyName || 'CCTV APHIN'}. ${companySettings?.tagline || 'Spesialis Sistem Keamanan & Kamera Pengawas.'}`,
    portalLabel: footerData?.portalLabel || 'Portal Internal',
    portalUrl:
      !footerData?.portalUrl || footerData.portalUrl === '/login'
        ? '/admin'
        : footerData.portalUrl,
    links: footerData?.links?.map((l) => ({
      label: l.label,
      url: l.url,
    })) as FooterLink[] | undefined,
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      {/* 1. Sticky Frosted-Glass Navbar */}
      <NavbarLiquid {...navbarProps} />

      {/* Main Content Container (Sections 2 through 7) */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
        <RenderBlocks
          layout={pageData?.layout}
          fallbackToDefaultLanding
          portfolioItems={portfolioItems}
          whatsappUrl={whatsappUrl}
        />
      </main>

      {/* 7. Discrete Portal Footer ([ Portal Internal ↗ ] -> /admin) */}
      <FooterGlobal {...footerProps} />
    </div>
  )
}
