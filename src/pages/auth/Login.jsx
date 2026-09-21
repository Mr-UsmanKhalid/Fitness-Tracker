import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Auth //
import { loginUser, clearError } from '../../redux/slices/authSlice';

import BrandMark from '../../components/common/BrandMark';
import { authDialog } from '../../utils/Authdialog.js';
import { normalizeEmail, validateEmail, validateLogin } from '../../utils/authValidation';
import {
  EyeIcon,
  FieldError,
  fieldClass,
  labelClass,
} from '../../components/auth/authFormUI';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  // Don't show an error left over from another page
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));

    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
    if (error) dispatch(clearError());
  };

  const handleEmailBlur = () => {
    if (!form.email) return;
    setErrors((current) => ({ ...current, email: validateEmail(form.email) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validateLogin(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    const result = await dispatch(
      loginUser({
        email: normalizeEmail(form.email),
        password: form.password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      // Adjust if your thunk returns a different shape (e.g. payload.data.user)
      const account = result.payload?.user ?? result.payload;
      const username = account?.username || account?.name || form.email;

      await authDialog.success({
        title: 'Logged in',
        message: `${username} successfully logged in.`,
      });

      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-bg text-ink font-display">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between bg-panel border-r border-ink/10 p-10 xl:p-14">
        <a href="/" className="flex items-center gap-2 text-lg font-bold">
          <BrandMark />
          Fitness Tracking
        </a>

        <div>
          <h1 className="text-4xl xl:text-5xl font-semibold leading-tight max-w-[12ch]">
            Pick up where you left off.
          </h1>
          <p className="mt-5 text-ink/60 text-lg max-w-[36ch]">
            Your last twelve weeks of training are waiting — streak, plan and
            all.
          </p>
        </div>

        <div className="bg-gradient-to-b from-panel2 to-bg border border-ink/15 rounded-xl p-5 max-w-xs">
          <div className="flex justify-between items-center text-sm text-ink/60 mb-3">
            <span>Current streak</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ember">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ember" />
              </span>
              Live
            </span>
          </div>
          <strong className="font-mono text-3xl">12 days</strong>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col bg-white text-black">
        {/* Logo Section - Mobile Only */}
        <div className="lg:hidden flex items-center justify-center px-4 sm:px-6 mt-30">
          <a href="/" className="flex flex-col items-center justify-center">
            <div className="bg-black rounded-full p-4 flex items-center justify-center mb-3">
              <span className="scale-130">
                <BrandMark />
              </span>
            </div>
            <span className="text-lg font-bold text-black">Fitness Tracking</span>
          </a>
        </div>

        {/* Form Section - All Screens */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold">Log in</h2>
            <p className="mt-2 text-ink/60">
              New to Surge?{' '}
              <a
                href="/register"
                className="text-ink hover:text-accent border-b border-ink/20 hover:border-accent transition-colors"
              >
                Create an account
              </a>
            </p>

            <form className="mt-9" onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={fieldClass(errors.email)}
                />
                <FieldError id="email-error" message={errors.email} />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block font-mono text-xs text-ink/40">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="font-mono text-xs text-ink/40 hover:text-accent transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className={fieldClass(errors.password, 'pr-8')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                <FieldError id="password-error" message={errors.password} />
              </div>

              <label className="flex items-center gap-2.5 mt-7 mb-9 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded-sm bg-transparent border border-ink/30 accent-accent"
                />
                <span className="text-sm text-ink/60">Keep me logged in</span>
              </label>

              {error && (
                <p role="alert" className="text-sm text-red-500 font-mono mt-3 mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#c8ff4d' }}
                className="w-full rounded bg-accent text-bg font-semibold py-3.5 hover:bg-[#d8ff77] transition disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}