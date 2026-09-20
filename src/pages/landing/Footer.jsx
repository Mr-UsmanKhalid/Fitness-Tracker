import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { BrandMark, BRAND_NAME } from './Brand';
import { container, focusRing } from './landingUI';

const linkClass = `rounded-sm text-sm text-lp-muted transition-colors duration-200 hover:text-lp-fg ${focusRing}`;

const SECTION_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

// Placeholders until the pages exist
const LEGAL_LINKS = [
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'Terms' },
];

function Column({ title, children }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-medium text-lp-fg">{title}</h4>
      <div className="flex flex-col items-start gap-3">{children}</div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { user } = useSelector((state) => state.auth);

  return (
    <footer className="border-t border-lp-line bg-lp-surface-2">
      <div className={`${container} pb-8 pt-14 sm:pt-16`}>
        <div className="grid grid-cols-2 gap-10 pb-12 sm:grid-cols-3 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <a
              href="#top"
              className={`inline-flex items-center gap-2.5 rounded-full text-[1.05rem] font-semibold tracking-tight text-lp-fg ${focusRing}`}
            >
              <BrandMark className="h-8 w-8" />
              {BRAND_NAME}
            </a>
            <p className="mt-4 max-w-[32ch] text-sm leading-6 text-lp-muted">
              Log workouts, meals and progress in one place, and understand how
              training is really going.
            </p>
          </div>

          <Column title="Explore">
            {SECTION_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
          </Column>

          <Column title="Account">
            {user ? (
              <Link to="/dashboard" className={linkClass}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={linkClass}>
                  Log in
                </Link>
                <Link to="/register" className={linkClass}>
                  Sign up
                </Link>
              </>
            )}
          </Column>

          <Column title="Legal">
            {LEGAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
          </Column>
        </div>

        <div className="flex flex-col gap-5 border-t border-lp-line pt-6 text-xs text-lp-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {BRAND_NAME}. All rights reserved.
          </span> 
        </div>
      </div>
    </footer>
  );
}