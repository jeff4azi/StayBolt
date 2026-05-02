import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Share2, Smartphone, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const { agent } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 text-xs text-white/70 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#AA3E8B] animate-pulse" />
          Simple property listings for agents
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-2xl mb-5">
          Share your listings
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E35D0] to-[#AA3E8B]">
            with one link
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
          Stop sending property photos one by one on WhatsApp. Upload once,
          share a link, let clients browse at their own pace.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {agent ? (
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 bg-[#4E35D0] hover:bg-[#3d28b0] text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 bg-[#4E35D0] hover:bg-[#3d28b0] text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Get started free <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto w-full px-4 pb-20 grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Smartphone size={20} className="text-[#4E35D0]" />,
            title: "Mobile-first",
            desc: "Built for agents on the go. Works perfectly on any phone.",
          },
          {
            icon: <Share2 size={20} className="text-[#AA3E8B]" />,
            title: "One shareable link",
            desc: "Your personal page with all listings. Share it anywhere.",
          },
          {
            icon: <CheckCircle2 size={20} className="text-emerald-400" />,
            title: "Available / Taken",
            desc: "Keep clients updated with clear availability labels.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
