import { FC, useEffect, useState } from "react";

export const Navbar: FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const darkIds = ["stats", "reviews", "cta", "footer"];
    const handleScroll = () => {
      const navbarHeight = 80;
      const scrollY = window.scrollY + navbarHeight;
      let overDark = false;

      for (const id of darkIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            overDark = true;
            break;
          }
        }
      }

      setIsDark(overDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textClass = isDark ? "text-white/80 hover:text-soft-gold" : "text-charcoal hover:text-rust";
  const logoClass = isDark ? "text-soft-gold" : "text-rust";
  const bgClass = isDark ? "bg-deep-brown/80" : "bg-cream/92";
  const borderClass = isDark ? "border-white/10" : "border-rust/10";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-6 ${bgClass} backdrop-blur-xl border-b ${borderClass} transition-colors duration-300`}>
      <div className={`font-playfair text-xl md:text-2xl font-bold ${logoClass} tracking-tight`}>
        PawTag
      </div>

      <ul className="hidden md:flex gap-10 list-none">
        <li>
          <a
            href="#how"
            className={`text-sm font-medium tracking-widest uppercase ${textClass} transition-colors duration-300`}
          >
            How It Works
          </a>
        </li>
        <li>
          <a
            href="#story"
            className={`text-sm font-medium tracking-widest uppercase ${textClass} transition-colors duration-300`}
          >
            Our Story
          </a>
        </li>
        <li>
          <a
            href="#reviews"
            className={`text-sm font-medium tracking-widest uppercase ${textClass} transition-colors duration-300`}
          >
            Reviews
          </a>
        </li>
      </ul>

      <div className="hidden md:flex items-center gap-4">
        <a
          href="/login"
          className={`text-xs font-medium tracking-widest uppercase no-underline ${textClass} transition-colors duration-300`}
        >
          Login
        </a>
        <a
          href="#order"
          className="bg-rust text-white px-7 py-3 rounded-sm text-xs font-medium tracking-widest uppercase no-underline hover:bg-mid-brown transition-colors duration-300"
        >
          Order Now
        </a>
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 ${isDark ? "text-white" : "text-deep-brown"}`}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? "bg-white" : "bg-deep-brown"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? "bg-white" : "bg-deep-brown"} ${menuOpen ? "opacity-0" : ""}`}></span>
        <span className={`block w-6 h-0.5 transition-all duration-300 ${isDark ? "bg-white" : "bg-deep-brown"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>

      {menuOpen && (
        <div className={`absolute top-full left-0 right-0 md:hidden ${bgClass} backdrop-blur-xl border-b ${borderClass} px-6 py-6 flex flex-col gap-4`}>
          <a
            href="#how"
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-medium tracking-widest uppercase ${textClass} transition-colors duration-300`}
          >
            How It Works
          </a>
          <a
            href="#story"
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-medium tracking-widest uppercase ${textClass} transition-colors duration-300`}
          >
            Our Story
          </a>
          <a
            href="#reviews"
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-medium tracking-widest uppercase ${textClass} transition-colors duration-300`}
          >
            Reviews
          </a>
          <a
            href="/login"
            onClick={() => setMenuOpen(false)}
            className={`text-xs font-medium tracking-widest uppercase no-underline text-center ${textClass} transition-colors duration-300`}
          >
            Login
          </a>
          <a
            href="#order"
            onClick={() => setMenuOpen(false)}
            className="bg-rust text-white px-7 py-3 rounded-sm text-xs font-medium tracking-widest uppercase no-underline text-center hover:bg-mid-brown transition-colors duration-300"
          >
            Order Now
          </a>
        </div>
      )}
    </nav>
  );
};
