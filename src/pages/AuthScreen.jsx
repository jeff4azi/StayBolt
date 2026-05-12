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

export default function AuthScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top illustration area */}
      <div className="bg-green-600 flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-12">
        <div className="w-20 h-20 bg-white/80 rounded-3xl flex items-center justify-center mb-6">
          <img
            src={logo}
            alt="StayBolt logo"
            className="w-14 h-14 object-contain"
          />
        </div>
        <h1 className="text-white text-2xl font-bold text-center">
          Stay<span className="text-green-200">Bolt</span>
        </h1>
        <p className="text-green-100 text-[14px] text-center mt-2">
          The smarter way to rent
        </p>
      </div>

      {/* Bottom card */}
      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-12 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <h2 className="text-xl font-bold text-gray-900 text-center">
          Are you an agent?
        </h2>
        <p className="text-gray-500 text-[14px] text-center mt-2 leading-relaxed">
          Manage your listings on StayBolt. Sign in to post properties, track
          views, and connect with renters.
        </p>

        <button
          onClick={onLogin}
          className="mt-8 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-2xl py-3.5 px-4 shadow-sm active:scale-[0.98] transition-transform"
        >
          <GoogleIcon size={20} />
          <span className="font-semibold text-gray-700 text-[15px]">
            Continue with Google
          </span>
        </button>

        <p className="text-gray-400 text-[12px] text-center mt-5">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
