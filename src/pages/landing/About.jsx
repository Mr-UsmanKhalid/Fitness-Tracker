import Reveal from './Reveal';
import { container, sectionSpacing } from './landingUI';

// Facts that are true of the app itself. Edit freely.
const AT_A_GLANCE = [
  { value: '3', label: 'Trackers', note: 'Workouts, nutrition, progress' },
  { value: '3', label: 'Analytics views', note: 'One for each tracker' },
  { value: '2', label: 'Export formats', note: 'CSV and PDF' },
  { value: '3', label: 'Themes', note: 'Light, dark, system' },
];

export default function About() {
  return (
    <section id="about" className={`border-t border-lp-line bg-lp-surface-2 ${sectionSpacing}`}>
      <div className={container}>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-sm font-medium text-lp-accent-text">Our story</p>

          <p className="font-lp-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.01em] text-lp-fg">
            We started FitTrack after one too many training blocks lived across a
            watch app, a notes file and a half-finished spreadsheet.
          </p>

          <p className="mx-auto mt-8 max-w-[60ch] text-base leading-7 text-lp-muted sm:text-[1.0625rem]">
            None of them talked to each other, and none of them told us whether
            the plan was working. So we built the tool we wanted: one place to log
            a session, see how it connects to the last few weeks, and export a
            clear report when someone asks how training is going. No leaderboard
            to game, no streak that punishes a rest day.
          </p>

          <p className="mt-6 text-sm text-lp-faint">— The FitTrack team</p>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-lp-line bg-lp-line lg:grid-cols-4">
            {AT_A_GLANCE.map((item) => (
              <li key={item.label} className="bg-lp-surface p-6 text-center sm:p-8">
                <p className="font-lp-display text-5xl font-medium leading-none text-lp-fg">
                  {item.value}
                </p>
                <p className="mt-3 text-sm font-medium text-lp-fg">{item.label}</p>
                <p className="mt-1 text-xs text-lp-faint">{item.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}