import type { Metadata } from 'next'
import { FloatingHearts } from '@/components/floating-hearts'
import { MusicPlayer } from '@/components/music-player'
import { NextLink } from '@/components/next-link'
import { PhotoSlider, type Photo } from '@/components/photo-slider'

export const metadata: Metadata = { title: 'Loved Beyond Measure | Happy Birthday' }

const PHOTOS: Photo[] = [
  { src: '/images/ph-1.jpg', caption: 'Pure perfection' },
  { src: '/images/ph-2.jpg', caption: 'Peace & cute vibes' },
  { src: '/images/ph-3.jpg', caption: 'Serving looks' },
  { src: '/images/ph-4.jpg', caption: 'Like mother, like daughter' },
  { src: '/images/ph-5.jpg', caption: 'Warm hearts & sweet roots' },
  { src: '/images/ph-6.jpg', caption: 'Grandpa’s favorite girl' },
  { src: '/images/ph-7.jpg', caption: 'Born to shine' },
  { src: '/images/ph-8.jpg', caption: 'Cutest passenger' },
  { src: '/images/ph-9.jpg', caption: 'Late night rides with mommy' },
  { src: '/images/ph-10.jpg', caption: 'Prettiest girl in the room' },
]

export default function GalleryPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-6 py-12">
      <FloatingHearts />
      <MusicPlayer />
      <header className="relative z-10 text-center">
        <h1 className="font-script text-5xl text-primary sm:text-6xl">Loved Beyond Measure</h1>
        <p className="mt-2 text-muted-foreground">Swipe through to see the beautiful smiles and memories</p>
      </header>
      <div className="relative z-10 flex w-full justify-center">
        <PhotoSlider photos={PHOTOS} />
      </div>
      <NextLink href="/cake" className="relative z-10">
        {"There's one more thing"}
      </NextLink>
    </main>
  )
}
