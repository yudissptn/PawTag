import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

export const PetDetails: FC = () => {
  const { tagId } = useParams<{ tagId: string }>();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`/api/tags/public/${tagId}`)
      .then((res) => res.json())
      .then((data) => {
        setTag(data.tag);
      })
      .catch(() => setError("Failed to load tag"))
      .finally(() => setLoading(false));
  }, [tagId]);

  const isMissing = tag?.pet_status?.includes("Missing");

  const handleOpenDialog = () => {
    const petName = tag?.pet_name || "your pet";
    setMessage(`Hi, I found ${petName} at ...`);
    setShowDialog(true);
  };

  const handleSend = async () => {
    if (!tag?.owner_id) {
      setErrorMessage("Cannot send message - no owner found for this tag");
      return;
    }
    setSending(true);

    try {
      const res = await fetch("/api/tags/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: tag.owner_id,
          name: senderName || null,
          message,
        }),
      });

      if (res.ok) {
        setSuccessMessage("Message sent to owner!");
        setTimeout(() => {
          setShowDialog(false);
          setMessage("");
          setSenderName("");
          setSuccessMessage("");
        }, 1500);
      } else {
        setErrorMessage("Failed to send message");
      }
    } catch (err) {
      console.error("Send message error:", err);
      setErrorMessage("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-charcoal/60">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-rust">{error}</p>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-2xl text-deep-brown mb-2">No Tag Found</h1>
          <p className="text-charcoal/60">This tag does not exist or has been archived.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-md shadow-lg border border-rust/10 p-8">
          {tag.photo ? (
            <img
              src={tag.photo}
              alt={tag.pet_name || "Pet"}
              className="w-full h-48 object-cover rounded-sm mb-6"
            />
          ) : (
            <div className="w-full h-48 bg-charcoal/10 rounded-sm mb-6 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-charcoal/30"
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

          <div className="text-center mb-6">
            <h1 className="font-playfair text-3xl font-bold text-deep-brown">
              {tag.pet_name || "Beloved Pet"}
            </h1>
            {tag.pet_status && (
              <p className="text-charcoal/60 mt-2">{tag.pet_status}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="py-4 border-t border-b border-rust/10">
              <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                Tag ID
              </p>
              <p className="font-playfair text-xl text-deep-brown font-bold">
                {tag.tag_id}
              </p>
            </div>

            {tag.address && (
              <div className="py-4 border-b border-rust/10">
                <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                  Address
                </p>
                <p className="text-charcoal/80">{tag.address}</p>
              </div>
            )}

            {tag.contact && (
              <div className="py-4 border-b border-rust/10">
                <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                  Contact
                </p>
                <p className="text-charcoal/800">{tag.contact}</p>
              </div>
            )}

            <div className="py-4">
              <p className="text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                Activated
              </p>
              <p className="text-charcoal/80">
                {new Date(tag.activated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {isMissing && (
            <div className="mt-6">
              <button
                onClick={handleOpenDialog}
                className="w-full bg-rust text-white py-3 rounded-sm text-sm font-medium tracking-widest uppercase hover:bg-mid-brown transition-colors duration-300"
              >
                Send Owner Message
              </button>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-rust/10">
            <p className="font-playfair text-sm text-charcoal/60 italic text-center">
              Protected by PawTag
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-charcoal/60 text-sm">
          <a href="/" className="text-rust hover:underline">Return to Home</a>
        </p>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-md shadow-xl max-w-lg w-full p-6">
            <h2 className="font-playfair text-2xl font-bold text-deep-brown mb-4">
              Send Message to Owner
            </h2>
            <div className="mb-4">
              <label className="block text-xs tracking-widest uppercase text-charcoal/60 mb-1">
                Your Name (optional)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust"
                placeholder="Anonymous"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust h-40 resize-none"
            />
            {successMessage && (
              <div className="mt-4 px-4 py-3 rounded-sm bg-green-100 border border-green-200 text-green-800 text-sm">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 px-4 py-3 rounded-sm bg-rust/10 border border-rust/20 text-rust text-sm">
                {errorMessage}
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className="flex-1 bg-charcoal/10 text-charcoal py-3 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-charcoal/20 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex-1 bg-rust text-white py-3 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-mid-brown disabled:opacity-50 transition-colors duration-300"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};