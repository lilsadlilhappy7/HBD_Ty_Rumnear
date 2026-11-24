import { Heart } from 'lucide-react'
import { FloatingHearts } from '@/components/floating-hearts'
import { NextLink } from '@/components/next-link'

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <FloatingHearts />
      <div className="relative z-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-1000">
        <Heart className="size-12 fill-primary text-primary animate-pulse" aria-hidden="true" />
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          To my favorite person
        </p>
        <h1 className="font-script text-6xl leading-tight text-primary text-balance sm:text-8xl">
          Happy Birthday Baby
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
          A little page, a little surprise, and a whole lot of love. I made this just for you, hoping to make your day a little brighter, just as you make my world brighter every day.
        </p>
        <NextLink href="/gallery" className="mt-4">
          Open your surprise
        </NextLink>
      </div>
    </main>
  )
}
