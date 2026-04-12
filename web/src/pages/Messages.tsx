import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  user_id: number;
  name: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const Messages: FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/tags/messages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(() => setError("Failed to load messages"))
      .finally(() => setLoading(false));
  }, []);

  const handleBack = () => {
    navigate("/my-pet");
  };

  const handleMarkRead = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tags/messages/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, is_read: true });
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await handleMarkRead(msg.id);
    }
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 md:px-16 py-6 bg-cream/92 backdrop-blur-xl border-b border-rust/10">
        <button onClick={handleBack} className="flex items-center gap-2 text-deep-brown hover:text-rust transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
        <div className="font-playfair text-xl md:text-2xl font-bold text-rust tracking-tight">
          Messages
        </div>
        <div className="w-16"></div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {unreadCount > 0 && (
          <p className="text-sm text-charcoal/60 mb-4">{unreadCount} unread message{unreadCount !== 1 ? "s" : ""}</p>
        )}

        {loading && <p className="text-charcoal/60">Loading...</p>}
        {error && <p className="text-rust">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="text-charcoal/60">No messages found.</p>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              className={`p-4 rounded-md cursor-pointer transition-colors duration-300 ${
                msg.is_read
                  ? "bg-white border border-rust/10"
                  : "bg-rust/5 border border-rust/20"
              } hover:bg-rust/10`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-deep-brown">
                    {msg.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-charcoal/80 truncate mt-1">{msg.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!msg.is_read && (
                    <span className="w-2.5 h-2.5 bg-rust rounded-full"></span>
                  )}
                  <span className="text-xs text-charcoal/60">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-md shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl font-bold text-deep-brown">
                {selectedMessage.name || "Anonymous"}
              </h2>
              <button
                onClick={handleCloseDetail}
                className="text-charcoal/60 hover:text-charcoal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-charcoal/80 whitespace-pre-wrap">{selectedMessage.message}</p>
            <p className="text-xs text-charcoal/60 mt-4">
              {new Date(selectedMessage.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};