import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { resetPassword } from "../../redux/slices/authSlice";

import BrandMark from '../../components/common/BrandMark'; 

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a15.6 15.6 0 0 1-3.4 4.3M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8"
        strokeLinecap="round"
      />
      <path
        d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirm: "",
  });

  const [done, setDone] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (form.password.length < 8) {
      return;
    }

    if (form.password !== form.confirm) {
      return;
    }

    // Send token + new password to backend
    const result = await dispatch(
      resetPassword({
        token,
        password: form.password,
      })
    );

    // Only show success if backend succeeded
    if (resetPassword.fulfilled.match(result)) {
      setDone(true);
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
            Choose a new password.
          </h1>

          <p className="mt-5 text-ink/60 text-lg max-w-[34ch]">
            Make it one you haven't used on Fitness Tracking before.
          </p>
        </div>

        <span className="font-mono text-xs text-ink/30">
          You'll be logged out of other devices.
        </span>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">

        <div className="lg:hidden flex items-center justify-between px-4 sm:px-6 h-16 border-b border-ink/10">
          <a href="/" className="flex items-center gap-2 text-base font-bold">
            <BrandMark />
            Fitness Tracking
          </a>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 bg-white text-black">

          <div className="w-full max-w-sm">

            {done ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-semibold">
                  Password updated
                </h2>

                <p className="mt-3 text-ink/60">
                  Your password has been reset. Log in with your new
                  password.
                </p>

                <button
                  onClick={() => navigate("/login")}
                  className="mt-8 inline-flex items-center gap-2 rounded bg-accent text-bg font-semibold px-6 py-3.5 hover:-translate-y-px hover:bg-[#d8ff77] transition"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-semibold">
                  Set a new password
                </h2>

                <p className="mt-2 text-ink/60">
                  Your new password must be at least 8 characters.
                </p>

                <form className="mt-9" onSubmit={handleSubmit}>

                  {/* New password */}
                  <div className="mb-6">

                    <label
                      htmlFor="password"
                      className="block font-mono text-xs text-ink/40 mb-2"
                    >
                      New password
                    </label>

                    <div className="relative">

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 pr-8 text-base transition-colors"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((v) => !v)
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <EyeIcon open={showPassword} />
                      </button>

                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="mb-3">

                    <label
                      htmlFor="confirm"
                      className="block font-mono text-xs text-ink/40 mb-2"
                    >
                      Confirm new password
                    </label>

                    <input
                      id="confirm"
                      name="confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat your new password"
                      value={form.confirm}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-accent outline-none py-2 text-base transition-colors"
                    />

                  </div>

                  {/* Backend error */}
                  {error && (
                    <p className="text-sm text-red-500 font-mono mt-3 mb-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: "#c8ff4d" }}
                    className="w-full rounded bg-accent text-bg font-semibold py-3.5 mt-6 hover:bg-[#d8ff77] transition disabled:opacity-50"
                  >
                    {loading ? "Resetting..." : "Reset password"}
                  </button>

                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
} 
