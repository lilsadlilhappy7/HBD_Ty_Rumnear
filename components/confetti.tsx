const COLORS = ['var(--primary)', 'var(--accent)', 'var(--secondary)', 'var(--flame)']

const PIECES = Array.from({ length: 60 }, (_, i) => ({
  left: (i * 17) % 100,
  delay: ((i * 0.13) % 2).toFixed(2),
  duration: 3 + ((i * 7) % 4),
  color: COLORS[i % COLORS.length],
  size: 6 + (i % 6),
}))

export function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="absolute -top-4 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
