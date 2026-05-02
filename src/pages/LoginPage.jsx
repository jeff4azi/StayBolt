import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(form);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate("/dashboard");
  };

  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#4E35D0] transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/50 text-sm">
            Log in to your Staybolt account
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-xs mb-1.5">
                Email
              </label>
              <input
                type="email"
                className={inputCls}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-white/70 text-xs mb-1.5">
                Password
              </label>
              <input
                type="password"
                className={inputCls}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4E35D0] hover:bg-[#3d28b0] text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm mt-5">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#AA3E8B] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
