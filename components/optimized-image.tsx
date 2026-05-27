"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
}

const BASE_PATH = "/images"

const AVIF_SIZES: Record<string, { w: number; h: number }> = {
  "carousel-1": { w: 600, h: 600 },
  "carousel-2": { w: 600, h: 600 },
  "carousel-3": { w: 600, h: 600 },
  "carousel-4": { w: 600, h: 600 },
  "logo-uajs-vertical": { w: 200, h: 200 },
  "logo-uajs-horizontal": { w: 400, h: 120 },
  "lectura-critica-info": { w: 600, h: 400 },
  "reading-levels": { w: 600, h: 400 },
  "uajs-footer": { w: 400, h: 100 },
}

function getImageName(src: string): string {
  const match = src.match(/\/([\w-]+)\.(png|jpg|jpeg)$/)
  return match ? match[1] : "fallback"
}

function hasWebpVersion(name: string): boolean {
  return !!AVIF_SIZES[name]
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  width,
  height,
  sizes,
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const name = getImageName(src)
  const dims = AVIF_SIZES[name]

  if (error) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? undefined : "lazy"}
        fetchpriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        width={width || dims?.w}
        height={height || dims?.h}
      />
    )
  }

  const imgWidth = width || dims?.w || 600
  const imgHeight = height || dims?.h || 400

  // 1x and 2x versions for WebP
  const webp1x = hasWebpVersion(name) ? `${BASE_PATH}/${name}.webp` : null
  const webp2x = hasWebpVersion(name) ? `${BASE_PATH}/${name}@2x.webp` : null
  const avif1x = hasWebpVersion(name) ? `${BASE_PATH}/${name}.avif` : null
  const avif2x = hasWebpVersion(name) ? `${BASE_PATH}/${name}@2x.avif` : null
  const fallbackSrc = src.startsWith("/") ? src : `${BASE_PATH}/${src}`

  const imgClasses = cn(
    fill ? "absolute inset-0 w-full h-full object-cover" : "",
    className,
  )

  return (
    <picture>
      {/* AVIF 2x for high-DPI screens */}
      {avif2x && <source srcSet={avif2x} media="(-webkit-min-device-pixel-ratio: 2) and (min-width: 768px)" type="image/avif" />}
      {/* AVIF 1x for standard screens */}
      {avif1x && <source srcSet={avif1x} type="image/avif" />}
      {/* WebP 2x for high-DPI */}
      {webp2x && <source srcSet={webp2x} media="(-webkit-min-device-pixel-ratio: 2) and (min-width: 768px)" type="image/webp" />}
      {/* WebP 1x standard */}
      {webp1x && <source srcSet={webp1x} type="image/webp" />}
      {/* Mobile: smaller WebP */}
      {webp1x && dims && (
        <source
          srcSet={webp1x}
          media="(max-width: 639px)"
          type="image/webp"
        />
      )}
      {/* Fallback to original */}
      <img
        src={fallbackSrc}
        alt={alt}
        className={imgClasses}
        loading={priority ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        width={fill ? undefined : imgWidth}
        height={fill ? undefined : imgHeight}
        onError={() => setError(true)}
        sizes={
          sizes ||
          (fill ? "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 600px" : undefined)
        }
      />
    </picture>
  )
}
