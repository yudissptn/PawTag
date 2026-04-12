import { FC } from "react";

interface Step {
  num: string;
  title: string;
  desc: string;
}

export const HowItWorks: FC = () => {
  const steps: Step[] = [
    {
      num: "1",
      title: "Pet Wears PawTag",
      desc: "Your pet wears our beautifully crafted NFC necklace. Lightweight, waterproof, and designed to match any coat or fur.",
    },
    {
      num: "2",
      title: "Stranger Finds & Scans",
      desc: "Anyone with a smartphone taps the tag. Their phone opens your pet's profile page instantly — no app needed, no friction.",
    },
    {
      num: "3",
      title: "You Get the Call",
      desc: "They see your name, photo, phone number, and home address. One tap to call you. Your pet is already on the way home.",
    },
  ];

  return (
    <section className="px-6 md:px-24 py-20 md:py-32 bg-warm-white" id="how">
      <div className="text-center mb-12 md:mb-20">
        <p className="text-xs tracking-widest uppercase text-rust font-medium flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-px bg-rust"></span>
          Simple. Instant. Reliable.
        </p>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-deep-brown mb-4">
          From lost — to found — in three steps.
        </h2>
        <p className="font-lora italic text-base text-mid-brown">
          No app. No password. No waiting.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
        <div
          className="hidden md:block absolute top-14 left-[15%] right-[15%] h-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #c4502a 0, #c4502a 6px, transparent 6px, transparent 14px)",
          }}
        ></div>
        {steps.map((step, index) => (
          <div key={index} className="text-center relative">
            <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-rust mx-auto mb-6 md:mb-8 flex items-center justify-center font-playfair text-xl md:text-2xl text-white font-bold relative z-10">
              {step.num}
            </div>
            <h3 className="font-playfair text-lg md:text-xl font-bold text-deep-brown mb-3">
              {step.title}
            </h3>
            <p className="font-lora text-sm leading-loose text-mid-brown">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
