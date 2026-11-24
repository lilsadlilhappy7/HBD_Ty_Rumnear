import { Heart } from 'lucide-react'

const HEARTS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 14 + ((i * 7) % 18),
  delay: (i * 1.3) % 12,
  duration: 10 + ((i * 3) % 8),
}))

export function FloatingHearts() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {HEARTS.map((h, i) => (
        <Heart
          key={i}
          className="absolute -bottom-10 fill-primary/30 text-primary/30"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            animation: `float-up ${h.duration}s linear ${h.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
