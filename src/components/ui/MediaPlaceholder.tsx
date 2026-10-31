import React from 'react'
import Image from 'next/image'

export type MediaAspectRatio = '16/9' | '9/16' | '4/3'
export type MediaPlaceholderMode = 'image' | 'video'

export interface MediaPlaceholderProps {
  mode?: MediaPlaceholderMode
  aspectRatio?: MediaAspectRatio
  label: string
  tag?: string
  src?: string
  poster?: string
  alt?: string
  priority?: boolean
  className?: string
}

const aspectClassMap: Record<MediaAspectRatio, string> = {
  '16/9': 'aspect-video',
  '9/16': 'aspect-[9/16]',
  '4/3': 'aspect-[4/3]',
}

export default function MediaPlaceholder({
  mode = 'image',
  aspectRatio = '16/9',
  label,
  tag,
  src,
  poster,
  alt,
  priority = false,
  className = '',
}: MediaPlaceholderProps) {
  const aspectClass = aspectClassMap[aspectRatio] || 'aspect-video'
  const isVideo = mode === 'video'

  return (
    <div
      className={`group relative w-full overflow-hidden bg-[#EBEBED] border border-[#D2D2D7]/80 select-none ${aspectClass} ${className}`}
    >
      {/* Subtle architectural technical grid background for empty placeholder */}
      {!src && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#C7C7CC_1px,transparent_1px)] [background-size:20px_20px] opacity-65 transition-transform duration-500 group-hover:scale-[1.02]"
        />
      )}

      {/* Subtle ambient gradient */}
      {!src && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-white/55 via-transparent to-[#D2D2D7]/45"
        />
      )}

      {/* Live Media Rendering when src is provided */}
      {src && isVideo ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : null}

      {src && !isVideo ? (
        <Image
          src={src}
          alt={alt || label}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : null}

      {/* Top-left Technical Tag Pill */}
      {tag && (
        <div className="pointer-events-none absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[11px] font-semibold tracking-tight text-[#1D1D1F] shadow-sm backdrop-blur-md">
            {isVideo && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#0071E3]" aria-hidden="true" />
            )}
            [ {tag.replace(/^\[\s*|\s*\]$/g, '')} ]
          </span>
        </div>
      )}

      {/* Top-right Resolution / Format Spec Micro-Indicator */}
      {!src && (
        <div className="pointer-events-none absolute top-3.5 right-3.5 z-10">
          <span className="inline-flex items-center rounded-md border border-[#D2D2D7]/80 bg-white/70 px-2 py-0.5 font-mono text-[10px] font-medium text-[#86868B] backdrop-blur-sm">
            {isVideo ? 'VIDEO' : 'FOTO'} • {aspectRatio}
          </span>
        </div>
      )}

      {/* Center Frosted Glass Badge (shown when no src or as video overlay before interaction) */}
      {!src && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
          <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:bg-white/95 group-hover:shadow-md">
            {/* Minimalist Play or Camera Aperture Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1D1D1F] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#0071E3]">
              {isVideo ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-0.5"
                  aria-hidden="true"
                >
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
              )}
            </div>

            <p className="text-xs sm:text-[13px] font-medium leading-snug tracking-tight text-[#1D1D1F]">
              [ {label.replace(/^\[\s*|\s*\]$/g, '')} ]
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
