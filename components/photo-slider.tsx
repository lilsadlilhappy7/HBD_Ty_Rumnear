'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Photo = { src: string; caption: string }

export function PhotoSlider({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const touchStartX = useRef<number | null>(null)

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + photos.length) % photos.length),
    [photos.length],
  )

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => go(1), 3000)
    return () => clearInterval(id)
  }, [playing, go, index])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Photos of you"
      className="w-full max-w-sm"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1)
        if (e.key === 'ArrowRight') go(1)
      }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-3xl border-8 border-card bg-card shadow-2xl shadow-primary/20"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const dx = e.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          touchStartX.current = null
        }}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${photos.length}`}
            aria-hidden={i !== index}
            className={cn(
              'absolute inset-0 transition-all duration-700 ease-out',
              i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
            )}
          >
            <Image
              src={photo.src || '/placeholder.svg'}
              alt={photo.caption}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-5 pt-16">
              <p className="font-script text-3xl text-primary-foreground">{photo.caption}</p>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 text-primary backdrop-blur transition hover:bg-card"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 text-primary backdrop-blur transition hover:bg-card"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
          className="rounded-full p-1.5 text-primary transition hover:bg-secondary"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <div className="flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'h-2 rounded-full transition-all',
                i === index ? 'w-6 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
