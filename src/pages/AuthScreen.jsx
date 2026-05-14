import { useState } from "react";
import { Home, BarChart3, MessageSquare } from "lucide-react";
import logo from "../assets/logo.png";

const GoogleIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/* const features = [
  { icon: Home, label: "Post listings instantly" },
  { icon: BarChart3, label: "Track views & inquiries" },
  { icon: MessageSquare, label: "Connect with renters" },
]; */

export default function AuthScreen({
  onSignInWithEmail,
  onSignUpWithEmail,
  onSignInWithGoogle,
}) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim() || !password) {
      setError("Enter email and password.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await onSignUpWithEmail(
          email,
          password,
          fullName,
        );
        if (err) {
          setError(err.message);
          return;
        }
        setMessage(
          "Check your email to confirm your account, then sign in.",
        );
      } else {
        const { error: err } = await onSignInWithEmail(email, password);
        if (err) {
          setError(err.message);
          return;
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      const { error: err } = await onSignInWithGoogle();
      if (err) setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative flex-1 bg-green-600 overflow-hidden flex flex-col items-center justify-center px-8 pt-20 pb-16">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-green-500/40 rounded-full" />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-green-700/30 rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-5">
            <img
              src={logo}
              alt="StayBolt"
              className="w-13 h-13 object-contain"
            />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Stay<span className="text-green-200">Bolt</span>
          </h1>
          <p className="text-green-100/80 text-[14px] mt-1.5 tracking-wide uppercase text-sm font-medium">
            The smarter way to rent
          </p>
        </div>

        {/* <div className="relative z-10 flex flex-col gap-2.5 mt-10 w-full max-w-xs">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3"
            >
              <Icon className="text-white w-5 h-5" strokeWidth={2.5} />
              <span className="text-white text-[14px] font-medium">
                {label}
              </span>
            </div>
          ))}
        </div> */}
      </div>

      <div className="bg-white rounded-t-[2rem] -mt-6 relative z-10 px-6 pt-8 pb-20">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-7" />

        <h2 className="text-[22px] font-bold text-gray-900 leading-snug">
          Agent portal
        </h2>
        <p className="text-gray-500 text-[14px] mt-2 leading-relaxed">
          Sign in to manage your listings, respond to enquiries, and grow your
          rentals.
        </p>

        <div className="flex gap-2 mt-5 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              mode === "signin"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              mode === "signup"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleEmailSubmit} className="mt-5 flex flex-col gap-3">
          {mode === "signup" && (
            <input
              type="text"
              autoComplete="name"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-green-500"
            />
          )}
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-green-500"
          />
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[14px] outline-none focus:border-green-500"
          />
          {error && (
            <p className="text-red-600 text-[13px] leading-snug">{error}</p>
          )}
          {message && (
            <p className="text-green-700 text-[13px] leading-snug">{message}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-[12px]">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="mt-5 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl py-4 px-5 shadow-sm active:scale-[0.98] transition-all duration-150 hover:border-gray-300 hover:shadow disabled:opacity-60"
        >
          <GoogleIcon size={20} />
          <span className="font-semibold text-gray-800 text-[15px]">
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-[12px]">Agents only</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-gray-400 text-[12px] text-center mt-5 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
