import { useApp } from "../context/AppContext";
import { agents } from "../data/listings";
import AuthScreen from "./AuthScreen";
import DashboardPage from "./DashboardPage";

// Simulate Google login by picking a mock agent
const MOCK_AGENT = agents[0];

export default function ProfilePage() {
  const { isLoggedIn, login } = useApp();

  if (!isLoggedIn) {
    return <AuthScreen onLogin={() => login(MOCK_AGENT)} />;
  }

  return <DashboardPage />;
}
