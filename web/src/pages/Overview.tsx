import { FC } from "react";
import { Navigate } from "react-router-dom";

export const ConsoleOverview: FC = () => {
  const stats = [
    { label: "Total Users", value: "2,847", change: "+12%" },
    { label: "Total Tags", value: "5,231", change: "+8%" },
  ];

  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold text-deep-brown mb-8">
        Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-rust/10 rounded-md px-8 py-8"
          >
            <p className="text-xs tracking-widest uppercase text-mid-brown font-medium mb-2">
              {stat.label}
            </p>
            <div className="flex items-end gap-3">
              <span className="font-playfair text-4xl font-bold text-deep-brown">
                {stat.value}
              </span>
              <span className="text-sm text-sage font-medium mb-1">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OverviewRedirect: FC = () => {
  return <Navigate to="/console-root/dashboard/overview" replace />;
};
