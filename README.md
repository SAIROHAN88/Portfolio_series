# SAI ROHAN — THE SERIES

A cinematic, streaming-inspired portfolio for **Venkata Sai Rohan Pothuganti (Sai Rohan)**: AI/ML Enthusiast, Software Developer, and 2nd-year B.Tech CSE (AI & ML) student at VIT Chennai.
Every section is an episode, every project is an Original, and the whole site plays like a series.

> A personal portfolio with a fictional streaming-platform look. It is not affiliated with Netflix or any other streaming service and uses none of their logos.

## Run it locally

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

The static site is written to `dist/` and is deployed to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to
`main`.

## Deployment

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | `.env` | Public origin, used for absolute social-card URLs. Change it when the domain changes. |
| `VITE_BASE_PATH` | `.env` | Path prefix for the build. `/Portfolio_series/` for GitHub Pages; `/` for a root domain (Vercel, Netlify, custom domain). |

> GitHub Pages serves project sites from a sub-path, so `VITE_BASE_PATH` must
> match the repo name or every asset URL 404s.

To publish to a different host, set `VITE_BASE_PATH=/` and redeploy.

## The resume PDF

`public/assets/Sai_Rohan_Resume.pdf` is **generated**, not hand-written — it is
rendered from the same `ResumeSheet` component the site displays, so the file
can never drift from the content.

```bash
npm run resume
```

This builds the site, renders `resume.html` with headless Chrome and writes the
PDF. It is run automatically in CI, so a deploy always ships a current resume.
Requires Chrome or Edge on `PATH`, or set `CHROME_PATH`.

## Updating the content

**All content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).**

| To change… | Edit |
| --- | --- |
| Name, intro, email, LinkedIn, GitHub | `profile` |
| A project, or a new one | `projects` (add an object; it appears in Originals, the overlay, the resume sheet and the counts) |
| Achievements / certifications | `achievements`, `certifications` |
| Skills and their "where it's used" notes | `skillCategories`, `skillEvidence` |
| Seasons and episodes (My Journey) | `seasons` |
| Top 10 row | `topPicks` |
| ▶ Play Intro highlight reel | `introSlides` |
| Profile order (Recruiter / Developer / Creative) | `viewerProfiles` |
| Opening studio card text | `profile.originalLabel` |

**Resume Export:** three ways to get the resume — download the generated
`Sai_Rohan_Resume.pdf`, print the live sheet from the browser, or open the
full-screen profile in the resume modal.

**Social share image:** the Open Graph card in `public/assets/og-image.jpg` is generated (no personal photos are baked in). To regenerate it after changing the name or tagline:

```bash
npm run images
```

This rebuilds `public/assets/og-image.jpg` via the `sharp` pipeline in `scripts/build-images.mjs`.

## What's inside

```
src/
  data/portfolio.ts        ← single source of truth (from the resume)
  App.tsx                  ← stages: opening → profile select → home; overlays
  components/
    OpeningSequence        ← black → studio card → SAI ROHAN → THE SERIES → monogram → ▶ PLAY
    ProfileSelector        ← "Who's watching?" (changes section order only)
    Navbar                 ← hide-on-scroll nav, profile switcher, mobile menu
    Hero                   ← billboard: parallax monogram, particles, light streaks, floating chips
    PlayIntro              ← ▶ Play Intro: zoom into the monogram → highlight reel (pause, ← →, tap zones)
    ContinueWatching       ← cards with real "watched" progress bars
    About                  ← The Pilot
    Seasons / EpisodeCard  ← My Journey as seasons and episodes
    Originals / ProjectCard← pinned horizontal sequence on desktop, swipe rail on touch
    ProjectModal           ← full-screen project overlay with a shared-element transition
    TopPicks               ← Top 10-style row
    Skills                 ← skill genres; each card shows where the skill appears
    Achievements           ← award-poster cards + certification rail (links to credentials)
    ResumeViewer/ResumeModal ← designed resume sheet, PDF download + print
    FinalCTA               ← TO BE CONTINUED… + contact links
    CustomCursor, fx.tsx   ← cursor states, magnetic buttons, 3D tilt, text reveals, particles
    ErrorBoundary          ← recovers a blank page caused by a stale chunk
  hooks/                   ← Lenis smooth scroll + scroll lock, media queries, watch progress, dialog focus
scripts/build-images.mjs   ← social share image pipeline (sharp)
scripts/build-resume.mjs   ← resume PDF pipeline (headless Chrome)
resume.html               ← print-only entry point for the PDF pipeline
```

**Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion 11, Lenis.

## Accessibility and performance

- `prefers-reduced-motion` is respected: smooth scroll, the custom cursor, tilt, particles, grain and the pinned horizontal scroll turn off, and the opening jumps straight to its final frame.
- Hover effects only run on devices with a precise pointer. Touch devices get tap interactions and native swipe rails.
- The custom cursor appears only with a mouse or trackpad.
- Overlays close with Esc, and the highlight reel supports Space and the ← → keys.
- Overlays are proper dialogs: focus moves inside on open, Tab is trapped, the page behind is `inert`, and focus returns to the trigger on close.
- Both tab lists (skills, seasons) implement the ARIA tabs pattern with arrow-key navigation.
- Lighthouse scores 100 for accessibility, best practices and SEO.
- The resume PDF is generated from the same component the site renders, so it can never drift from the content.
- Overlays are code-split, and particles pause when they're off screen.

## Keyboard shortcuts

- **Opening:** Enter or Esc skips it.
- **Play Intro:** Space pauses, ← and → change slides, Esc closes.
- **Project and resume overlays:** Esc closes.
- **Skill and season tabs:** ← → move between tabs, Home/End jump to the ends.
- **Mobile menu:** Esc closes it.
