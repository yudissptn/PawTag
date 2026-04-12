import { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ConsoleLogin: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/console/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/console-root/dashboard");
    } catch {
      setError("Unable to connect to server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-3xl font-bold text-deep-brown tracking-tight">
            PawTag
          </h1>
          <p className="text-xs tracking-widest uppercase text-rust font-medium mt-2">
            Admin Console
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md shadow-lg border border-rust/10 px-10 py-10"
        >
          {error && (
            <div className="mb-6 px-4 py-3 rounded-sm bg-rust/10 border border-rust/20 text-rust text-sm">
              {error}
            </div>
          )}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
              placeholder="admin@pawtag.com"
              required
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-xs tracking-widest uppercase text-deep-brown font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-sm border border-charcoal/20 bg-cream/50 text-deep-brown text-sm focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust transition-colors duration-300"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rust text-white py-3 rounded-sm text-sm font-medium tracking-widest uppercase hover:bg-mid-brown disabled:opacity-50 transition-colors duration-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
