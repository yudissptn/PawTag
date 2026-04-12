import { FC } from "react";

interface Stat {
  num: string;
  label: string;
}

export const StatsStrip: FC = () => {
  const stats: Stat[] = [
    { num: "1 in 3", label: "Pets go missing in their lifetime" },
    { num: "90%", label: "With ID are returned home safely" },
    { num: "2 sec", label: "Time to scan & see your info" },
    { num: "No App", label: "Required for the finder to scan" },
  ];

  return (
    <div id="stats" className="bg-deep-brown px-6 md:px-24 py-8 md:py-10 grid grid-cols-2 md:flex md:justify-between md:items-center gap-6 md:gap-0">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-center md:justify-start">
          <div className="text-center">
            <div className="font-playfair text-2xl md:text-4xl font-bold text-soft-gold leading-none">
              {stat.num}
            </div>
            <div className="text-xs tracking-widest uppercase text-white/60 mt-2">
              {stat.label}
            </div>
          </div>
          {index < stats.length - 1 && (
            <div className="hidden md:block w-px h-16 bg-white/15 ml-16"></div>
          )}
        </div>
      ))}
    </div>
  );
};
