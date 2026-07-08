import { useMemo } from "react";

function Petal({ delay, duration, left, size, hue }: { delay: number; duration: number; left: number; size: number; hue: string }) {
  return (
    <svg
      className="absolute top-0 pointer-events-none"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        animation: `petal-fall ${duration}s linear ${delay}s infinite`,
      }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 2C9 6 4 8 4 13a8 8 0 0016 0c0-5-5-7-8-11z"
        fill={hue}
        opacity="0.75"
      />
      <path d="M12 6C11 9 8 10 8 13a4 4 0 008 0c0-3-3-4-4-7z" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

function Sparkle({ top, left, delay, size = 10 }: { top: string; left: string; delay: number; size?: number }) {
  return (
    <svg
      className="absolute pointer-events-none animate-sparkle"
      style={{ top, left, width: size, height: size, animationDelay: `${delay}s` }}
      viewBox="0 0 24 24"
      fill="var(--gold)"
    >
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" />
    </svg>
  );
}

export function FloatingPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 18,
        duration: 12 + Math.random() * 14,
        left: Math.random() * 100,
        size: 14 + Math.random() * 22,
        hue: ["#e91e63", "#d81b60", "#ff4081", "#f06292", "#ad1457"][i % 5],
      })),
    [],
  );
  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        size: 6 + Math.random() * 8,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <Petal key={p.id} {...p} />
      ))}
      {sparkles.map((s) => (
        <Sparkle key={s.id} {...s} />
      ))}
    </div>
  );
}

export function OrnateFlower({ className = "", size = 60 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      style={{ width: size, height: size }}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.7">
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="30"
            rx="8"
            ry="18"
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="6" fill="var(--gold)" opacity="0.6" />
        <circle cx="50" cy="50" r="14" strokeDasharray="2 3" />
      </g>
    </svg>
  );
}

export function CornerBloom({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none">
      <g stroke="var(--gold)" strokeWidth="0.8" fill="none" opacity="0.55">
        <path d="M10 190 Q 60 140 40 90 Q 20 40 80 30" />
        <path d="M10 190 Q 80 160 90 100 Q 100 40 140 20" />
        <circle cx="80" cy="30" r="10" />
        <circle cx="80" cy="30" r="4" fill="var(--gold)" opacity="0.6" />
        <circle cx="140" cy="20" r="8" />
        <circle cx="40" cy="90" r="6" />
        <path d="M60 140 l-6 -3 M60 140 l-3 -6 M90 100 l-6 -3 M90 100 l-3 -6" />
      </g>
    </svg>
  );
}
