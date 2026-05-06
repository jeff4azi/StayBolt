import { createContext, useContext, useState } from "react";
import {
  listings as initialListings,
  agentReviews as initialReviews,
} from "../data/listings";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [saved, setSaved] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [listings, setListings] = useState(initialListings);
  const [agentReviews, setAgentReviews] = useState(initialReviews);

  const toggleSave = (id) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const isSaved = (id) => saved.includes(id);

  const login = (agent) => {
    setIsLoggedIn(true);
    setCurrentAgent(agent);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentAgent(null);
  };

  const addListing = (listing) => {
    setListings((prev) => [listing, ...prev]);
  };

  const toggleStatus = (id) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === "available" ? "taken" : "available" }
          : l,
      ),
    );
  };

  const updateListing = (id, updates) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    );
  };

  const addAgentReview = (agentId, review) => {
    setAgentReviews((prev) => ({
      ...prev,
      [agentId]: [review, ...(prev[agentId] || [])],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        saved,
        toggleSave,
        isSaved,
        isLoggedIn,
        currentAgent,
        login,
        logout,
        listings,
        addListing,
        toggleStatus,
        updateListing,
        agentReviews,
        addAgentReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
