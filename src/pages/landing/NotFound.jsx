import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { btnPrimary, btnSecondary, btnLarge } from './landingUI';
import { ThemeToggle } from '../../components/theme';

export default function NotFound() {
  const { user } = useSelector((state) => state.auth);

  return (
    <main className="flex min-h-screen items-center justify-center bg-lp-bg px-6 py-16 text-lp-fg">
      <div className="w-full max-w-[620px] text-center">
        <p className="font-lp-display text-[clamp(4rem,14vw,7rem)] font-medium leading-none tracking-[-0.03em] text-lp-accent-text">
          404
        </p>

        <h1 className="mt-6 font-lp-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.02em]">
          Looks like you went off the trail.
        </h1>

        <p className="mx-auto mt-5 max-w-[48ch] text-base leading-7 text-lp-muted sm:text-[1.0625rem]">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Head back
          and pick up where you left off.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link to="/" className={`${btnPrimary} ${btnLarge}`}>
            <ArrowLeft size={17} /> Back to home
          </Link>
          {user && (
            <Link to="/dashboard" className={`${btnSecondary} ${btnLarge}`}>
              Go to dashboard
            </Link>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}