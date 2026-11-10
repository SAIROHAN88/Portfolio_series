import { useEffect, type RefObject } from 'react';

/**
 * Modal focus management.
 *
 * Overlays are `aria-modal` dialogs, so assistive tech expects focus to move
 * inside them and to stay there. Without this:
 *   - focus stays on the trigger behind the overlay, so a screen reader
 *     announces the dialog contents only when the user tabs into them;
 *   - Tab walks out of the overlay into the page behind it.
 *
 * Moves focus to the first focusable element on open and cycles Tab within
 * the dialog. Restoring focus to the trigger is handled centrally in App,
 * which knows when the overlay state changes.
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useDialogFocus(dialogRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Prefer an explicit autofocus target, else the first focusable element.
    const initial =
      dialog.querySelector<HTMLElement>('[data-autofocus]') ??
      dialog.querySelector<HTMLElement>(FOCUSABLE);
    initial?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [dialogRef, active]);
}
