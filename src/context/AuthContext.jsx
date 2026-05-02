import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [agent, setAgent] = useState(() => {
    try {
      const stored = localStorage.getItem("sb_agent");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const signup = ({ name, phone, email, password }) => {
    const agents = JSON.parse(localStorage.getItem("sb_agents") || "[]");
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const exists = agents.find((a) => a.email === email);
    if (exists) return { error: "An account with this email already exists." };

    const newAgent = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      password,
      slug,
    };
    agents.push(newAgent);
    localStorage.setItem("sb_agents", JSON.stringify(agents));
    const { password: _, ...safe } = newAgent;
    localStorage.setItem("sb_agent", JSON.stringify(safe));
    setAgent(safe);
    return { success: true };
  };

  const login = ({ email, password }) => {
    const agents = JSON.parse(localStorage.getItem("sb_agents") || "[]");
    const found = agents.find(
      (a) => a.email === email && a.password === password,
    );
    if (!found) return { error: "Invalid email or password." };
    const { password: _, ...safe } = found;
    localStorage.setItem("sb_agent", JSON.stringify(safe));
    setAgent(safe);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("sb_agent");
    setAgent(null);
  };

  return (
    <AuthContext.Provider value={{ agent, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
