import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../components/theme';
import { BrandMark, BRAND_NAME } from './Brand';
import { btnGhost, btnPrimary, btnSecondary, focusRing } from './landingUI';

const LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full text-lp-muted transition duration-200 hover:bg-lp-fg/10 hover:text-lp-fg ${focusRing}`}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const onScroll = () => {
      const top = document.documentElement.scrollTop;
      setScrolled(top > 8);
      if (top < 120) setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the link of the section currently in view
  useEffect(() => {
    if (location.pathname !== '/') return undefined;

    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleSectionClick = (e, id) => {
    e.preventDefault();
    setOpen(false);

    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto max-w-[1040px]">
        <nav
          aria-label="Main"
          className={`flex h-14 items-center justify-between gap-3 rounded-full border border-lp-line bg-lp-bg/80 pl-3 pr-2 backdrop-blur-xl transition-shadow duration-300 ${
            scrolled ? 'shadow-lg shadow-black/10' : ''
          }`}
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2.5 rounded-full pr-2 text-[1.05rem] font-semibold tracking-tight text-lp-fg ${focusRing}`}
          >
            <BrandMark className="h-8 w-8" />
            <span>{BRAND_NAME}</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleSectionClick(e, link.id)}
                aria-current={active === link.id ? 'true' : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 ${focusRing} ${
                  active === link.id
                    ? 'bg-lp-fg/10 text-lp-fg'
                    : 'text-lp-muted hover:text-lp-fg'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ThemeButton />

            <div className="hidden items-center gap-1 md:flex">
              {user ? (
                <Link to="/dashboard" className={btnPrimary}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className={btnGhost}>
                    Log in
                  </Link>
                  <Link to="/register" className={btnPrimary}>
                    Sign up
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              className={`grid h-9 w-9 place-items-center rounded-full text-lp-fg transition duration-200 hover:bg-lp-fg/10 md:hidden ${focusRing}`}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu: a card that drops below the pill */}
        <div
          id="mobile-menu"
          className={`grid transition-all duration-300 ease-out md:hidden ${
            open ? 'grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-2 rounded-2xl border border-lp-line bg-lp-surface p-3 shadow-xl shadow-black/10">
              <div className="flex flex-col">
                {LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleSectionClick(e, link.id)}
                    className={`rounded-xl px-3 py-3 text-base transition-colors duration-200 hover:bg-lp-fg/5 ${
                      active === link.id ? 'bg-lp-fg/5 text-lp-fg' : 'text-lp-muted'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-lp-line pt-3">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className={`${btnPrimary} col-span-2 py-3`}
                  >
                    Go to dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className={`${btnSecondary} py-3`}>
                      Log in
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className={`${btnPrimary} py-3`}>
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}