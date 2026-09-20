import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/slices/authSlice";

import BrandMark from '../../components/common/BrandMark'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);
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
            We&rsquo;ll get you back in.
          </h1>
          <p className="mt-5 text-ink/60 text-lg max-w-[34ch]">
            Your training log isn't going anywhere — just a reset link away.
          </p>
        </div>

        <span className="font-mono text-xs text-ink/30">
          Reset links expire after 30 minutes.
        </span>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col  bg-white text-black">
        <div className="lg:hidden flex items-center justify-between px-4 sm:px-6 h-16 border-b border-ink/10 bg-black text-white">
          <a href="/" className="flex items-center gap-2 text-base font-bold">
            <BrandMark />
            Fitness Tracking
          </a>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="w-full max-w-sm">
            {sent ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-semibold">Check your email</h2>
                <p className="mt-3 text-ink/60">
                  If an account exists for <span className="text-ink">{email}</span>, a
                  reset link is on its way.
                </p>
                <a
                  href="/login"
                  className="mt-8 inline-flex items-center gap-2 rounded border border-ink/20 font-semibold px-6 py-3.5 hover:border-accent hover:text-accent transition"
                >
                  Back to log in
                </a>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-semibold">Reset your password</h2>
                <p className="mt-2 text-ink/60">
                  Enter the email on your account and we'll send a link to
                  reset your password.
                </p>

                <form className="mt-9" onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label htmlFor="email" className="block font-mono text-xs text-ink/40 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 text-base transition-colors"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 font-mono mt-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: "#c8ff4d" }}
                    className="w-full rounded bg-accent text-bg font-semibold py-3.5 hover:bg-[#d8ff77] transition disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send reset link"}
                  </button>
                </form>

                <p className="mt-7 text-sm text-ink/60">
                  Remembered it?{' '}
                  <a href="/login" className="text-ink hover:text-accent border-b border-ink/20 hover:border-accent transition-colors">
                    Log in
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}