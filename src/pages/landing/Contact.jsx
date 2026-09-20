import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, Mail } from 'lucide-react';
import Reveal from './Reveal';
import { btnPrimary, card, container, sectionSpacing, sectionTitle } from './landingUI';

// TODO: replace with your real inbox (same address as pages/Support.jsx)
const CONTACT_EMAIL = 'support@fittrack.app';

const fieldClass =
  'w-full rounded-xl border border-lp-line-strong bg-lp-bg px-4 py-3 text-sm text-lp-fg outline-none transition placeholder:text-lp-faint focus:border-lp-accent-text focus:ring-4 focus:ring-lp-accent-text/15';

const labelClass = 'mb-2 block text-sm font-medium text-lp-fg';

const rowClass =
  'group flex items-center gap-4 rounded-xl border border-lp-line bg-lp-surface px-4 py-3.5 text-sm text-lp-fg transition-colors duration-300 hover:border-lp-line-strong';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setSent(false);
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  // No backend endpoint needed: this opens the visitor's email app with the message filled in.
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Message from ${form.name.trim() || 'a visitor'}`;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="contact" className={`border-t border-lp-line bg-lp-surface-2 ${sectionSpacing}`}>
      <div className={`${container} grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20`}>
        <Reveal>
          <h2 className={`max-w-[16ch] ${sectionTitle}`}>Questions before you start training?</h2>

          <p className="mt-6 max-w-[42ch] text-base leading-7 text-lp-muted sm:text-[1.0625rem]">
            Reach out and a real person on the team will get back to you, usually
            within a day.
          </p>

          <ul className="mt-9 space-y-3">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={rowClass}>
                <Mail size={18} className="text-lp-accent-text" aria-hidden="true" />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </li>
            <li>
              <Link to="/support" className={rowClass}>
                <LifeBuoy size={18} className="text-lp-accent-text" aria-hidden="true" />
                <span>Support page (for signed-in members)</span>
              </Link>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className={`${card} p-6 shadow-sm shadow-black/5 sm:p-8`}>
            <div className="space-y-5">
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="What are you trying to do?"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className={`${fieldClass} resize-y leading-6`}
                />
              </div>

              <button type="submit" className={`${btnPrimary} w-full py-3`}>
                Send message
              </button>

              <p role="status" aria-live="polite" className="min-h-5 text-center text-xs text-lp-muted">
                {sent && (
                  <>
                    Your email app should open with the message ready to send. If it
                    doesn&apos;t, write to{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-lp-accent-text underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}