import { FC } from "react";

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export const Product: FC = () => {
  const features: Feature[] = [
    {
      icon: "📡",
      title: "NFC Technology",
      desc: "Works with any iPhone or Android — no app download required.",
    },
    {
      icon: "💧",
      title: "Waterproof",
      desc: "Rated IP68. Bath time, rain, rivers — no problem.",
    },
    {
      icon: "✏️",
      title: "Editable Profile",
      desc: "Update address or phone anytime from your dashboard.",
    },
    {
      icon: "🔋",
      title: "No Battery",
      desc: "Passive NFC — works forever, no charging ever needed.",
    },
  ];

  return (
    <section
      className="px-6 md:px-24 py-16 md:py-36 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
      id="order"
    >
      <div className="relative flex justify-center order-1 md:order-none">
        <div
          className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(212, 130, 58, 0.12) 0%, transparent 70%)",
          }}
        ></div>
        <img
          className="w-[240px] h-[240px] md:w-[380px] md:h-[380px] object-cover rounded-full relative z-10 shadow-2xl border-4 md:border-6 border-white"
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=90"
          alt="Two dogs running together"
        />
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase text-rust font-medium mb-6 flex items-center gap-3">
          <span className="w-6 h-px bg-rust"></span>
          The PawTag Necklace
        </p>
        <h2 className="font-playfair text-3xl md:text-4xl leading-snug font-bold mb-8 text-deep-brown">
          Designed for them.
          <br />
          Built for your peace of mind.
        </h2>
        <p className="font-lora text-base leading-loose text-mid-brown mb-10">
          Crafted from marine-grade stainless steel with a premium leather cord.
          Water-resistant, chew-resistant, and beautiful enough to match any
          collar.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rust/10 flex-shrink-0 flex items-center justify-center text-base">
                {feature.icon}
              </div>
              <div>
                <div className="font-semibold text-sm text-deep-brown">
                  {feature.title}
                </div>
                <div className="text-xs text-mid-brown mt-1 leading-relaxed">
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
