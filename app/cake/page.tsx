import type { Metadata } from 'next'
import Link from 'next/link'
import { BirthdayCake } from '@/components/birthday-cake'
import { FloatingHearts } from '@/components/floating-hearts'

export const metadata: Metadata = { title: 'Make a Wish | Happy Birthday' }

export default function CakePage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center gap-6 overflow-hidden px-6 py-12">
      <FloatingHearts />
      <header className="relative z-10 text-center">
        <h1 className="font-script text-5xl text-primary sm:text-6xl">Make a wish</h1>
      </header>
      <div className="relative z-10 flex w-full justify-center">
        <BirthdayCake />
      </div>
      <Link href="/" className="relative z-10 text-sm text-muted-foreground underline-offset-4 hover:underline">
        Start over
      </Link>
    </main>
  )
}
