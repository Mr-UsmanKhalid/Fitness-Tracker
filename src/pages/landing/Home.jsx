import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import { btnLarge, btnPrimary, btnSecondary, container, eyebrow } from './landingUI';

const WORKOUTS = [
  { name: 'Upper body strength', meta: '5 exercises', tag: 'Strength' },
  { name: 'Morning run', meta: '5.2 km', tag: 'Cardio' },
  { name: 'Mobility flow', meta: '20 min', tag: 'Flexibility' },
];

const MACROS = [
  { label: 'Protein', value: 96, goal: 150 },
  { label: 'Carbs', value: 180, goal: 250 },
  { label: 'Fat', value: 52, goal: 80 },
];

function Sparkline() {
  return (
    <svg
      className="h-14 w-full overflow-visible"
      viewBox="0 0 280 64"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="fill-lp-accent-text/10"
        d="M0,12 L30,16 L60,14 L90,26 L120,24 L150,34 L180,32 L210,44 L240,42 L280,52 L280,64 L0,64 Z"
      />
      <path
        className="animate-lp-draw fill-none stroke-lp-accent-text stroke-2 [stroke-dasharray:400] [stroke-dashoffset:400] motion-reduce:animate-none motion-reduce:[stroke-dashoffset:0]"
        d="M0,12 L30,16 L60,14 L90,26 L120,24 L150,34 L180,32 L210,44 L240,42 L280,52"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PreviewCard({ title, children }) {
  return (
    <div className="rounded-xl border border-lp-line bg-lp-surface p-4 sm:p-5">
      <p className="mb-4 text-xs font-medium text-lp-faint">{title}</p>
      {children}
    </div>
  );
}

function AppPreview() {
  return (
    <div className="rounded-2xl border border-lp-line bg-lp-surface-2 p-2 shadow-2xl shadow-black/10 sm:p-3">
      {/* Window bar */}
      <div className="flex items-center gap-1.5 px-3 pb-2 pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-lp-fg/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-lp-fg/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-lp-fg/15" />
        <span className="ml-3 text-xs text-lp-faint">FitTrack · Dashboard</span>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-lp-bg p-3 sm:p-4 md:grid-cols-3">
        {/* Recent workouts */}
        <PreviewCard title="Recent workouts">
          <ul className="space-y-3">
            {WORKOUTS.map((workout) => (
              <li key={workout.name} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-lp-fg">{workout.name}</p>
                  <p className="text-xs text-lp-faint">{workout.meta}</p>
                </div>
                <span className="shrink-0 rounded-full bg-lp-accent-text/10 px-2.5 py-0.5 text-[11px] font-medium text-lp-accent-text">
                  {workout.tag}
                </span>
              </li>
            ))}
          </ul>
        </PreviewCard>

        {/* Calories */}
        <PreviewCard title="Nutrition today">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="10" className="stroke-lp-fg/10" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="74 100"
                  className="stroke-lp-accent-text"
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-lp-fg">
                74%
              </span>
            </div>
            <div>
              <p className="font-lp-display text-2xl leading-none text-lp-fg">1,840</p>
              <p className="mt-1 text-xs text-lp-faint">of 2,500 kcal</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {MACROS.map((macro) => (
              <div key={macro.label}>
                <div className="mb-1 flex justify-between text-[11px] text-lp-faint">
                  <span>{macro.label}</span>
                  <span>
                    {macro.value} / {macro.goal} g
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-lp-fg/10">
                  <div
                    className="h-full rounded-full bg-lp-accent-text"
                    style={{ width: `${(macro.value / macro.goal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </PreviewCard>

        {/* Weight */}
        <PreviewCard title="Weight trend">
          <p className="font-lp-display text-3xl leading-none text-lp-fg">
            −2.4 <span className="text-base text-lp-faint">kg</span>
          </p>
          <p className="mt-1 text-xs text-lp-faint">since your first entry</p>
          <div className="mt-6">
            <Sparkline />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-lp-faint">
            <span>Week 1</span>
            <span>Week 8</span>
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

export default function Hero() {
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.name?.trim().split(' ')[0];

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Very soft tint at the top; no glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--lp-accent)_9%,transparent),transparent)]"
      />

      <div className={`${container} relative pb-20 pt-16 sm:pb-24 sm:pt-24 lg:pt-28`}>
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className={eyebrow}>
            <span className="h-1.5 w-1.5 rounded-full bg-lp-accent-text" />
            {user
              ? `Welcome back${firstName ? `, ${firstName}` : ''}`
              : 'Workouts, nutrition and progress in one place'}
          </span>

          <h1 className="mx-auto mt-7 max-w-[16ch] font-lp-display text-[clamp(2.6rem,7vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.025em] text-lp-fg">
            {user ? (
              <>
                Keep pushing. Keep <span className="italic text-lp-accent-text">progressing</span>.
              </>
            ) : (
              <>
                Train with <span className="italic text-lp-accent-text">data</span>, not guesswork.
              </>
            )}
          </h1>

          <p className="mx-auto mt-6 max-w-[54ch] text-lg leading-8 text-lp-muted">
            {user
              ? "Log today's session, check how your week is trending and stay on top of your goals."
              : 'FitTrack helps you log workouts and meals, follow your progress and stay consistent with your fitness goals.'}
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link to={user ? '/dashboard' : '/register'} className={`${btnPrimary} ${btnLarge}`}>
              {user ? 'Go to dashboard' : 'Get started free'} <ArrowRight size={17} />
            </Link>
            <a href="#features" className={`${btnSecondary} ${btnLarge}`}>
              {user ? 'Explore features' : 'See how it works'}
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-16 max-w-[980px] sm:mt-20">
          <AppPreview />
          <p className="mt-4 text-center text-xs text-lp-faint">Preview with sample data</p>
        </Reveal>
      </div>
    </section>
  );
}