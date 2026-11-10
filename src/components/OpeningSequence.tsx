import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE, Magnetic } from './fx';

/**
 * The signature moment:
 * black → studio card → SAI ROHAN → THE SERIES → monogram reveal → role → ▶ PLAY
 */
const TIMELINE = [
  { at: 300, beat: 1 }, // studio card
  { at: 1800, beat: 2 }, // name
  { at: 2500, beat: 3 }, // THE SERIES
  { at: 3100, beat: 4 }, // tagline / role
  { at: 3700, beat: 5 }, // play button
];

export default function OpeningSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotionPref();
  const [beat, setBeat] = useState(reduced ? 5 : 0);

  useEffect(() => {
    if (reduced) return;
    const timers = TIMELINE.map(({ at, beat }) => window.setTimeout(() => setBeat(beat), at));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-[#07070a]"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.9, ease: EASE }}
      role="dialog"
      aria-label="Opening titles"
    >
      {/* letterbox bars */}
      <motion.div className="absolute inset-x-0 top-0 z-30 h-[7vh] bg-black" initial={{ y: 0 }} animate={{ y: beat >= 5 ? '-100%' : 0 }} transition={{ duration: 1.2, ease: EASE }} />
      <motion.div className="absolute inset-x-0 bottom-0 z-30 h-[7vh] bg-black" initial={{ y: 0 }} animate={{ y: beat >= 5 ? '100%' : 0 }} transition={{ duration: 1.2, ease: EASE }} />

      {/* green ambient fill */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-[-1]"
        style={{ background: 'radial-gradient(70% 60% at 50% 50%, rgba(34,197,94,0.2), transparent 75%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 1 ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      />

      {/* projector flicker light */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-[-1]"
        style={{ background: 'radial-gradient(55% 45% at 50% 50%, rgba(34,197,94,0.32), rgba(13,92,46,0.15) 55%, transparent 75%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 2 ? [0, 1, 0.7, 1] : 0 }}
        transition={{ duration: 1.4 }}
      />

      {/* studio card */}
      <AnimatePresence>
        {beat === 1 && (
          <motion.div
            key="studio"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="font-sans text-xs font-semibold text-mist sm:text-sm"
              initial={{ letterSpacing: '0.2em', opacity: 0 }}
              animate={{ letterSpacing: '0.6em', opacity: 1 }}
              transition={{ duration: 1.6, ease: EASE }}
            >
              {profile.originalLabel}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-hidden className="absolute inset-0 z-[1] bg-[radial-gradient(70%_60%_at_50%_50%,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* title & center stack */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          className="font-display max-w-[92vw] whitespace-nowrap leading-[0.9] text-bone drop-shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
          style={{ fontSize: 'clamp(2.6rem, 9vw, 7.5rem)' }}
          initial={{ opacity: 0, scale: 1.2, filter: 'blur(16px)', letterSpacing: '0.2em' }}
          animate={beat >= 2 ? { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0.03em' } : {}}
          transition={{ duration: 1.3, ease: EASE }}
        >
          {profile.firstName}
        </motion.h1>

        <motion.p
          className="mt-2 font-sans text-xs font-bold text-brand [text-shadow:0_2px_20px_rgba(0,0,0,0.9)] sm:text-base"
          initial={{ opacity: 0, letterSpacing: '0.8em' }}
          animate={beat >= 3 ? { opacity: 1, letterSpacing: '0.45em' } : {}}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {profile.seriesTag}
        </motion.p>

        {/* role / credentials */}
        <motion.p
          className="mt-6 font-mono text-[11px] font-medium tracking-[0.25em] text-mist/90 sm:text-xs sm:tracking-[0.35em]"
          initial={{ opacity: 0, y: 12 }}
          animate={beat >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {profile.tagline.join('  •  ')}
        </motion.p>

        {/* play button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={beat >= 5 ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Magnetic>
            <button
              type="button"
              data-cursor="play"
              onClick={onDone}
              tabIndex={beat >= 5 ? 0 : -1}
              className="group flex items-center gap-3 rounded-full bg-bone px-9 py-4 font-sans text-base font-bold tracking-wide text-ink shadow-[0_0_60px_rgba(13,92,46,0.65)] transition hover:bg-white hover:scale-105"
            >
              <span className="text-lg transition-transform group-hover:scale-125">▶</span> PLAY
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="absolute right-4 top-[calc(7vh+12px)] z-40 rounded-full border border-white/20 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.2em] text-mist transition hover:border-white/60 hover:text-bone"
      >
        SKIP INTRO
      </button>
    </motion.div>
  );
}
