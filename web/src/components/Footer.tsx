import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer id="footer" className="bg-charcoal px-6 md:px-24 py-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
      <div className="font-playfair text-xl text-cream font-bold">PawTag</div>
      <p className="text-xs text-white/40 text-center md:text-left">
        © 2025 PawTag. Made with love for every pet and the humans who love
        them.
      </p>
      <div className="flex gap-6">
        <a
          href="#"
          className="text-xs text-white/40 no-underline hover:text-white/60 transition-colors duration-300"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-xs text-white/40 no-underline hover:text-white/60 transition-colors duration-300"
        >
          Terms
        </a>
        <a
          href="#"
          className="text-xs text-white/40 no-underline hover:text-white/60 transition-colors duration-300"
        >
          Contact
        </a>
      </div>
    </footer>
  );
};
