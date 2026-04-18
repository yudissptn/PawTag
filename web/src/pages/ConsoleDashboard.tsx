import { FC } from "react";
import { NavLink, Outlet } from "react-router-dom";

export const ConsoleDashboard: FC = () => {
  const tabs = [
    { to: "/console-root/dashboard/overview", label: "Overview" },
    { to: "/console-root/dashboard/users", label: "Users" },
    { to: "/console-root/dashboard/tags", label: "Tags" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 bg-cream border-b border-rust/10">
        <h1 className="font-playfair text-xl font-bold text-deep-brown tracking-tight">
          PawTag Console
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              const token = localStorage.getItem("token");
              await fetch(`${import.meta.env.VITE_API_URL}/console/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });
              localStorage.removeItem("token");
              window.location.href = "/console-root";
            }}
            className="bg-rust text-white px-6 py-2 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-mid-brown transition-colors duration-300"
          >
            Logout
          </button>
          <div className="w-10 h-10 rounded-full bg-deep-brown flex items-center justify-center">
            <svg
              className="w-5 h-5 text-cream"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>
      </nav>

      <div className="px-6 md:px-16 pt-8">
        <div className="flex gap-1 border-b border-rust/10">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-6 py-3 text-sm font-medium tracking-widest uppercase transition-colors duration-300 border-b-2 -mb-px ${
                  isActive
                    ? "text-rust border-rust"
                    : "text-mid-brown border-transparent hover:text-deep-brown"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-16 py-10">
        <Outlet />
      </div>
    </div>
  );
};
