'use client'

import { useEffect, useState } from 'react'

export function Typewriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [count, setCount] = useState(0)
  const done = count >= text.length

  useEffect(() => {
    if (done) return
    const id = setTimeout(() => setCount((c) => c + 1), text[count - 1] === '\n' ? speed * 8 : speed)
    return () => clearTimeout(id)
  }, [count, done, speed, text])

  return (
    <>
      <p className="sr-only">{text}</p>
      <p aria-hidden="true" className="whitespace-pre-line text-lg leading-relaxed text-foreground">
        {text.slice(0, count)}
        <span
          className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-primary"
          style={{ animation: 'caret 1s step-end infinite', opacity: done ? 0 : 1 }}
        />
      </p>
    </>
  )
}
