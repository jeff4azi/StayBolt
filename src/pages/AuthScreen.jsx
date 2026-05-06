import { Chrome } from "lucide-react";

export default function AuthScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top illustration area */}
      <div className="bg-green-600 flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-12">
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-white text-3xl font-black">SB</span>
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
          <Chrome size={20} className="text-blue-500" />
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
