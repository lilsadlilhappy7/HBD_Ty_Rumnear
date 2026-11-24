'use client'

import { useEffect, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

const NOTE_HZ: Record<string, number> = {
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
}

const MELODY: [string, number][] = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
]

const BEAT_SECONDS = 0.55
const LOOP_GAP_BEATS = 2

function playMusicBoxNote(ctx: AudioContext, freq: number, start: number, duration: number) {
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(duration, 0.4) + 0.6)

  for (const [type, mult, level] of [
    ['sine', 1, 1],
    ['triangle', 2, 0.25],
  ] as const) {
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq * mult
    oscGain.gain.value = level
    osc.connect(oscGain).connect(gain)
    osc.start(start)
    osc.stop(start + Math.max(duration, 0.4) + 0.7)
  }
}

export function MusicPlayer({ src, label = 'Happy Birthday' }: { src?: string; label?: string }) {
  const [playing, setPlaying] = useState(false)
  const playingRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setPlayingState = (value: boolean) => {
    playingRef.current = value
    setPlaying(value)
  }

  const sessionRef = useRef(0)

  const stopSynth = () => {
    sessionRef.current++
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    ctxRef.current?.close()
    ctxRef.current = null
  }

  const startSynth = async () => {
    const session = sessionRef.current
    const ctx = new AudioContext()
    if (ctx.state !== 'running') {
      // Browsers keep the context suspended until the user has interacted with the page.
      await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 300))])
    }
    if (ctx.state !== 'running' || session !== sessionRef.current) {
      ctx.close()
      throw new Error(session !== sessionRef.current ? 'Cancelled' : 'Autoplay blocked')
    }
    ctxRef.current = ctx
    const scheduleLoop = () => {
      let t = ctx.currentTime + 0.1
      for (const [note, beats] of MELODY) {
        playMusicBoxNote(ctx, NOTE_HZ[note], t, beats * BEAT_SECONDS)
        t += beats * BEAT_SECONDS
      }
      const loopMs = (t - ctx.currentTime + LOOP_GAP_BEATS * BEAT_SECONDS) * 1000
      timerRef.current = setTimeout(scheduleLoop, loopMs)
    }
    scheduleLoop()
  }

  const play = async () => {
    if (playingRef.current) return
    playingRef.current = true
    try {
      if (src && audioRef.current) await audioRef.current.play()
      else await startSynth()
      setPlayingState(true)
    } catch (error) {
      setPlayingState(false)
      throw error
    }
  }

  const pause = () => {
    if (src) audioRef.current?.pause()
    else stopSynth()
    setPlayingState(false)
  }

  const toggle = () => {
    if (playingRef.current) pause()
    else play().catch(() => {})
  }

  useEffect(() => {
    let cancelled = false
    const events = ['pointerdown', 'keydown', 'touchstart'] as const

    const removeListeners = () => events.forEach((e) => window.removeEventListener(e, onFirstGesture))
    function onFirstGesture(event: Event) {
      removeListeners()
      if (wrapperRef.current?.contains(event.target as Node)) return
      play().catch(() => {})
    }

    play().catch(() => {
      if (!cancelled) events.forEach((e) => window.addEventListener(e, onFirstGesture))
    })

    return () => {
      cancelled = true
      removeListeners()
      audioRef.current?.pause()
      stopSynth()
      playingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapperRef} className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6">
      {src && <audio ref={audioRef} src={src} loop preload="auto" />}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause music' : 'Play music'}
        className={cn(
          'flex items-center gap-3 rounded-full border border-border bg-card/90 py-2 pl-2 pr-4 text-sm font-semibold text-primary shadow-lg shadow-primary/20 backdrop-blur transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          !playing && 'animate-pulse',
        )}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Music className="size-4" aria-hidden="true" />}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-xs font-medium text-muted-foreground">{playing ? 'Now playing' : 'Tap to play'}</span>
          <span>{label}</span>
        </span>
        <span aria-hidden="true" className="flex h-4 items-end gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-primary"
              style={{
                height: playing ? undefined : 4,
                animation: playing ? `equalizer 0.9s ease-in-out ${i * 0.15}s infinite` : undefined,
              }}
            />
          ))}
        </span>
      </button>
    </div>
  )
}
