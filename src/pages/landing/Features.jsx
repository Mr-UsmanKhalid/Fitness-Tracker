import { BarChart3, Bell, Dumbbell, FileBarChart, TrendingUp, Utensils } from 'lucide-react';
import Reveal from './Reveal';
import { card, container, sectionLead, sectionSpacing, sectionTitle } from './landingUI';

// `span` is the column span on large screens (the grid has 6 columns).
const FEATURES = [
  {
    title: 'Log a workout in seconds',
    body: 'Add exercises, sets, reps and weight in one quick form, then edit or repeat a session whenever you need to.',
    icon: Dumbbell,
    span: 'lg:col-span-3',
    chips: ['Sets', 'Reps', 'Weight', 'Notes'],
  },
  {
    title: 'Nutrition and macros',
    body: 'Record meals and foods, see calories, protein, carbs and fat add up, and check the day against your goal.',
    icon: Utensils,
    span: 'lg:col-span-3',
    chips: ['Calories', 'Protein', 'Carbs', 'Fat'],
  },
  {
    title: 'Progress you can see',
    body: 'Track weight, body measurements and personal bests, and watch the trend instead of guessing.',
    icon: TrendingUp,
    span: 'lg:col-span-2',
  },
  {
    title: 'Analytics across everything',
    body: 'Weekly frequency, calorie trends and category breakdowns turn raw logs into a clear picture.',
    icon: BarChart3,
    span: 'lg:col-span-2',
  },
  {
    title: 'Reports you can export',
    body: 'Generate a readable summary for any date range, download it as CSV or print it to PDF.',
    icon: FileBarChart,
    span: 'lg:col-span-2',
  },
  {
    title: 'Notifications that keep you on track',
    body: 'Get alerts about workouts, goals and achievements, then mark them read or clear them from one place.',
    icon: Bell,
    span: 'lg:col-span-6',
  },
];

export default function Features() {
  return (
    <section id="features" className={`border-t border-lp-line ${sectionSpacing}`}>
      <div className={container}>
        <Reveal className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <h2 className={sectionTitle}>Everything you track already, minus the spreadsheet.</h2>
          <p className={`mt-5 ${sectionLead}`}>
            One place for workouts, meals and body progress, with the charts and
            reports to make sense of them.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const wide = feature.span === 'lg:col-span-6';
            return (
              <Reveal
                key={feature.title}
                delay={(index % 3) * 80}
                className={`h-full ${feature.span} ${wide ? 'sm:col-span-2' : ''}`}
              >
                <article
                  className={`${card} group h-full p-6 transition-colors duration-300 hover:border-lp-line-strong sm:p-7 ${
                    wide ? 'sm:flex sm:items-center sm:gap-6' : ''
                  }`}
                >
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lp-accent-text/10 text-lp-accent-text ${
                      wide ? '' : 'mb-5'
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div className={wide ? 'mt-4 sm:mt-0' : ''}>
                    <h3 className="mb-2 font-lp-display text-xl font-medium leading-snug text-lp-fg">
                      {feature.title}
                    </h3>
                    <p className="max-w-[52ch] text-[0.95rem] leading-7 text-lp-muted">{feature.body}</p>

                    {feature.chips && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {feature.chips.map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full border border-lp-line px-3 py-1 text-xs text-lp-muted"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}