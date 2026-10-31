import React from 'react'
import type { Page } from '@/payload-types'
import HeroBento, { HeroFeature } from '@/components/blocks/HeroBento'
import LayananUtama from '@/components/blocks/LayananUtama'
import StandarKerjaBento from '@/components/blocks/StandarKerjaBento'
import PortofolioLapangan, { PortfolioItem } from '@/components/blocks/PortofolioLapangan'
import EkosistemPerangkat from '@/components/blocks/EkosistemPerangkat'
import AlurKerja from '@/components/blocks/AlurKerja'
import HeroSekunder from '@/components/blocks/HeroSekunder'
import BannerLayanan from '@/components/blocks/BannerLayanan'
import RichText from '@/components/blocks/RichText'
import FAQAccordion from '@/components/blocks/FAQAccordion'
import FeaturesGrid from '@/components/blocks/FeaturesGrid'
import RecentBlogs from '@/components/blocks/RecentBlogs'

/** Helper: extract URL from a Media field (populated object or ID) */
const getImageUrl = (imageField: unknown): string | undefined => {
  if (!imageField) return undefined
  if (typeof imageField === 'object' && imageField !== null && 'url' in imageField) {
    const url = (imageField as { url?: string | null }).url
    return url || undefined
  }
  return undefined
}

const isLegacyTemplateHero = (title?: string | null) => {
  if (!title) return false
  return (
    title.includes('Arang') ||
    title.includes('Brisket') ||
    title.includes('Judul Hero Utama Template')
  )
}

export default function RenderBlocks({
  layout,
  fallbackToDefaultLanding = false,
  portfolioItems,
  whatsappUrl,
}: {
  layout?: Page['layout']
  fallbackToDefaultLanding?: boolean
  portfolioItems?: PortfolioItem[]
  whatsappUrl?: string
}) {
  const hasValidCustomBlocks =
    layout &&
    layout.length > 0 &&
    !layout.some((b) => b.blockType === 'heroUtama' && isLegacyTemplateHero(b.title))

  if (!hasValidCustomBlocks) {
    if (!fallbackToDefaultLanding) return null

    // Render complete CCTV APHIN sections (Sections 2 through 7) connected to Portfolio & CompanySettings
    return (
      <div className="divide-y divide-[#E5E5EA]">
        <HeroBento ctaLink={whatsappUrl} />
        <LayananUtama />
        <StandarKerjaBento />
        <PortofolioLapangan items={portfolioItems} />
        <EkosistemPerangkat />
        <AlurKerja whatsappUrl={whatsappUrl} />
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#E5E5EA]">
      {layout.map((block, index) => {
        switch (block.blockType) {
          case 'heroUtama':
            return (
              <HeroBento
                key={block.id || index}
                title={block.title}
                subtitle={block.subtitle || undefined}
                description={block.description}
                ctaText={block.ctaText}
                ctaLink={whatsappUrl || block.ctaLink}
                secondaryCtaText={block.secondaryCtaText || undefined}
                secondaryCtaLink={block.secondaryCtaLink || undefined}
                showcaseLabel={block.showcaseLabel || undefined}
                imageUrl={getImageUrl(block.image)}
                features={
                  block.features?.map((f) => ({
                    title: f.title,
                    value: f.value,
                    detail: f.detail,
                  })) as HeroFeature[]
                }
              />
            )

          case 'layananUtama':
            return (
              <LayananUtama
                key={block.id || index}
                sectionTag={block.sectionTag}
                title={block.title}
                subtitle={block.subtitle}
                services={block.services}
              />
            )

          case 'standarKerjaBento':
            return (
              <StandarKerjaBento
                key={block.id || index}
                sectionTag={block.sectionTag}
                title={block.title}
                subtitle={block.subtitle}
                tiles={block.tiles?.map((t) => ({
                  span: t.span,
                  badge: t.badge,
                  title: t.title,
                  description: t.description,
                  mediaLabel: t.mediaLabel,
                  imageUrl: getImageUrl(t.image),
                }))}
              />
            )

          case 'portofolioLapangan': {
            const blockItems = block.items?.map((item) => ({
              title: item.title,
              locationContext: item.locationContext,
              scopeTag: item.scopeTag,
              category: item.category,
              mediaMode: item.mediaMode,
              aspectRatio: item.aspectRatio,
              overlayTag: item.overlayTag,
              mediaUrl: getImageUrl(item.media),
            })) as PortfolioItem[] | undefined

            const mergedPortfolio =
              portfolioItems && portfolioItems.length > 0 ? portfolioItems : blockItems

            return (
              <PortofolioLapangan
                key={block.id || index}
                sectionTag={block.sectionTag}
                title={block.title}
                subtitle={block.subtitle}
                items={mergedPortfolio}
              />
            )
          }

          case 'ekosistemPerangkat':
            return (
              <EkosistemPerangkat
                key={block.id || index}
                sectionTag={block.sectionTag}
                title={block.title}
                subtitle={block.subtitle}
                brands={block.brands}
                architectures={block.architectures}
              />
            )

          case 'alurKerja':
            return (
              <AlurKerja
                key={block.id || index}
                sectionTag={block.sectionTag}
                title={block.title}
                subtitle={block.subtitle}
                steps={block.steps}
                serviceAreaTitle={block.serviceAreaTitle}
                serviceAreaDescription={block.serviceAreaDescription}
                areas={block.areas}
                serviceHours={block.serviceHours}
                ctaTitle={block.ctaTitle}
                ctaDescription={block.ctaDescription}
                ctaButtonText={block.ctaButtonText}
                whatsappUrl={whatsappUrl || block.whatsappUrl}
              />
            )

          case 'heroSekunder':
            return (
              <HeroSekunder
                key={block.id || index}
                title={block.title}
                subtitle={block.subtitle}
                description={block.description}
                ctaText={block.ctaText}
                ctaLink={block.ctaLink}
                imageUrl={getImageUrl(block.image)}
                alignment={block.alignment}
              />
            )

          case 'bannerLayanan':
            return (
              <BannerLayanan
                key={block.id || index}
                title={block.title}
                description={block.description}
                ctaText={block.ctaText}
                ctaLink={block.ctaLink}
                icon={block.icon}
                style={block.style}
              />
            )

          case 'richContent':
            return (
              <section key={block.id || index} className="page-content-section">
                {block.content && <RichText content={block.content} />}
              </section>
            )

          case 'faqAccordion':
            return (
              <FAQAccordion
                key={block.id || index}
                title={block.title}
                subtitle={block.subtitle}
                faqs={block.faqs?.map((f) => ({
                  question: f.question,
                  answer: f.answer,
                }))}
              />
            )

          case 'featuresGrid':
            return (
              <FeaturesGrid
                key={block.id || index}
                title={block.title}
                subtitle={block.subtitle}
                features={block.features?.map((f) => ({
                  icon: f.icon,
                  title: f.title,
                  description: f.description,
                }))}
              />
            )

          case 'recentBlogs':
            return (
              <RecentBlogs
                key={block.id || index}
                title={block.title}
                subtitle={block.subtitle}
                limit={block.limit}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}
