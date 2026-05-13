import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mapAgentRow, mapListingFromView } from "../lib/mappers";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AppContext = createContext(null);

const GUEST_SAVED_KEY = "staybolt_guest_saved";

function readGuestSavedIds() {
  try {
    const raw = localStorage.getItem(GUEST_SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestSavedIds(ids) {
  localStorage.setItem(GUEST_SAVED_KEY, JSON.stringify(ids));
}

async function mergeGuestSavedIntoAccount(userId) {
  const guestIds = readGuestSavedIds();
  if (guestIds.length === 0) return;
  for (const listingId of guestIds) {
    await supabase
      .from("saved_listings")
      .upsert(
        { user_id: userId, listing_id: listingId },
        { onConflict: "user_id,listing_id" },
      );
  }
  localStorage.removeItem(GUEST_SAVED_KEY);
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(null);
  const [savedIds, setSavedIds] = useState(() => readGuestSavedIds());
  const [currentAgent, setCurrentAgent] = useState(null);

  const user = session?.user ?? null;
  const isLoggedIn = Boolean(user);

  const refreshListings = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setListings([]);
      setListingsLoading(false);
      setListingsError(
        new Error("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env"),
      );
      return;
    }
    setListingsLoading(true);
    setListingsError(null);
    const { data, error } = await supabase
      .from("listings_with_agents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setListingsError(error);
      setListings([]);
    } else {
      setListings((data || []).map(mapListingFromView));
    }
    setListingsLoading(false);
  }, []);

  const refreshSavedFromServer = useCallback(async (uid) => {
    if (!uid || !isSupabaseConfigured()) return;
    const { data, error } = await supabase
      .from("saved_listings")
      .select("listing_id")
      .eq("user_id", uid);
    if (error) {
      console.error(error);
      return;
    }
    setSavedIds((data || []).map((r) => r.listing_id));
  }, []);

  const loadAgentProfile = useCallback(async (uid) => {
    if (!uid || !isSupabaseConfigured()) {
      setCurrentAgent(null);
      return;
    }
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();
    if (error) {
      console.error(error);
      setCurrentAgent(null);
      return;
    }
    setCurrentAgent(mapAgentRow(data));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSessionReady(true);
      refreshListings();
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s ?? null);
      setSessionReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    refreshListings();

    return () => subscription.unsubscribe();
  }, [refreshListings]);

  useEffect(() => {
    if (!sessionReady || !isSupabaseConfigured()) return;

    (async () => {
      if (user?.id) {
        await mergeGuestSavedIntoAccount(user.id);
        await loadAgentProfile(user.id);
        await refreshSavedFromServer(user.id);
      } else {
        setCurrentAgent(null);
        setSavedIds(readGuestSavedIds());
      }
    })();
  }, [sessionReady, user?.id, loadAgentProfile, refreshSavedFromServer]);

  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds]);

  const toggleSave = useCallback(
    async (listingId) => {
      const nextSaved = !savedIds.includes(listingId);

      if (user?.id && isSupabaseConfigured()) {
        if (nextSaved) {
          const { error } = await supabase.from("saved_listings").insert({
            user_id: user.id,
            listing_id: listingId,
          });
          if (error) {
            console.error(error);
            return;
          }
          setSavedIds((prev) =>
            prev.includes(listingId) ? prev : [...prev, listingId],
          );
        } else {
          const { error } = await supabase
            .from("saved_listings")
            .delete()
            .eq("user_id", user.id)
            .eq("listing_id", listingId);
          if (error) {
            console.error(error);
            return;
          }
          setSavedIds((prev) => prev.filter((x) => x !== listingId));
        }
        return;
      }

      setSavedIds((prev) => {
        const next = nextSaved
          ? prev.includes(listingId)
            ? prev
            : [...prev, listingId]
          : prev.filter((x) => x !== listingId);
        writeGuestSavedIds(next);
        return next;
      });
    },
    [savedIds, user?.id],
  );

  const signInWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { data, error };
  }, []);

  const signUpWithEmail = useCallback(async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName?.trim() || "" },
      },
    });
    return { data, error };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentAgent(null);
    setSavedIds(readGuestSavedIds());
  }, []);

  const addListing = useCallback(
    async (payload) => {
      if (!currentAgent?.id || !isSupabaseConfigured())
        return { error: new Error("Not ready") };
      const defaultImg =
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
      const coverUrl = payload.image ?? defaultImg;
      const { data: row, error } = await supabase
        .from("listings")
        .insert({
          agent_id: currentAgent.id,
          title: payload.title,
          payment_type: payload.paymentType,
          first_payment_amount: payload.firstPaymentAmount,
          yearly_rent_amount: payload.yearlyRentAmount,
          location: payload.location,
          description: payload.description ?? "",
          cover_image_url: coverUrl,
          minutes_to_campus: payload.minutesToCampus ?? 0,
          electricity_status: payload.electricityStatus ?? "moderate",
          water_supply: payload.waterSupply ?? "borehole",
          status: "available",
        })
        .select("id")
        .single();
      if (error) return { error };

      // Insert gallery images — use galleryUrls if provided, else just the cover
      const galleryUrls =
        payload.galleryUrls?.length > 0 ? payload.galleryUrls : [coverUrl];
      const galleryRows = galleryUrls.map((url, i) => ({
        listing_id: row.id,
        image_url: url,
        sort_order: i,
      }));
      await supabase.from("listing_images").insert(galleryRows);

      await refreshListings();
      return { data: row, error: null };
    },
    [currentAgent?.id, refreshListings],
  );

  const updateListing = useCallback(
    async (id, updates) => {
      if (!isSupabaseConfigured())
        return { error: new Error("Not configured") };
      const { error } = await supabase
        .from("listings")
        .update({
          title: updates.title,
          payment_type: updates.paymentType,
          first_payment_amount: updates.firstPaymentAmount,
          yearly_rent_amount: updates.yearlyRentAmount,
          location: updates.location,
          description: updates.description,
          minutes_to_campus: updates.minutesToCampus,
          electricity_status: updates.electricityStatus,
          water_supply: updates.waterSupply,
        })
        .eq("id", id);
      if (error) return { error };
      await refreshListings();
      return { error: null };
    },
    [refreshListings],
  );

  const toggleStatus = useCallback(
    async (id) => {
      const listing = listings.find((l) => l.id === id);
      if (!listing || !isSupabaseConfigured()) return;
      const next = listing.status === "available" ? "taken" : "available";
      const { error } = await supabase
        .from("listings")
        .update({ status: next })
        .eq("id", id);
      if (error) {
        console.error(error);
        return;
      }
      await refreshListings();
    },
    [listings, refreshListings],
  );

  /**
   * Update the current agent's profile fields.
   * Pass only the fields you want to change.
   * @param {Partial<{name,bio,phone,email,avatar_url}>} updates
   */
  const updateAgentProfile = useCallback(
    async (updates) => {
      if (!currentAgent?.id || !isSupabaseConfigured()) {
        return { error: new Error("Not ready") };
      }
      const { error } = await supabase
        .from("agents")
        .update(updates)
        .eq("id", currentAgent.id);
      if (error) return { error };
      // Re-fetch so currentAgent reflects the latest data
      await loadAgentProfile(user?.id);
      return { error: null };
    },
    [currentAgent?.id, user?.id, loadAgentProfile],
  );

  const value = useMemo(
    () => ({
      session,
      sessionReady,
      user,
      isLoggedIn,
      currentAgent,
      listings,
      listingsLoading,
      listingsError,
      saved: savedIds,
      isSaved,
      toggleSave,
      refreshListings,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      addListing,
      updateListing,
      toggleStatus,
      updateAgentProfile,
      refreshAgentProfile: () => loadAgentProfile(user?.id),
      supabaseConfigured: isSupabaseConfigured(),
    }),
    [
      session,
      sessionReady,
      user,
      isLoggedIn,
      currentAgent,
      listings,
      listingsLoading,
      listingsError,
      savedIds,
      isSaved,
      toggleSave,
      refreshListings,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      addListing,
      updateListing,
      toggleStatus,
      updateAgentProfile,
      loadAgentProfile,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
