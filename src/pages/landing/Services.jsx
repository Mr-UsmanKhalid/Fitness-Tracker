import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { card, container, focusRing, sectionLead, sectionSpacing, sectionTitle } from './landingUI';

// Edit these to match what you actually offer.
const SERVICES = [
  {
    code: '01',
    title: 'Guided programs',
    body: 'Structured multi-week plans for strength, running or hybrid goals, built from your current numbers instead of a generic template.',
  },
  {
    code: '02',
    title: '1:1 coaching',
    body: 'A human coach reviews your week of data and adjusts the plan directly: same feed, no separate app or spreadsheet handoff.',
    highlight: true,
  },
  {
    code: '03',
    title: 'Nutrition guidance',
    body: 'Daily targets that shift with training load, so a heavy week and a rest week never get the same meal plan.',
  },
  {
    code: '04',
    title: 'Team & corporate plans',
    body: 'Shared dashboards for gyms, running clubs and workplace wellness groups, with one billing account and individual logs.',
  },
];

export default function Services() {
  return (
    <section id="services" className={`border-t border-lp-line ${sectionSpacing}`}>
      <div className={container}>
        <Reveal className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <h2 className={sectionTitle}>Beyond the app: help when you want it.</h2>
          <p className={`mt-5 ${sectionLead}`}>
            Every plan includes the core tracker. These are the services you can
            layer on top when you want more than software.
          </p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {SERVICES.map((service, index) => (
            <Reveal as="li" key={service.code} delay={(index % 2) * 90} className="h-full">
              <div
                className={`${card} flex h-full flex-col p-6 transition-colors duration-300 hover:border-lp-line-strong sm:p-8 ${
                  service.highlight ? 'border-lp-accent-text/30 bg-lp-accent-text/5' : ''
                }`}
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span className="text-sm text-lp-faint">{service.code}</span>
                  {service.highlight && (
                    <span className="rounded-full bg-lp-accent-text/15 px-3 py-1 text-xs font-medium text-lp-accent-text">
                      Most requested
                    </span>
                  )}
                </div>

                <h3 className="mb-3 font-lp-display text-2xl font-medium leading-tight text-lp-fg">
                  {service.title}
                </h3>
                <p className="mb-8 max-w-[46ch] text-[0.95rem] leading-7 text-lp-muted">{service.body}</p>

                <a
                  href="#contact"
                  className={`mt-auto inline-flex w-fit items-center gap-1 rounded-full text-sm font-medium text-lp-fg underline decoration-lp-line-strong underline-offset-[6px] transition-colors duration-300 hover:text-lp-accent-text hover:decoration-lp-accent-text ${focusRing}`}
                >
                  Ask about this <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}