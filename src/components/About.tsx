import { motion } from 'framer-motion';
import { education, profile } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';

export default function About() {
  const facts = [
    { k: 'Now', v: 'B.Tech, AI & ML', s: `${education[0].school} · ${education[0].score}` },
    { k: 'Focus', v: 'AI/ML & Software', s: 'Algorithms · Multi-Agent Systems' },
    { k: 'Primary languages', v: 'Python & C++', s: 'with C & Data Structures' },
    { k: 'Based in', v: profile.location, s: 'VIT Chennai' },
  ];

  return (
    <>
      <SectionHeading kicker="The Pilot" title="About Me" />
      <div className="gutter grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <motion.div
          className="mx-auto w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.2, ease: EASE }}
        >
        <Tilt max={6} className="rounded-2xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 bg-[#0c0d12] shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
            {/* background gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_25%,rgba(34,197,94,0.3),rgba(13,92,46,0.15)_55%,#07070a)]" />
            <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_28px)]" />

            {/* card top header */}
            <div className="absolute left-6 right-6 top-6 flex items-center justify-between font-mono text-[10px] text-mist/80">
              <span className="flex items-center gap-1.5 font-bold tracking-[0.2em] text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> ORIGINAL SERIES
              </span>
              <span className="rounded border border-white/20 px-2 py-0.5 text-[9px] font-bold text-bone">
                EP. 01 • THE PILOT
              </span>
            </div>

            {/* central emblem badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="relative mb-4 flex h-32 w-32 items-center justify-center rounded-3xl border border-white/15 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md">
                <span className="font-display text-6xl font-bold tracking-tight text-bone drop-shadow-[0_4px_20px_rgba(34,197,94,0.45)]">
                  SR
                </span>
                <div className="absolute -bottom-2 rounded-full border border-brand/40 bg-[#07070a] px-2.5 py-0.5 font-mono text-[9px] font-semibold text-brand shadow">
                  PROTAGONIST
                </div>
              </div>
              <p className="mt-2 font-display text-2xl tracking-wide text-bone">
                {profile.displayName}
              </p>
              <p className="mt-1 text-xs font-semibold text-brand tracking-widest uppercase">
                {profile.role}
              </p>
              <p className="mt-2 font-mono text-[11px] text-mist">
                VIT Chennai • B.Tech CSE (AI & ML)
              </p>
            </div>

            {/* card bottom footer */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-brand">STARRING</p>
                <p className="font-display text-2xl leading-none text-bone">{profile.displayName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-400">99% MATCH</span>
                <span className="rounded border border-white/30 px-1.5 text-[10px] font-bold text-bone">S01–S03</span>
              </div>
            </div>
          </div>
        </Tilt>
        </motion.div>

        <div>
          <motion.p
            className="font-serif text-[clamp(1rem,1.6vw,1.35rem)] italic leading-[1.6] text-bone"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          >
            “{profile.bio}”
          </motion.p>
          <p className="mt-4 text-sm text-mist">— {profile.fullName}</p>

          <motion.dl
            className="mt-10 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.08 }}
          >
            {facts.map((f) => (
              <motion.div
                key={f.k}
                className="bg-ink-2 p-5"
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              >
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">{f.k}</dt>
                <dd className="mt-2 text-base font-semibold text-bone">{f.v}</dd>
                <dd className="mt-0.5 text-xs text-mist">{f.s}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <div className="mt-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="glass rounded-full px-3 py-1.5 text-xs font-medium text-bone">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
