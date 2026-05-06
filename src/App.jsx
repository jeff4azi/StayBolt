import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import BottomNav from "./components/BottomNav";
import FeedPage from "./pages/FeedPage";
import PropertyPage from "./pages/PropertyPage";
import AgentPage from "./pages/AgentPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import AddPropertyPage from "./pages/AddPropertyPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/property/:id" element={<PropertyPage />} />
            <Route path="/agent/:id" element={<AgentPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-property" element={<AddPropertyPage />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
