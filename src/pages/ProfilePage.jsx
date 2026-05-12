import { useApp } from "../context/AppContext";
import AuthScreen from "./AuthScreen";
import DashboardPage from "./DashboardPage";

export default function ProfilePage() {
  const {
    isLoggedIn,
    sessionReady,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  } = useApp();

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <AuthScreen
        onSignInWithEmail={signInWithEmail}
        onSignUpWithEmail={signUpWithEmail}
        onSignInWithGoogle={signInWithGoogle}
      />
    );
  }

  return <DashboardPage />;
}
