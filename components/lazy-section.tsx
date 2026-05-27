"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"

interface LazySectionProps {
  children: ReactNode
  rootMargin?: string
  threshold?: number
  placeholder?: ReactNode
  once?: boolean
}

export function LazySection({
  children,
  rootMargin = "200px 0px",
  threshold = 0,
  placeholder,
  once = true,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if ("IntersectionObserver" in window === false) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return (
    <div ref={ref} className="contents">
      {visible ? (
        children
      ) : (
        placeholder || (
          <div className="min-h-[100px] bg-transparent" />
        )
      )}
    </div>
  )
}
