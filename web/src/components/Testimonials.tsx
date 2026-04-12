import { FC } from "react";

interface Testimonial {
  quote: string;
  name: string;
  pet: string;
  avatar: string;
}

export const Testimonials: FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote:
        "Mochi escaped during a thunderstorm. I was shaking. Someone found him two blocks away, tapped the tag, and called me in minutes. I cannot express what that moment felt like.",
      name: "Sarah T.",
      pet: "Owner of Mochi, Shih Tzu",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    },
    {
      quote:
        "Remy slipped out of the backyard. No microchip scanner nearby, but the kind lady who found him just tapped his PawTag. She was on the phone with me 30 seconds later.",
      name: "James W.",
      pet: "Owner of Remy, Labrador",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    {
      quote:
        "As a vet, I recommend PawTag to every single client. Microchips require a scanner. NFC requires nothing. It's the most practical piece of pet safety I've seen.",
      name: "Dr. Anika R.",
      pet: "Veterinarian, 12 years",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80",
    },
  ];

  return (
    <section className="px-6 md:px-24 py-20 md:py-32 bg-deep-brown" id="reviews">
      <div className="text-center mb-12 md:mb-20">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-soft-gold">
          Stories of reunion.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white/6 border border-white/10 rounded-md px-8 md:px-10 py-8 md:py-10 hover:bg-white/9 transition-colors duration-300"
          >
            <div className="text-soft-gold tracking-widest text-sm mb-4">
              ★★★★★
            </div>
            <p className="font-lora italic text-base leading-loose text-white/[0.82] mb-8">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-4">
              <img
                className="w-11 h-11 rounded-full object-cover border-2 border-soft-gold/40"
                src={testimonial.avatar}
                alt={testimonial.name}
              />
              <div>
                <div className="font-medium text-white text-sm">
                  {testimonial.name}
                </div>
                <div className="text-xs text-white/50">{testimonial.pet}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
