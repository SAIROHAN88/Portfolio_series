import { createRoot } from 'react-dom/client';
import { ResumeSheet } from './components/ResumeViewer';
import './index.css';

/**
 * Print-only entry point. Renders just the resume sheet so headless Chrome
 * can turn it into a downloadable PDF (scripts/build-resume.mjs).
 */
createRoot(document.getElementById('root')!).render(<ResumeSheet />);
