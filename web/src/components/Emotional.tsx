import { FC } from "react";

export const Emotional: FC = () => {
  return (
    <section
      className="px-6 md:px-24 py-16 md:py-36 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
      id="story"
    >
      <div>
        <p className="text-xs tracking-widest uppercase text-rust font-medium mb-6 flex items-center gap-3">
          <span className="w-6 h-px bg-rust"></span>
          The moment every owner fears
        </p>
        <h2 className="font-playfair text-3xl md:text-4xl leading-snug font-bold mb-8 text-deep-brown">
          That sick feeling when you call their name — and silence answers back.
        </h2>
        <p className="font-lora text-base leading-loose text-mid-brown mb-6">
          Your pet isn't just an animal. They are your morning alarm, your
          stress relief, your loyal shadow. They are the reason you rush home.
          Losing them, even for an hour, is a terror no owner forgets.
        </p>
        <div className="border-l-3 border-rust px-7 py-5 my-10 bg-rust/5 rounded-r-md">
          <p className="font-playfair text-base md:text-lg italic text-deep-brown leading-relaxed">
            "I spent three days plastering posters, barely sleeping. You never
            realize how loud silence is until the one who always greeted you...
            doesn't."
          </p>
        </div>
        <p className="font-lora text-base leading-loose text-mid-brown">
          PawTag was born from exactly that fear. A slim, elegant NFC-equipped
          necklace that lets any smartphone — any passerby, any kind stranger —
          instantly see your contact details and address without downloading a
          single app. Because when every minute matters, technology should
          disappear and only the reunion should remain.
        </p>
      </div>
      <div className="relative">
        <div className="relative rounded-md overflow-hidden">
          <img
            className="w-full h-[300px] md:h-[500px] object-cover block"
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&q=90"
            alt="Woman hugging her dog tightly, eyes closed in relief"
          />
          <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 bg-white px-5 md:px-7 py-3 md:py-5 rounded-md shadow-xl">
            <div className="text-xs tracking-widest uppercase text-sage font-medium">
              Reunions Last Year
            </div>
            <div className="font-playfair text-lg md:text-xl font-bold text-deep-brown mt-1">
              12,400+ families
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
