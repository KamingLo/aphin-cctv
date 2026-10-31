import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media } from '@/payload-types'
import Image from 'next/image'

export const Logos = async () => {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' })
    const darkModelLogo = settings?.darkModeLogo as Media | undefined
    const lightModelLogo = settings?.lightModeLogo as Media | undefined

    if (darkModelLogo?.url || lightModelLogo?.url) {
      return (
        <>
          {darkModelLogo?.url && (
            <Image
              src={darkModelLogo.url}
              alt={darkModelLogo.alt || 'CCTV APHIN'}
              width={darkModelLogo.width || 240}
              height={darkModelLogo.height || 64}
              className="dark-mode-image"
            />
          )}
          {lightModelLogo?.url && (
            <Image
              src={lightModelLogo.url}
              alt={lightModelLogo.alt || 'CCTV APHIN'}
              width={lightModelLogo.width || 240}
              height={lightModelLogo.height || 64}
              className="light-mode-image"
            />
          )}
        </>
      )
    }
  } catch {
    // Fallback to clean text brand below
  }

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        fontWeight: 800,
        fontSize: '20px',
        letterSpacing: '-0.03em',
      }}
    >
      CCTV APHIN
    </div>
  )
}
