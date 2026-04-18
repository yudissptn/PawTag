import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Tag {
  id: number;
  tag_id: string;
  pet_name: string | null;
  status: string;
  activated_at: string;
  address: string | null;
  pet_status: string | null;
  contact: string | null;
  photo: string | null;
  owner_id: number | null;
}

export const MyPet: FC = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [saving, setSaving] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/tags/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/tags/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([tagsData, countData]) => {
        if (tagsData.tags) {
          setTags(tagsData.tags);
        }
        if (countData.count) {
          setUnreadCount(countData.count);
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // proceed with logout even if request fails
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag({ ...tag });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, tagId: number) => {
    const file = e.target.files?.[0];
    if (!file || !editingTag) return;

    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tags/upload/${tagId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditingTag({ ...editingTag, photo: data.photo });
        setTags(tags.map((t) => (t.id === tagId ? { ...t, photo: data.photo } : t)));
      }
    } catch {
      setError("Failed to upload photo");
    }
  };

  const handleSave = async () => {
    if (!editingTag) return;
    setSaving(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tags/${editingTag.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tag_id: editingTag.tag_id,
          pet_name: editingTag.pet_name,
          address: editingTag.address,
          pet_status: editingTag.pet_status,
          contact: editingTag.contact,
          status: editingTag.status,
          photo: editingTag.photo,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTags(tags.map((t) => (t.id === editingTag.id ? data.tag : t)));
        setEditingTag(null);
      }
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 md:px-16 py-6 bg-cream/92 backdrop-blur-xl border-b border-rust/10">
        <div className="font-playfair text-xl md:text-2xl font-bold text-rust tracking-tight">
          PawTag
        </div>
        <div className="relative group">
          <button className="p-2 rounded-full hover:bg-charcoal/10 transition-colors duration-300">
            <svg
              className="w-6 h-6 text-deep-brown"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rust rounded-full"></span>
          )}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-rust/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <button
              onClick={() => navigate("/my-pet/messages")}
              className="flex items-center justify-between w-full text-left px-4 py-2 text-xs font-medium tracking-widest uppercase text-charcoal hover:bg-charcoal/5 transition-colors duration-300"
            >
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="w-5 h-5 bg-rust text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="border-t border-rust/10"></div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-xs font-medium tracking-widest uppercase text-charcoal hover:bg-charcoal/5 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-playfair text-3xl font-bold text-deep-brown mb-8">My Pet Tags</h1>

        {loading && (
          <p className="text-charcoal/60">Loading...</p>
        )}

        {error && (
          <p className="text-rust">{error}</p>
        )}

        {!loading && !error && tags.length === 0 && (
          <p className="text-charcoal/60">No tags found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white rounded-md shadow-lg border border-rust/10 p-6"
            >
              {tag.photo ? (
                <img
                  src={tag.photo}
                  alt={tag.pet_name || "Pet"}
                  className="w-full h-40 object-cover rounded-sm mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-charcoal/10 rounded-sm mb-4 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-charcoal/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-widest uppercase text-rust font-medium mb-1">
                    Tag ID
                  </p>
                  <p className="font-playfair text-xl font-bold text-deep-brown">
                    {tag.tag_id}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs tracking-widest uppercase bg-green-100 text-green-800 rounded-sm">
                  {tag.status}
                </span>
              </div>

              {tag.pet_name && (
                <div className="mt-4">
                  <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                    Pet Name
                  </p>
                  <p className="text-deep-brown">{tag.pet_name}</p>
                </div>
              )}

              {tag.address && (
                <div className="mt-3">
                  <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                    Address
                  </p>
                  <p className="text-deep-brown text-sm">{tag.address}</p>
                </div>
              )}

              {tag.contact && (
                <div className="mt-3">
                  <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                    Contact
                  </p>
                  <p className="text-deep-brown text-sm">{tag.contact}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-rust/10">
                <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-2">
                  Activated
                </p>
                <p className="text-sm text-charcoal/80">
                  {new Date(tag.activated_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleEdit(tag)}
                className="mt-4 w-full bg-rust/10 text-rust py-2 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-rust/20 transition-colors duration-300"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </main>

      {editingTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-md shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-rust/10">
              <h2 className="font-playfair text-2xl font-bold text-deep-brown">
                Edit Tag
              </h2>
            </div>

            <div className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                  Tag ID
                </label>
                <input
                  type="text"
                  value={editingTag.tag_id}
                  disabled
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-charcoal/10 text-charcoal/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={editingTag.status}
                  disabled
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-charcoal/10 text-charcoal/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-1">
                  Pet Name
                </label>
                <input
                  type="text"
                  value={editingTag.pet_name || ""}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, pet_name: e.target.value || null })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust"
                  placeholder="Enter pet name"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editingTag.address || ""}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, address: e.target.value || null })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-1">
                  Pet Status
                </label>
                <select
                  value={editingTag.pet_status || ""}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, pet_status: e.target.value || null })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust"
                >
                  <option value="">Select status</option>
                  <option value="🏠 Home">🏠 Home</option>
                  <option value="🎾 Play">🎾 Play</option>
                  <option value="🆘 Missing">🆘 Missing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={editingTag.contact || ""}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, contact: e.target.value || null })
                  }
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust"
                  placeholder="Phone number or email"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-1">
                  Photo
                </label>
                {editingTag.photo ? (
                  <div className="mb-3">
                    <img
                      src={editingTag.photo}
                      alt="Pet"
                      className="w-32 h-32 object-cover rounded-sm"
                    />
                  </div>
                ) : (
                  <div className="mb-3 w-32 h-32 bg-charcoal/10 rounded-sm flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-charcoal/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, editingTag.id)}
                  className="block w-full text-sm text-charcoal/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:text-xs file:font-medium file:tracking-widest file:uppercase file:bg-rust/10 file:text-rust file:border-0 file:cursor-pointer hover:file:bg-rust/20"
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-rust/10 flex gap-4">
              <button
                onClick={() => setEditingTag(null)}
                className="flex-1 bg-charcoal/10 text-charcoal py-3 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-charcoal/20 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-rust text-white py-3 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-mid-brown disabled:opacity-50 transition-colors duration-300"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};