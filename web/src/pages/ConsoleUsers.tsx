import { FC, FormEvent, useEffect, useState } from "react";

interface UserRow {
  id: number;
  name: string;
  email: string;
  created_at: string;
  archived: boolean;
}

interface TagRow {
  id: number;
  tag_id: string;
  pet_name: string;
  owner_id: number | null;
  archived: boolean;
}

const USERS_API = "/api/users";
const TAGS_API = "/api/tags";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ConsoleUsers: FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [tags, setTags] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      const [usersRes, tagsRes] = await Promise.all([
        fetch(USERS_API, { headers: authHeaders() }),
        fetch(TAGS_API, { headers: authHeaders() }),
      ]);
      if (!usersRes.ok || !tagsRes.ok) throw new Error("Failed to load data");
      const usersData = await usersRes.json();
      const tagsData = await tagsRes.json();
      setUsers(usersData.users);
      setTags(tagsData.tags);
    } catch {
      setError("Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeUsers = users.filter((u) => !u.archived);
  const archivedUsers = users.filter((u) => u.archived);

  const availableTags = tags.filter((t) => !t.archived);

  const getUserTagIds = (userId: number) =>
    tags.filter((t) => t.owner_id === userId && !t.archived).map((t) => t.id);

  const openCreateDialog = () => {
    setEditingUserId(null);
    setName("");
    setEmail("");
    setPassword("");
    setSelectedTagIds([]);
    setError("");
    setDialogOpen(true);
  };

  const openEditDialog = (user: UserRow) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setSelectedTagIds(getUserTagIds(user.id));
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingUserId(null);
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const updateTagOwnerships = async (userId: number) => {
    const userTagIds = getUserTagIds(userId);

    const toAssign = selectedTagIds.filter((id) => !userTagIds.includes(id));
    const toUnassign = userTagIds.filter((id) => !selectedTagIds.includes(id));

    const updates = [
      ...toAssign.map((tagId) => {
        const tag = tags.find((t) => t.id === tagId)!;
        return fetch(`${TAGS_API}/${tagId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            tag_id: tag.tag_id,
            pet_name: tag.pet_name,
            owner_id: userId,
            status: tag.status,
          }),
        });
      }),
      ...toUnassign.map((tagId) => {
        const tag = tags.find((t) => t.id === tagId)!;
        return fetch(`${TAGS_API}/${tagId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            tag_id: tag.tag_id,
            pet_name: tag.pet_name,
            owner_id: null,
            status: tag.status,
          }),
        });
      }),
    ];

    await Promise.all(updates);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let userId = editingUserId;

      if (editingUserId !== null) {
        const body: Record<string, string> = { name, email };
        if (password) body.password = password;
        const res = await fetch(`${USERS_API}/${editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to update user");
          return;
        }
      } else {
        const res = await fetch(USERS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to create user");
          return;
        }
        const data = await res.json();
        userId = data.user.id;
      }

      if (userId !== null) {
        await updateTagOwnerships(userId);
      }

      await fetchData();
      closeDialog();
    } catch {
      setError("Unable to connect to server");
    }
  };

  const handleArchive = async (userId: number, archived: boolean) => {
    try {
      await fetch(`${USERS_API}/${userId}/archive`, {
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
        <p className="text-mid-brown">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-playfair text-2xl font-bold text-deep-brown">
          Users
        </h2>
        <button
          onClick={openCreateDialog}
          className="bg-rust text-white px-6 py-2.5 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-mid-brown transition-colors duration-300"
        >
          Create User
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
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Name</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Email</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Joined</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Tags</th>
                <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-mid-brown">
                    No users yet.
                  </td>
                </tr>
              ) : (
                activeUsers.map((user) => (
                  <tr key={user.id} className="border-b border-rust/5 last:border-b-0 hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-deep-brown font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-mid-brown">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-mid-brown">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {getUserTagIds(user.id).length === 0 ? (
                          <span className="text-xs text-mid-brown">—</span>
                        ) : (
                          tags
                            .filter((t) => t.owner_id === user.id && !t.archived)
                            .map((tag) => (
                              <span key={tag.id} className="text-xs bg-cream border border-charcoal/10 px-2 py-0.5 rounded font-mono text-mid-brown">
                                {tag.tag_id}
                              </span>
                            ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEditDialog(user)}
                          className="text-xs font-medium tracking-widest uppercase text-rust hover:text-mid-brown transition-colors"
                        >
                          Edit
                        </button>
                        <span className="text-charcoal/20">|</span>
                        <button
                          onClick={() => handleArchive(user.id, true)}
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

      {archivedUsers.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xs tracking-widest uppercase text-mid-brown font-medium mb-4">
            Archived
          </h3>
          <div className="bg-white border border-rust/10 rounded-md overflow-hidden opacity-60">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-rust/10">
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Name</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Email</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium">Joined</th>
                    <th className="px-6 py-4 text-xs tracking-widest uppercase text-mid-brown font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-rust/5 last:border-b-0">
                      <td className="px-6 py-4 text-sm text-deep-brown font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-mid-brown">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-mid-brown">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleArchive(user.id, false)}
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
          <div className="bg-white rounded-md shadow-xl border border-rust/10 w-full max-w-md mx-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-rust/10">
              <h3 className="font-playfair text-xl font-bold text-deep-brown">
                {editingUserId !== null ? "Edit User" : "Create User"}
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
                <label htmlFor="user-name" className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Name
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="user-email" className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
                  placeholder="user@email.com"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="user-password" className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Password
                </label>
                <input
                  id="user-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
                  placeholder={editingUserId !== null ? "Leave blank to keep current" : "••••••••"}
                  required={editingUserId === null}
                />
              </div>
              <div className="mb-8">
                <label className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2">
                  Tags
                </label>
                <div className="border border-charcoal/20 rounded-sm bg-cream/50 max-h-40 overflow-y-auto">
                  {availableTags.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-mid-brown">No available tags.</p>
                  ) : (
                    availableTags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-cream transition-colors border-b border-charcoal/5 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTagIds.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                          className="w-4 h-4 accent-rust rounded"
                        />
                        <span className="text-sm text-deep-brown font-mono">{tag.tag_id}</span>
                        <span className="text-sm text-mid-brown">({tag.pet_name})</span>
                      </label>
                    ))
                  )}
                </div>
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
                  {editingUserId !== null ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
