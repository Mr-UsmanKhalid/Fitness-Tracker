import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth //
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';

import BrandMark from '../../components/common/BrandMark';
import { authDialog } from '../../utils/Authdialog.js';
import {
  fieldForServerMessage,
  getPasswordChecks,
  normalizeEmail,
  validateRegister,
  validateRegisterField,
} from '../../utils/authValidation';
import {
  EyeIcon,
  FieldError,
  fieldClass,
  labelClass,
} from '../../components/auth/authFormUI';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);

    if (error) dispatch(clearError());

    // Once a field has been visited, re-check it as the user types
    // (and re-check "confirm" when the password changes)
    setErrors((current) => {
      const updated = { ...current };
      if (touched[name] || current[name]) updated[name] = validateRegisterField(name, next);
      if (name === 'password' && touched.confirm) {
        updated.confirm = validateRegisterField('confirm', next);
      }
      return updated;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((current) => ({ ...current, [name]: validateRegisterField(name, form) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validateRegister(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setTouched({ name: true, username: true, email: true, password: true, confirm: true });
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    const userData = {
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
      email: normalizeEmail(form.email),
      password: form.password,
    };

    const result = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(result)) {
      await authDialog.success({
        title: 'Account created',
        message: `${userData.username} successfully registered. You can log in now.`,
      });
      navigate('/login');
      return;
    }

    // Show server messages such as "Username already exists" under the right field
    const message = typeof result.payload === 'string' ? result.payload : '';
    const field = fieldForServerMessage(message);
    if (field) {
      setErrors((current) => ({ ...current, [field]: message }));
      dispatch(clearError());
      document.getElementById(field)?.focus();
    }
  };

  const passwordChecks = getPasswordChecks(form.password);

  return (
    <div className="min-h-screen flex bg-bg text-ink font-display">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between bg-panel border-r border-ink/10 p-10 xl:p-14">
        <a href="/" className="flex items-center gap-2 text-lg font-bold">
          <BrandMark />
          Fitness Tracking
        </a>

        <div>
          <h1 className="text-4xl xl:text-5xl font-semibold leading-tight max-w-[13ch]">
            Start logging today.
          </h1>
          <p className="mt-5 text-ink/60 text-lg max-w-[36ch]">
            Free to start. No card required, no generic training calendar
            just your data, tracked properly.
          </p>
        </div>

        <div className="flex gap-6">
          <div>
            <strong className="block font-mono text-2xl">4.1M</strong>
            <span className="text-sm text-ink/40">workouts logged</span>
          </div>
          <div>
            <strong className="block font-mono text-2xl">180</strong>
            <span className="text-sm text-ink/40">countries</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col bg-white text-black">
        <div className="lg:hidden flex items-center justify-between px-4 sm:px-6 h-16 border-b border-ink/10">
          <a href="/" className="flex items-center gap-2 text-base font-bold">
            <BrandMark />
            Fitness Tracking
          </a>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold">Create your account</h2>
            <p className="mt-2 text-ink/60">
              Already training with us?{' '}
              <a
                href="/login"
                className="text-ink hover:text-accent border-b border-ink/20 hover:border-accent transition-colors"
              >
                Log in
              </a>
            </p>

            <form className="mt-9" onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="mb-6">
                <label htmlFor="name" className={labelClass}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={fieldClass(errors.name)}
                />
                <FieldError id="name-error" message={errors.name} />
              </div>

              {/* Username */}
              <div className="mb-6">
                <label htmlFor="username" className={labelClass}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={20}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'username-error' : 'username-hint'}
                  className={fieldClass(errors.username)}
                />
                {errors.username ? (
                  <FieldError id="username-error" message={errors.username} />
                ) : (
                  <p id="username-hint" className="mt-1.5 text-xs text-ink/40">
                    3 to 20 characters: letters, numbers and underscores.
                  </p>
                )}
              </div>

              {/* Email */}
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
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={fieldClass(errors.email)}
                />
                <FieldError id="email-error" message={errors.email} />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="password-rules"
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

                <ul id="password-rules" className="mt-2 space-y-1 text-xs">
                  {passwordChecks.map((check) => (
                    <li
                      key={check.key}
                      className={
                        check.ok
                          ? 'text-green-700'
                          : form.password || touched.password
                          ? 'text-red-600'
                          : 'text-ink/40'
                      }
                    >
                      <span aria-hidden="true">{check.ok ? '✓' : '○'}</span> {check.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confirm */}
              <div className="mb-3">
                <label htmlFor="confirm" className={labelClass}>
                  Confirm password
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.confirm)}
                  aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                  className={fieldClass(errors.confirm)}
                />
                <FieldError id="confirm-error" message={errors.confirm} />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-500 font-mono mt-3">
                  {error}
                </p>
              )}

              <p className="text-xs text-ink/40 mt-6 mb-3 leading-5">
                By creating an account you agree to Surge&apos;s{' '}
                <a href="/terms" className="underline hover:text-ink/70">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy" className="underline hover:text-ink/70">
                  Privacy Policy
                </a>
                .
              </p>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#c8ff4d' }}
                className="w-full rounded bg-accent text-bg font-semibold py-3.5 hover:bg-[#d8ff77] transition mt-4 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}