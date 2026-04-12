import { FC } from "react";

export const Hero: FC = () => {
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-20 relative overflow-hidden">
      <div className="flex flex-col justify-center px-6 md:px-16 md:pl-24 py-16 md:py-24 relative z-10">
        <p className="font-dm text-xs font-medium tracking-widest uppercase text-rust mb-6 flex items-center gap-3 animate-fade-up">
          <span className="w-8 h-px bg-rust block"></span>
          The Smart Pet Necklace
        </p>
        <h1 className="font-playfair text-4xl md:text-6xl leading-tight font-black text-deep-brown mb-6 tracking-tight animate-fade-up-delay-1">
          They can't
          <br />
          tell you where
          <br />
          they are.
          <br />
          <em className="italic text-rust">
            Now they don't
            <br />
            have to.
          </em>
        </h1>
        <p className="font-lora text-base md:text-lg leading-relaxed text-mid-brown max-w-md mb-8 md:mb-12 animate-fade-up-delay-2">
          A single tap. Your contact. Your address. In the hands of whoever
          finds your lost love — instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center animate-fade-up-delay-3">
          <a
            href="#order"
            className="bg-rust text-white px-10 py-4 rounded-sm text-sm font-medium tracking-widest uppercase no-underline border-2 border-rust hover:bg-transparent hover:text-rust transition-all duration-300"
          >
            Protect My Pet
          </a>
          <a
            href="#how"
            className="text-mid-brown text-sm no-underline flex items-center gap-2 font-lora italic hover:text-rust transition-colors duration-300"
          >
            See how it works
            <span className="not-italic">→</span>
          </a>
        </div>
      </div>
      <div className="relative overflow-hidden h-64 md:h-auto">
        <img
          className="w-full h-full object-cover object-center-top block"
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=90"
          alt="Golden retriever wearing a necklace, looking up lovingly"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-cream via-transparent to-transparent"></div>
      </div>
    </section>
  );
};
