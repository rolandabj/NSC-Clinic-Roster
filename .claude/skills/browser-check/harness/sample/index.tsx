// Test page only: shows the sample of the proposed look with its own styles and font
// (none of the app's styles), for ?view=sample (planner) and ?view=sample-nurse (phone).
// &font=atkinson shows it in Atkinson Hyperlegible Next instead of Inter, to compare.
import type { Root } from 'react-dom/client';
import './sample.css';
import { PlannerSample } from './PlannerSample';
import { NurseSample } from './NurseSample';

const FONTS: Record<string, { family: string; url: string }> = {
  atkinson: {
    family: '"Atkinson Hyperlegible Next"',
    url: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&display=swap',
  },
  inter: { family: '"Inter"', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
};

export function renderSample(root: Root, view: string) {
  const font = FONTS[new URLSearchParams(location.search).get('font') || ''] || FONTS.inter;
  document.documentElement.style.setProperty('--font-sans', `${font.family}, ui-sans-serif, system-ui, sans-serif`);
  for (const [rel, href] of [['preconnect', 'https://fonts.gstatic.com'], ['stylesheet', font.url]]) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (rel === 'preconnect') link.crossOrigin = '';
    document.head.appendChild(link);
  }
  const nurse = view === 'sample-nurse';
  document.title = nurse ? "Mary's shifts · NSC Clinic Roster" : 'November roster · NSC Clinic Roster';
  root.render(nurse ? <NurseSample /> : <PlannerSample />);
}
