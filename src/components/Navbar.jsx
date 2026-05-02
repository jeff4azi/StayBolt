import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, ExternalLink } from "lucide-react";

export default function Navbar() {
  const { agent, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-lg tracking-tight">
          Stay<span className="text-[#AA3E8B]">bolt</span>
        </Link>

        <div className="flex items-center gap-3">
          {agent ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                to={`/${agent.slug}`}
                className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
              >
                <ExternalLink size={15} />
                <span className="hidden sm:inline">My Page</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-[#4E35D0] hover:bg-[#3d28b0] text-white px-4 py-1.5 rounded-full transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
