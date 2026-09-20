import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth // 
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";

import BrandMark from '../../components/common/BrandMark'; 
import { authDialog } from '../../utils/Authdialog.js';

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a15.6 15.6 0 0 1-3.4 4.3M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" strokeLinecap="round" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
  setForm((f) => ({
    ...f,
    [e.target.name]: e.target.value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirm) {
    await authDialog.error({
      title: "Passwords don't match",
      message: 'Enter the same password in both fields.',
    });
    return;
  }

  const userData = {
    name: form.name,
    username: form.username,
    email: form.email,
    password: form.password,
  };

  const result = await dispatch(registerUser(userData));

  if (registerUser.fulfilled.match(result)) {
    await authDialog.success({
      title: 'Account created',
      message: `${form.username} successfully registered. You can log in now.`,
    });
    navigate("/login");
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
              <a href="/login" className="text-ink hover:text-accent border-b border-ink/20 hover:border-accent transition-colors">
                Log in
              </a>
            </p>

            <form className="mt-9" onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block font-mono text-xs text-ink/40 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 text-base transition-colors"
                />
              </div>

              <div className="mb-6">
  <label
    htmlFor="username"
    className="block font-mono text-xs text-ink/40 mb-2"
  >
    Username
  </label>

  <input
    id="username"
    name="username"
    type="text"
    placeholder="Choose a username"
    value={form.username}
    onChange={handleChange}
    required
    minLength={3}
    maxLength={20}
    pattern="[a-zA-Z0-9_]+"
    className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 text-base transition-colors"
  />
</div>

              <div className="mb-6">
                <label htmlFor="email" className="block font-mono text-xs text-ink/40 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 text-base transition-colors"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block font-mono text-xs text-ink/40 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 pr-8 text-base transition-colors"
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
              </div>

              <div className="mb-3">
                <label htmlFor="confirm" className="block font-mono text-xs text-ink/40 mb-2">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 text-base transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-mono mt-3">
                  {error}
                </p>
              )}

              <p className="text-xs text-ink/40 mt-6 mb-3 leading-5">
                By creating an account you agree to Surge's{' '}
                <a href="/terms" className="underline hover:text-ink/70">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy" className="underline hover:text-ink/70">
                  Privacy Policy
                </a>.
              </p>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#c8ff4d' }}
                className="w-full rounded bg-accent text-bg font-semibold py-3.5 hover:bg-[#d8ff77] transition mt-4"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}