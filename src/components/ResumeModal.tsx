import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { useScrollLock } from '../hooks/smoothScroll';
import { EASE } from './fx';
import { ResumeSheet } from './ResumeViewer';

/** Full-screen profile & resume viewer rendering the live React resume sheet. */
export default function ResumeModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      ref={dialogRef}
      className="fixed inset-0 z-[140] flex flex-col bg-black/90 backdrop-blur-md"
      data-resume-modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
    >
      <div className="gutter flex h-16 shrink-0 items-center justify-between gap-3 pt-[env(safe-area-inset-top)]">
        <p className="truncate font-display text-2xl tracking-wide text-bone">The Full Story · {profile.displayName}</p>
        <div className="flex items-center gap-2">
          <a
            href={profile.resumePdf}
            download="Sai_Rohan_Resume.pdf"
            data-cursor="link"
            className="rounded-md border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-bone transition hover:border-white/40 hover:bg-white/20"
          >
            ⤓ Download PDF
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print / Save PDF"
            data-cursor="play"
            className="rounded-md border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-bone transition hover:border-white/40 hover:bg-white/20"
          >
            🖨️ Print / Save PDF
          </button>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-bone px-4 py-2 text-xs font-bold text-ink hover:bg-white transition"
          >
            ↗ Connect on LinkedIn
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resume"
            data-cursor="close"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-bone hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      </div>
      <motion.div
        className="gutter flex-1 pb-6"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div data-lenis-prevent data-resume-scroll className="mx-auto h-full max-w-4xl overflow-y-auto pr-1">
          <ResumeSheet />
        </div>
      </motion.div>
    </motion.div>
  );
}
