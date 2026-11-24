'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Confetti } from '@/components/confetti'
import { Typewriter } from '@/components/typewriter'

const AGE = 17

const WISH = `Happy 17th Birthday, my love!

Thank you for every smile, every laugh, and every beautiful moment we share. You make my world a little brighter just by being in it.

I wish you endless happiness, dreams that come true, and all the love your heart deserves.

No matter what life brings, I'll always be here for you, cheering you on and choosing you every day.

I love you, today and always.`

function Candle({ lit, onBlow, index }: { lit: boolean; onBlow: () => void; index: number }) {
  const stripe = index % 2 === 0
  return (
    <button
      type="button"
      onClick={onBlow}
      disabled={!lit}
      aria-label={lit ? `Blow out candle ${index + 1}` : `Candle ${index + 1} is out`}
      className="relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default"
    >
      <span className="relative block h-5 w-3">
        {lit ? (
          <span
            className="absolute inset-x-0 bottom-0 mx-auto block h-5 w-3 origin-bottom rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-flame shadow-[0_0_12px_4px_var(--flame)]"
            style={{ animation: `flicker ${0.4 + (index % 4) * 0.1}s ease-in-out infinite` }}
          >
            <span className="absolute inset-x-0 bottom-0.5 mx-auto block h-2.5 w-1.5 rounded-full bg-card/90" />
          </span>
        ) : (
          <span
            className="absolute inset-x-0 bottom-0 mx-auto block size-3 rounded-full bg-muted-foreground/40 blur-[2px]"
            style={{ animation: 'smoke 1.5s ease-out forwards' }}
          />
        )}
      </span>
      <span className="block h-0.5 w-px bg-foreground/60" />
      <span
        className={cn(
          'block h-10 w-2.5 rounded-t-sm',
          stripe
            ? 'bg-[repeating-linear-gradient(45deg,var(--primary)_0_4px,var(--card)_4px_8px)]'
            : 'bg-[repeating-linear-gradient(45deg,var(--accent)_0_4px,var(--card)_4px_8px)]',
        )}
      />
    </button>
  )
}

export function BirthdayCake() {
  const [candles, setCandles] = useState<boolean[]>(() => Array(AGE).fill(true))
  const [listening, setListening] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameRef = useRef<number | null>(null)

  const litCount = candles.filter(Boolean).length
  const allOut = litCount === 0

  const blowOne = (i: number) => setCandles((c) => c.map((lit, j) => (j === i ? false : lit)))

  const blowRandom = (amount: number) =>
    setCandles((c) => {
      const litIdx = c.flatMap((lit, i) => (lit ? [i] : []))
      const toBlow = new Set(litIdx.sort(() => Math.random() - 0.5).slice(0, amount))
      return c.map((lit, i) => (toBlow.has(i) ? false : lit))
    })

  const stopMic = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setListening(false)
  }

  const startMic = async () => {
    setMicError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      setListening(true)
      let last = 0
      const tick = (t: number) => {
        analyser.getByteFrequencyData(data)
        const volume = data.reduce((a, b) => a + b, 0) / data.length
        if (volume > 45 && t - last > 120) {
          last = t
          blowRandom(volume > 80 ? 3 : 1)
        }
        frameRef.current = requestAnimationFrame(tick)
      }
      frameRef.current = requestAnimationFrame(tick)
    } catch {
      setMicError('Microphone not available. Tap the candles instead!')
    }
  }

  useEffect(() => {
    if (allOut) stopMic()
  }, [allOut])

  useEffect(() => stopMic, [])

  const topRow = candles.slice(0, 9)
  const bottomRow = candles.slice(9)

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-8">
      {allOut && <Confetti />}

      <p aria-live="polite" className="text-center text-muted-foreground">
        {allOut
          ? 'Yay! May all your wishes come true!'
          : `Blow out the candles to make your wish!  (${litCount} of ${AGE} lit)`}
      </p>

      <div className="relative flex flex-col items-center pt-4">
        <div className="relative z-10 flex flex-col items-center -mb-6">
          <div className="flex gap-2.5">
            {topRow.map((lit, i) => (
              <Candle key={i} index={i} lit={lit} onBlow={() => blowOne(i)} />
            ))}
          </div>
          <div className="relative z-10 -mt-8 flex gap-2.5">
            {bottomRow.map((lit, i) => (
              <Candle key={i + 9} index={i + 9} lit={lit} onBlow={() => blowOne(i + 9)} />
            ))}
          </div>
        </div>

        <div className="relative mt-4 h-24 w-64 rounded-t-3xl bg-card shadow-inner sm:w-72">
          <div className="absolute inset-x-0 top-0 flex h-6 justify-around overflow-hidden rounded-t-3xl bg-secondary">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="mt-3 block h-6 w-6 rounded-full bg-secondary" />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-6 flex justify-around px-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="block size-2.5 rounded-full bg-primary/70" />
            ))}
          </div>
        </div>
        <div className="relative h-28 w-80 rounded-t-2xl bg-primary sm:w-96">
          <div className="absolute inset-x-0 top-0 h-5 rounded-t-2xl bg-card/90" />
          <div className="flex h-full items-center justify-center pt-4">
            <span className="font-script text-5xl text-primary-foreground">{AGE}</span>
          </div>
        </div>
        <div className="h-4 w-[26rem] max-w-[90vw] rounded-full bg-muted-foreground/30" />
      </div>

      {!allOut && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={listening ? stopMic : startMic}
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            {listening ? <MicOff className="size-4" aria-hidden="true" /> : <Mic className="size-4" aria-hidden="true" />}
            {listening ? 'Stop listening' : 'Blow into the mic'}
          </button>
          <button
            type="button"
            onClick={() => setCandles(Array(AGE).fill(false))}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105"
          >
            <Wind className="size-4" aria-hidden="true" />
            Blow them all
          </button>
        </div>
      )}
      {micError && <p className="text-sm text-primary">{micError}</p>}

      {allOut && (
        <article className="w-full rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-6 duration-700 sm:p-8">
          <h2 className="mb-4 font-script text-4xl text-primary">A wish for you</h2>
          <Typewriter text={WISH} />
        </article>
      )}
    </div>
  )
}
