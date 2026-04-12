import { FC } from "react";

export const CTA: FC = () => {
  return (
    <section
      id="cta"
      className="px-6 md:px-24 py-20 md:py-32 text-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #c4502a 0%, #8b3220 50%, #2c1810 100%)",
      }}
    >
      <div
        className="absolute top-[-50%] left-[-20%] w-[60%] h-[200%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255, 255, 255, 0.06) 0%, transparent 60%)",
        }}
      ></div>
      <p className="text-xs tracking-widest uppercase text-white/60 mb-6">
        Start protecting today
      </p>
      <h2 className="font-playfair text-3xl md:text-5xl font-black text-white leading-tight mb-6">
        Don't wait for the moment
        <br />
        you can't take back.
      </h2>
      <p className="font-lora italic text-base md:text-lg text-white/75 max-w-lg mx-auto mb-12 leading-loose">
        Give your pet the tag that brings them home. Give yourself the peace you
        deserve.
      </p>
      <span className="font-playfair text-4xl md:text-5xl font-bold text-soft-gold block mb-2">
        $29
      </span>
      <p className="text-sm text-white/60 mb-10">
        Free shipping · 30-day happiness guarantee
      </p>
      <a
        href="#"
        className="inline-block bg-white text-rust px-12 md:px-16 py-5 rounded-sm text-sm md:text-base font-bold tracking-widest uppercase no-underline hover:bg-soft-gold hover:text-deep-brown transition-all duration-300"
      >
        Get PawTag Now
      </a>
    </section>
  );
};
