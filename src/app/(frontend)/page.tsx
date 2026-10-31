import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import NavbarLiquid, { NavLink } from '@/components/layout/NavbarLiquid'
import FooterGlobal, { FooterLink } from '@/components/layout/FooterGlobal'
import RenderBlocks from '@/components/RenderBlocks'
import type { FooterGlobal as FooterGlobalType, NavbarLiquid as NavbarLiquidType, Page } from '@/payload-types'
import './styles.css'

export default async function HomePage() {
  let navbarData: NavbarLiquidType | undefined
  let pageData: Page | undefined
  let footerData: FooterGlobalType | undefined

  try {
    if (process.env.PAYLOAD_SECRET) {
      const payloadConfig = await config
      const payload = await getPayload({ config: payloadConfig })

      // 1. Fetch Navbar
      const navbarRes = await payload.find({
        collection: 'navbar-liquid',
        limit: 1,
      })
      navbarData = navbarRes.docs[0]

      // 2. Fetch Page with slug 'home' or 'main'
      const pageRes = await payload.find({
        collection: 'pages',
        where: {
          or: [{ slug: { equals: 'home' } }, { slug: { equals: 'main' } }],
        },
        limit: 1,
      })
      pageData = pageRes.docs[0]

      // 3. Fetch Footer
      const footerRes = await payload.find({
        collection: 'footer-global',
        limit: 1,
      })
      footerData = footerRes.docs[0]
    }
  } catch {
    // Gracefully fallback to CCTV APHIN default content when Payload DB/env is not yet initialized
  }

  // Map Helper for Media fields
  const getImageUrl = (imageField: unknown): string | undefined => {
    if (!imageField) return undefined
    if (typeof imageField === 'object' && imageField !== null && 'url' in imageField) {
      const url = (imageField as { url?: string | null }).url
      return url || undefined
    }
    return undefined
  }

  // Parse Navbar props
  const navbarProps = navbarData
    ? {
        brandName: navbarData.brandName,
        logoUrl: getImageUrl(navbarData.logo),
        ctaText: navbarData.ctaText || undefined,
        ctaLink: navbarData.ctaLink || undefined,
        links: navbarData.links?.map((l) => ({
          label: l.label,
          url: l.url,
          isActive: l.isActive,
        })) as NavLink[],
      }
    : {}

  // Parse Footer props
  const footerProps = footerData
    ? {
        copyright: footerData.copyright,
        portalLabel: footerData.portalLabel || undefined,
        portalUrl: footerData.portalUrl || undefined,
        links: footerData.links?.map((l) => ({
          label: l.label,
          url: l.url,
        })) as FooterLink[],
      }
    : {}

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      {/* 1. Sticky Frosted-Glass Navbar */}
      <NavbarLiquid {...navbarProps} />

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
        <RenderBlocks layout={pageData?.layout} fallbackToDefaultLanding />
      </main>

      {/* 7. Discrete Portal Footer */}
      <FooterGlobal {...footerProps} />
    </div>
  )
}
