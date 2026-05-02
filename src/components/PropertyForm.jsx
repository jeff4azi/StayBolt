import { useState, useRef } from "react";
import { X, Upload, ImagePlus } from "lucide-react";

const EMPTY = {
  title: "",
  price: "",
  location: "",
  description: "",
  status: "available",
  images: [],
};

export default function PropertyForm({
  initial = {},
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        set("images", [...(form.images || []), ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (idx) => {
    set(
      "images",
      form.images.filter((_, i) => i !== idx),
    );
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price.trim()) e.price = "Price is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    onSubmit(form);
  };

  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#4E35D0] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-white/70 text-xs mb-1.5">
          Property Title *
        </label>
        <input
          className={inputCls}
          placeholder="e.g. 2-Bedroom Flat in Lekki"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
        {errors.title && (
          <p className="text-red-400 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Price + Status row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-white/70 text-xs mb-1.5">Price *</label>
          <input
            className={inputCls}
            placeholder="e.g. ₦500,000/yr"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
          {errors.price && (
            <p className="text-red-400 text-xs mt-1">{errors.price}</p>
          )}
        </div>
        <div>
          <label className="block text-white/70 text-xs mb-1.5">Status</label>
          <select
            className={inputCls + " cursor-pointer"}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="available">Available</option>
            <option value="taken">Taken</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-white/70 text-xs mb-1.5">Location *</label>
        <input
          className={inputCls}
          placeholder="e.g. Lekki Phase 1, Lagos"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
        />
        {errors.location && (
          <p className="text-red-400 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-white/70 text-xs mb-1.5">
          Description
        </label>
        <textarea
          className={inputCls + " resize-none h-20"}
          placeholder="Brief description of the property..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-white/70 text-xs mb-1.5">Photos</label>
        <div className="flex flex-wrap gap-2">
          {form.images.map((src, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-xl overflow-hidden"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-red-500 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 hover:border-[#4E35D0] flex flex-col items-center justify-center gap-1 text-white/40 hover:text-white/70 transition-colors"
          >
            <ImagePlus size={18} />
            <span className="text-[10px]">Add</span>
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImages}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-[#4E35D0] hover:bg-[#3d28b0] text-white text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Listing"}
        </button>
      </div>
    </form>
  );
}
