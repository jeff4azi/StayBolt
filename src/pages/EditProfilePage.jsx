import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Trash2, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { uploadImage, deleteAgentAvatar } from "../lib/api";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=60";

/**
 * Normalise a phone number to E.164 format with a +234 country code.
 *
 * Handles:
 *   08012345678  → +2348012345678
 *   8012345678   → +2348012345678
 *   +2348012345678 → +2348012345678  (already correct)
 *   2348012345678  → +2348012345678
 *   07012345678  → +2347012345678
 *
 * Returns the original string unchanged if it doesn't look like a Nigerian
 * mobile number so we don't mangle international numbers the user typed
 * correctly (e.g. +447911123456).
 */
function normalisePhone(raw) {
  const digits = raw.replace(/\D/g, ""); // strip everything except digits

  if (!digits) return "";

  // Already has country code with leading +
  if (raw.trim().startsWith("+")) {
    // Re-attach the + that was stripped by replace
    return `+${digits}`;
  }

  // "234XXXXXXXXXX" — missing the leading +
  if (digits.startsWith("234") && digits.length >= 13) {
    return `+${digits}`;
  }

  // Nigerian local format: 0XXXXXXXXXX (11 digits starting with 0)
  if (digits.startsWith("0") && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }

  // 10-digit number without leading 0 (e.g. 8012345678)
  if (!digits.startsWith("0") && digits.length === 10) {
    return `+234${digits}`;
  }

  // Anything else — return as-is so the user can see what they typed
  return raw.trim();
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const {
    currentAgent,
    isLoggedIn,
    sessionReady,
    updateAgentProfile,
    refreshAgentProfile,
    user,
  } = useApp();

  const [form, setForm] = useState({ name: "", bio: "", phone: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!sessionReady || isLoggedIn) return;
    navigate("/profile", { replace: true });
  }, [sessionReady, isLoggedIn, navigate]);

  // Populate form from currentAgent
  useEffect(() => {
    if (!currentAgent) return;
    setForm({
      name: currentAgent.name ?? "",
      bio: currentAgent.bio ?? "",
      phone: currentAgent.phone ?? "",
    });
    setAvatarPreview(null);
    setAvatarFile(null);
  }, [currentAgent]);

  if (!sessionReady || !isLoggedIn) return null;

  if (!currentAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 pb-24">
        Loading…
      </div>
    );
  }

  const currentAvatar = avatarPreview ?? currentAgent.avatar ?? FALLBACK_AVATAR;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /** Normalise phone on blur so the user sees the formatted value */
  const handlePhoneBlur = () => {
    if (!form.phone.trim()) return;
    setForm((prev) => ({ ...prev, phone: normalisePhone(prev.phone) }));
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = async () => {
    if (!currentAgent.avatar || currentAgent.avatar === FALLBACK_AVATAR) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    setUploadingAvatar(true);
    setError(null);
    try {
      await deleteAgentAvatar(currentAgent.id);
      await refreshAgentProfile();
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      setError(err.message ?? "Could not remove avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setError(null);
    setSaving(true);

    try {
      let avatarUrl = currentAgent.avatar;

      if (avatarFile) {
        setUploadingAvatar(true);
        const { image_url } = await uploadImage(avatarFile, "staybolt/avatars");
        avatarUrl = image_url;
        setUploadingAvatar(false);
      }

      // Always normalise before saving
      const normalisedPhone = form.phone.trim()
        ? normalisePhone(form.phone)
        : null;

      const { error: err } = await updateAgentProfile({
        name: form.name.trim(),
        bio: form.bio.trim() || null,
        phone: normalisedPhone,
        avatar_url: avatarUrl ?? null,
      });

      if (err) {
        setError(err.message ?? "Could not save profile");
        return;
      }

      setSaved(true);
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSaving(false);
      setUploadingAvatar(false);
    }
  };

  const busy = saving || uploadingAvatar;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-400 text-[12px]">Update your agent info</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto px-4 mt-6 flex flex-col gap-4"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = FALLBACK_AVATAR;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={36} className="text-gray-300" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform disabled:opacity-50"
            >
              <Camera size={14} className="text-white" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarPick}
          />

          {(avatarPreview ||
            (currentAgent.avatar &&
              currentAgent.avatar !== FALLBACK_AVATAR)) && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={busy}
              className="flex items-center gap-1.5 text-red-500 text-[13px] font-medium active:scale-95 transition-transform disabled:opacity-50"
            >
              <Trash2 size={13} />
              Remove photo
            </button>
          )}

          {uploadingAvatar && (
            <p className="text-gray-400 text-[12px]">Uploading photo…</p>
          )}
        </div>

        {/* Email — read-only, sourced from auth */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Email
          </label>
          <p className="mt-1 text-[14px] text-gray-400 select-all">
            {user?.email ?? "—"}
          </p>
          <p className="text-[11px] text-gray-300 mt-0.5">
            Email is managed through your account and cannot be changed here.
          </p>
        </div>

        {/* Name */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Tunde Adeyemi"
            required
            className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent"
          />
        </div>

        {/* Phone */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Phone / WhatsApp
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handlePhoneBlur}
            placeholder="e.g. +2348012345678"
            inputMode="tel"
            className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent"
          />
        </div>

        {/* Bio */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell renters a bit about yourself…"
            rows={4}
            className="w-full mt-1 text-[14px] text-gray-800 placeholder-gray-300 outline-none bg-transparent resize-none"
          />
        </div>

        {error && <p className="text-red-600 text-[13px] px-1">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {saved ? "✓ Profile Saved!" : busy ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
