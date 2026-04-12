import { FC, FormEvent, useEffect, useState } from "react";

interface TagRow {
  id: number;
  tag_id: string;
  pet_name: string;
  owner_id: number;
  owner_name: string;
  status: string;
  archived: boolean;
  activated_at: string;
}

interface Owner {
  id: number;
  name: string;
}

const TAGS_API = "/api/tags";
const USERS_API = "/api/users";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const generateTagId = () => {
  const chars = "0123456789ABCDEF";
  let result = "PT-";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const ConsoleTags: FC = () => {
  const [tags, setTags] = useState<TagRow[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [tagId, setTagId] = useState("");
  const [petName, setPetName] = useState("");
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [status, setStatus] = useState("Active");

  const fetchData = async () => {
    try {
      const [tagsRes, usersRes] = await Promise.all([
        fetch(TAGS_API, { headers: authHeaders() }),
        fetch(USERS_API, { headers: authHeaders() }),
      ]);

      if (!tagsRes.ok || !usersRes.ok) throw new Error("Failed to load data");

      const tagsData = await tagsRes.json();
      const usersData = await usersRes.json();

      setTags(tagsData.tags);
      setOwners(
        usersData.users
          .filter((u: { archived: boolean }) => !u.archived)
          .map((u: { id: number; name: string }) => ({ id: u.id, name: u.name }))
      );
    } catch {
      setError("Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeTags = tags.filter((t) => !t.archived);
  const archivedTags = tags.filter((t) => t.archived);

  const openCreateDialog = () => {
    setEditingTagId(null);
    setTagId(generateTagId());
    setPetName("");
    setSelectedOwnerId("");
    setStatus("Active");
    setError("");
    setDialogOpen(true);
  };

  const openEditDialog = (tag: TagRow) => {
    setEditingTagId(tag.id);
    setTagId(tag.tag_id);
    setPetName(tag.pet_name || "");
    setSelectedOwnerId(tag.owner_id ? String(tag.owner_id) : "");
    setStatus(tag.status);
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTagId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const body = {
      tag_id: tagId,
      pet_name: petName,
      owner_id: Number(selectedOwnerId),
      status,
    };

    try {
      if (editingTagId !== null) {
        const res = await fetch(`${TAGS_API}/${editingTagId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to update tag");
          return;
        }
      } else {
        const res = await fetch(TAGS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to create tag");
          return;
        }
      }

      await fetchData();
      closeDialog();
    } catch {
      setError("Unable to connect to server");
    }
  };

  const handleArchive = async (id: number, archived: boolean) => {
    try {
      await fetch(`${TAGS_API}/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ archived }),
      });
      await fetchData();
    } catch {
      setError("Unable to connect to server");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-mid-brown">Loading tags...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-playfair text-2xl font-bold text-deep-brown">
          Tags
        </h2>
        <button
          onClick={openCreateDialog}
          className="bg-rust text-white px-6 py-2.5 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-mid-brown transition-colors duration-300"
        >
          Add Tag
        </button>
      </div>

      {error && !dialogOpen && (
        <div className="mb-6 px-4 py-3 rounded-sm bg-rust/10 border border-rust/20 text-rust text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-rust/10 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-rust/10">
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Tag ID</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Pet Name</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Owner</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Activated</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Status</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTags.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-mid-brown">
                    No tags yet.
                  </td>
                </tr>
              ) : (
                activeTags.map((tag) => (
                  <tr key={tag.id} className="border-b border-rust/5 last:border-b-0 hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-deep-brown font-mono">{tag.tag_id}</td>
                    <td className="px-6 py-4 text-sm text-deep-brown font-medium">{tag.pet_name}</td>
                    <td className="px-6 py-4 text-sm text-mid-brown">{tag.owner_name}</td>
                    <td className="px-6 py-4 text-sm text-mid-brown">{formatDate(tag.activated_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full ${tag.status === "Active" ? "bg-sage/15 text-sage" : "bg-charcoal/10 text-charcoal"}`}>
                        {tag.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEditDialog(tag)}
                          className="text-xs font-medium tracking-widest uppercase text-rust hover:text-mid-brown transition-colors"
                        >
                          Edit
                        </button>
                        <span className="text-charcoal/20">|</span>
                        <button
                          onClick={() => handleArchive(tag.id, true)}
                          className="text-xs font-medium tracking-widest uppercase text-charcoal/50 hover:text-deep-brown transition-colors"
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {archivedTags.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xs tracking-widest uppercase text-mid-brown font-medium mb-4">
            Archived
          </h3>
          <div className="bg-white border border-rust/10 rounded-md overflow-hidden opacity-60">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-rust/10">
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Tag ID</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Pet Name</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Owner</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Activated</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Status</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedTags.map((tag) => (
                    <tr key={tag.id} className="border-b border-rust/5 last:border-b-0">
                      <td className="px-6 py-4 text-sm text-deep-brown font-mono">{tag.tag_id}</td>
                      <td className="px-6 py-4 text-sm text-deep-brown font-medium">{tag.pet_name}</td>
                      <td className="px-6 py-4 text-sm text-mid-brown">{tag.owner_name}</td>
                      <td className="px-6 py-4 text-sm text-mid-brown">{formatDate(tag.activated_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full ${tag.status === "Active" ? "bg-sage/15 text-sage" : "bg-charcoal/10 text-charcoal"}`}>
                          {tag.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleArchive(tag.id, false)}
                            className="text-xs font-medium tracking-widest uppercase text-sage hover:text-deep-brown transition-colors"
                          >
                            Restore
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-brown/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl border border-rust/10 w-full max-w-md mx-6">
            <div className="flex items-center justify-between px-8 py-6 border-b border-rust/10">
              <h3 className="font-playfair text-xl font-bold text-deep-brown">
                {editingTagId !== null ? "Edit Tag" : "Add Tag"}
              </h3>
              <button
                onClick={closeDialog}
                className="text-mid-brown hover:text-deep-brown transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-8 py-6">
              {error && (
                <div className="mb-5 px-4 py-3 rounded-sm bg-rust/10 border border-rust/20 text-rust text-sm">
                  {error}
                </div>
              )}
              <div className="mb-5">
                <label htmlFor="tag-id" className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Tag ID
                </label>
                <input
                  id="tag-id"
                  type="text"
                  value={tagId}
                  onChange={(e) => setTagId(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm font-mono focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
                  placeholder="PT-XXXXXX"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="pet-name" className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Pet Name
                </label>
                <input
                  id="pet-name"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
                  placeholder="Pet name"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="tag-owner" className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Owner
                </label>
                <select
                  id="tag-owner"
                  value={selectedOwnerId}
                  onChange={(e) => setSelectedOwnerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
                >
                  <option value="">No owner</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-8">
                <label htmlFor="tag-status" className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Status
                </label>
                <select
                  id="tag-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-6 py-2.5 rounded-sm text-xs font-medium tracking-widest uppercase text-mid-brown border border-charcoal/20 hover:bg-cream transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rust text-white px-6 py-2.5 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-mid-brown transition-colors duration-300"
                >
                  {editingTagId !== null ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
