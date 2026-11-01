import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media } from '@/payload-types'
import Image from 'next/image'

export const Icons = async () => {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'settings' })
    const darkModelIcon = settings?.darkModeIcon as Media | undefined
    const lightModelIcon = settings?.lightModeIcon as Media | undefined

    if (darkModelIcon?.url || lightModelIcon?.url) {
      return (
        <>
          {darkModelIcon?.url && (
            <Image
              src={darkModelIcon.url}
              alt={darkModelIcon.alt || 'CCTV APHIN'}
              width={darkModelIcon.width || 32}
              height={darkModelIcon.height || 32}
              className="dark-mode-image"
            />
          )}
          {lightModelIcon?.url && (
            <Image
              src={lightModelIcon.url}
              alt={lightModelIcon.alt || 'CCTV APHIN'}
              width={lightModelIcon.width || 32}
              height={lightModelIcon.height || 32}
              className="light-mode-image"
            />
          )}
        </>
      )
    }
  } catch {
    // Fallback to clean monogram icon below
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        width: '28px',
        height: '28px',
        borderRadius: 'var(--style-radius-s)',
        backgroundColor: 'var(--theme-elevation-1000)',
        color: 'var(--theme-elevation-0)',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '12px',
      }}
    >
      CA
    </span>
  )
}
