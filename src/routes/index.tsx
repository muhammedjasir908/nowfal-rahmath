import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Users,
  Mail,
  Volume2,
  VolumeX,
  Navigation,
  Sparkles,
  Play,
  Pause,
  CalendarPlus,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { FloatingPetals, OrnateFlower, CornerBloom } from "@/components/decorations";

export const Route = createFileRoute("/")({
  component: Invitation,
});

const WEDDING_DATE = new Date("2026-08-16T11:30:00+05:30");
// Arabic wedding bgm (Place your audio file as public/bgm.mp3)
const WEDDING_BGM = "/bgm.mp3";

const VENUE_QUERY = encodeURIComponent(
  "Kallivayalil Pappan Memorial Public School Auditorium, Mundakayam East, Idukki, Kerala",
);
const HOME_QUERY = encodeURIComponent("Vennikulam, Pathanamthitta, Kerala");
const VENUE_LINK = `https://www.google.com/maps/search/?api=1&query=${VENUE_QUERY}`;
const HOME_LINK = `https://www.google.com/maps/search/?api=1&query=${HOME_QUERY}`;

const SHARE_MESSAGE = `🌙✨ You're warmly invited!

Nowfal & Rahmath Niza are tying the knot 💚
📅 Sunday, 16 August 2026 · 11:30 AM
📍 Kallivayalil Pappan Memorial Auditorium, Mundakayam East, Idukki

With the blessings of Allah, we'd love your presence and duas.
Open the invitation:`;

/* ---------------- Hooks ---------------- */

function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ---------------- Small components ---------------- */

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative mx-auto w-full max-w-5xl px-5 py-14 md:py-20 ${className}`}>
      <Reveal>{children}</Reveal>
    </section>
  );
}

function Countdown() {
  const t = useCountdown(WEDDING_DATE);
  const items = [
    { l: "Days", v: t.d },
    { l: "Hours", v: t.h },
    { l: "Minutes", v: t.m },
    { l: "Seconds", v: t.s },
  ];
  return (
    <div className="grid grid-cols-4 gap-3 md:gap-6">
      {items.map((i) => (
        <div key={i.l} className="rounded-2xl border border-gold/20 bg-card/70 px-2 py-4 text-center backdrop-blur-sm shadow-card-soft transition-transform hover:-translate-y-1 md:px-4 md:py-6">
          <div className="font-display text-3xl font-light text-emerald-deep md:text-5xl">
            {i.v.toString().padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">{i.l}</div>
        </div>
      ))}
    </div>
  );
}

function DetailCard({ icon: Icon, label, children }: { icon: typeof Calendar; label: string; children: ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gold/20 gradient-card p-6 text-center shadow-card-soft transition-all hover:-translate-y-1 hover:shadow-elegant md:p-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-deep/10 text-emerald-deep transition-all group-hover:bg-emerald-deep group-hover:text-primary-foreground group-hover:rotate-6">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <div className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">{label}</div>
      <div className="font-display text-emerald-deep">{children}</div>
    </div>
  );
}

/* ---------------- Audio player ---------------- */

function AudioPlayer({
  audio,
  playing,
  muted,
  onTogglePlay,
  onToggleMute,
}: {
  audio: HTMLAudioElement | null;
  playing: boolean;
  muted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!audio) return;
    const onTime = () => {
      setCurrent(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(audio.duration || 0);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audio]);

  const fmt = (s: number) => {
    if (!isFinite(s) || s <= 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-gold/30 bg-card/95 px-3 py-2 shadow-elegant backdrop-blur-md md:bottom-6 md:right-6 md:gap-3 md:px-4 md:py-3">
      <button
        onClick={onTogglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-emerald text-primary-foreground transition-transform hover:scale-110 md:h-10 md:w-10"
      >
        {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />}
      </button>

      <div className="flex min-w-[110px] flex-col gap-1 md:min-w-[140px]">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-muted-foreground">
          <span className="text-gold">Nasheed</span>
          <span>{fmt(current)} / {fmt(duration)}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-emerald-deep/10">
          <div className="h-full gradient-gold transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button
        onClick={onToggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-emerald-deep transition-all hover:bg-gold/10 md:h-10 md:w-10"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 animate-shimmer" />}
      </button>
    </div>
  );
}

/* ---------------- Calendar + share helpers ---------------- */

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function toIcsDate(d: Date) {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function downloadInvite() {
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const desc = `With the blessings of Allah, join us as Nowfal & Rahmath Niza begin their journey of faith, love & forever.\\n\\nInvitation: ${url}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nowfal & Rahmath Niza//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@nowfal-rahmath.wedding`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    "SUMMARY:Nowfal & Rahmath Niza — Wedding",
    `DESCRIPTION:${desc}`,
    "LOCATION:Kallivayalil Pappan Memorial Public School Auditorium\\, Mundakayam East P.O\\, Idukki",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Nowfal-Rahmath-Niza-Wedding.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function LocationCard({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-gold/20 gradient-card p-8 text-center shadow-card-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-deep/10 text-emerald-deep transition-all group-hover:bg-emerald-deep group-hover:text-primary-foreground">
        <span className="pointer-events-none absolute inset-0 rounded-full border border-gold/40 animate-pulse-ring" />
        <MapPin className="h-9 w-9" strokeWidth={1.4} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{title}</p>
        <p className="mt-2 font-display text-lg leading-snug text-emerald-deep">{subtitle}</p>
      </div>
      <span className="mt-1 inline-flex items-center gap-2 rounded-full gradient-emerald px-4 py-2 text-xs uppercase tracking-wider text-primary-foreground shadow-card-soft transition-transform group-hover:scale-105">
        <Navigation className="h-3.5 w-3.5" />
        Open in Maps
      </span>
    </a>
  );
}

function ActionsRow() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${SHARE_MESSAGE}\n${url}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Nowfal & Rahmath Niza — Wedding Invitation",
          text: SHARE_MESSAGE,
          url,
        });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        onClick={downloadInvite}
        className="group flex items-center justify-center gap-3 rounded-2xl border border-gold/30 gradient-card px-6 py-5 text-emerald-deep shadow-card-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
      >
        <CalendarPlus className="h-6 w-6 text-gold transition-transform group-hover:rotate-6" strokeWidth={1.5} />
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Save the Date</p>
          <p className="font-display text-lg">Add to Calendar</p>
        </div>
      </button>

      <button
        onClick={share}
        className="group flex items-center justify-center gap-3 rounded-2xl gradient-emerald px-6 py-5 text-primary-foreground shadow-card-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
      >
        {copied ? (
          <>
            <Check className="h-6 w-6 text-gold" />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Copied</p>
              <p className="font-display text-lg">Message ready to paste</p>
            </div>
          </>
        ) : (
          <>
            <Share2 className="h-6 w-6 text-gold transition-transform group-hover:-rotate-6" strokeWidth={1.5} />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Spread the joy</p>
              <p className="font-display text-lg">Share Invitation</p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

/* ---------------- Invitation letter card ---------------- */

function InvitationCard() {

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative overflow-hidden rounded-[1.25rem] bg-card p-2 shadow-elegant animate-bloom">
        <div className="relative overflow-hidden rounded-[1rem] border border-gold/50 min-h-[700px] flex flex-col">
          <img src="/couple-bg.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom" />
          
          <div className="relative px-6 pt-8 pb-4 md:px-10 md:pt-10 flex-1 flex flex-col justify-start">
            <OrnateFlower className="pointer-events-none absolute -top-3 -left-3 opacity-70 hover-sway animate-spin-slow" size={40} />
            <OrnateFlower className="pointer-events-none absolute -top-3 -right-3 opacity-70 hover-sway animate-spin-slow" size={40} />
            
            <div className="text-center">
              <p className="font-arabic text-2xl leading-loose text-emerald-deep md:text-3xl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="mt-1 text-[12px] italic text-emerald-deep/80">
                With the blessings of Almighty Allah
              </p>

              <div className="mx-auto my-4 h-px w-24 bg-gold/40" />

              <h2 className="mt-4 font-display text-xl font-semibold text-emerald-deep md:text-2xl hover-title">
                Wedding Invitation
              </h2>

              <div className="mt-4">
                <p className="font-script text-4xl leading-tight text-emerald-deep md:text-5xl">Nowfal</p>
                <p className="my-1 font-script text-2xl text-gold md:text-3xl">&amp;</p>
                <p className="font-script text-4xl leading-tight text-emerald-deep md:text-5xl">Rahmath Niza</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ---------------- Splash ---------------- */

function Splash({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background animate-fade-in">
      <img src="/couple-bg.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 md:opacity-20 blur-sm" />
      <FloatingPetals />
      <OrnateFlower className="absolute left-6 top-6 hover-sway animate-spin-slow" size={80} />
      <OrnateFlower className="absolute bottom-6 right-6 hover-sway animate-spin-slow" size={80} />
      <div className="relative flex flex-col items-center px-6 text-center animate-bloom">
        <div className="mb-6 h-px w-24 gradient-gold" />
        <p className="font-arabic text-3xl text-emerald-deep animate-shimmer">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 className="mt-8 font-display text-5xl font-light tracking-wide text-emerald-deep md:text-6xl hover-title">
          Nowfal <span className="font-script text-gold text-4xl md:text-5xl">&amp;</span> Rahmath Niza
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.4em] text-muted-foreground">Wedding Invitation</p>
        <button
          onClick={onEnter}
          className="group relative mt-10 flex items-center gap-3 rounded-full border border-gold/40 bg-transparent px-8 py-3 text-sm uppercase tracking-[0.3em] text-emerald-deep transition-all hover:bg-gold hover:text-primary-foreground hover:shadow-gold-glow"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border border-gold/40 animate-pulse-ring" />
          Open Invitation
          <Heart className="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" />
        </button>
        <div className="mt-6 h-px w-24 gradient-gold" />
      </div>
    </div>
  );
}

/* ---------------- Main ---------------- */

function Invitation() {
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio(WEDDING_BGM);
    a.loop = true;
    a.volume = 0.45;
    audioRef.current = a;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  const enter = () => {
    setEntered(true);
    const a = audioRef.current;
    if (a) a.play().catch(() => {});
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient decor */}
      <CornerBloom className="pointer-events-none fixed top-0 left-0 h-48 w-48 md:h-64 md:w-64 opacity-60" />
      <CornerBloom className="pointer-events-none fixed bottom-0 right-0 h-48 w-48 md:h-64 md:w-64 rotate-180 opacity-60" />

      {entered && <FloatingPetals />}
      {!entered && <Splash onEnter={enter} />}

      <AudioPlayer
        audio={audioRef.current}
        playing={playing}
        muted={muted}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
      />

      {/* HERO — invitation letter replaces the mosque image */}
      <section className="relative mx-auto w-full max-w-5xl px-5 pt-16 md:pt-24">
        <Reveal>
          <InvitationCard />
        </Reveal>

        <Reveal delay={200}>
          <div className="relative mx-auto mt-16 max-w-xl rounded-3xl gradient-emerald p-8 text-center text-primary-foreground shadow-elegant">
            <OrnateFlower className="absolute -top-6 left-1/2 -translate-x-1/2 hover-sway animate-spin-slow" size={54} />
            <div className="mb-3 mt-4 font-display text-5xl text-gold">&ldquo;</div>
            <p className="font-display text-2xl italic leading-relaxed md:text-3xl">
              And We created you in pairs.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-gold">Quran 78:8</p>
            <Sparkles className="absolute right-4 top-4 h-4 w-4 text-gold animate-sparkle" />
            <Sparkles className="absolute bottom-4 left-4 h-4 w-4 text-gold animate-sparkle" style={{ animationDelay: "1s" }} />
          </div>
        </Reveal>
      </section>

      {/* COUNTDOWN */}
      <Section className="py-10">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Counting the moments</p>
          <h2 className="mt-2 font-display text-3xl text-emerald-deep md:text-4xl hover-title">Until we say Qubool Hai</h2>
          <div className="mt-4 flex justify-center"><OrnateFlower className="hover-sway animate-spin-slow" size={40} /></div>
        </div>
        <Countdown />
      </Section>

      {/* DETAILS */}
      <Section>
        <div className="mb-10 flex flex-col items-center text-center">
          <OrnateFlower className="hover-sway animate-spin-slow" size={50} />
          <div className="divider-ornament my-4"><Heart className="h-3 w-3" fill="currentColor" /></div>
          <h2 className="font-display text-4xl font-light text-emerald-deep md:text-5xl hover-title">Wedding Details</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <DetailCard icon={Calendar} label="Date">
            <div className="text-5xl font-light">16</div>
            <div className="mt-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">August 2026</div>
            <div className="mt-1 text-xs uppercase tracking-[0.3em] text-gold">Sunday</div>
          </DetailCard>
          <DetailCard icon={Clock} label="Time">
            <div className="text-4xl font-light">11:30 AM</div>
            <div className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Onwards</div>
          </DetailCard>
          <DetailCard icon={MapPin} label="Venue">
            <div className="text-lg leading-snug">Kallivayalil Pappan Memorial Public School Auditorium</div>
            <div className="mt-2 text-xs text-muted-foreground">Mundakayam East P.O, Idukki</div>
          </DetailCard>
        </div>
      </Section>

      {/* PARENTS */}
      <Section>
        <div className="mb-10 flex flex-col items-center text-center">
          <OrnateFlower className="hover-sway animate-spin-slow" size={50} />
          <div className="divider-ornament my-4"><Heart className="h-3 w-3" fill="currentColor" /></div>
          <h2 className="font-display text-4xl font-light text-emerald-deep md:text-5xl hover-title">With Love &amp; Blessings</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Our Beloved Parents", a: "Mr. Mohammed Sali", b: "Mrs. Shahina Sali" },
            { title: "Her Beloved Parents", a: "Mr. Abdul Rahim", b: "Mrs. Beena Rahim" },
          ].map((p) => (
            <div key={p.title} className="rounded-3xl border border-gold/20 gradient-card p-8 text-center shadow-card-soft transition-transform hover:-translate-y-1">
              <Users className="mx-auto mb-4 h-8 w-8 text-gold" strokeWidth={1.5} />
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{p.title}</p>
              <p className="mt-4 font-display text-2xl text-emerald-deep">{p.a}</p>
              <p className="mt-1 font-display text-2xl text-emerald-deep">{p.b}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-gold/20 gradient-card p-8 text-center shadow-card-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">With Love &amp; Compliments</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-display text-xl text-emerald-deep">
            {["Zayan Mon", "Nizam Mon", "Rameez", "Anas", "Muhezina"].map((n, i, arr) => (
              <span key={n} className="flex items-center gap-6">
                {n}
                {i < arr.length - 1 && <span className="text-gold">•</span>}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* LOCATIONS */}
      <Section>
        <div className="mb-10 flex flex-col items-center text-center">
          <OrnateFlower className="hover-sway animate-spin-slow" size={50} />
          <div className="divider-ornament my-4"><Heart className="h-3 w-3" fill="currentColor" /></div>
          <h2 className="font-display text-4xl font-light text-emerald-deep md:text-5xl hover-title">Find Your Way</h2>
          <p className="mt-3 text-sm text-muted-foreground">Tap a location to open in Google Maps</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <LocationCard title="Wedding Auditorium" subtitle="Kallivayalil Pappan Memorial Public School, Mundakayam East" href={VENUE_LINK} />
          <LocationCard title="Our Home" subtitle="Mohammed Sali's Home, Vennikulam, Pathanamthitta" href={HOME_LINK} />
        </div>
      </Section>

      {/* ACTIONS */}
      <Section>
        <div className="mb-8 flex flex-col items-center text-center">
          <OrnateFlower className="hover-sway animate-spin-slow" size={44} />
          <h2 className="mt-4 font-display text-3xl font-light text-emerald-deep md:text-4xl hover-title">Save &amp; Share</h2>
          <p className="mt-2 text-sm text-muted-foreground">Add the date to your calendar or share the invitation with loved ones</p>
        </div>
        <ActionsRow />
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Copy className="h-3 w-3" /> The share message and link copy automatically if your device can't open a share sheet.
        </p>
      </Section>

      {/* CLOSING */}
      <Section className="pb-28">
        <div className="relative overflow-hidden rounded-[2rem] gradient-emerald p-10 text-center text-primary-foreground shadow-elegant md:p-14">
          <img src="/couple-bg.jpg" alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-overlay" />
          <Mail className="mx-auto mb-4 h-10 w-10 text-gold" strokeWidth={1.2} />
          <p className="text-xs uppercase tracking-[0.4em] text-gold">A Warm Invitation</p>
          <p className="mt-6 font-display text-2xl leading-relaxed md:text-3xl">
            We joyfully invite you to be a part of<br />our special day and shower your blessings.
          </p>
          <p className="mt-6 font-script text-3xl text-gold md:text-4xl">Your presence means the world to us</p>
          <p className="mt-6 font-arabic text-xl text-gold/90">جَزَاكُمُ اللَّهُ خَيْرًا</p>
        </div>
        <p className="mt-8 text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Nowfal <span className="text-gold">&amp;</span> Rahmath Niza · 16.08.2026
        </p>
      </Section>
    </main>
  );
}
