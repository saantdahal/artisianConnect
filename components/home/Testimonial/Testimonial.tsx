"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "He this him it conduct, the suppose their if she is cold wanted undertaking, shall must the out examples, wanted which would retired taking arranged the personalities occasion one of the dense, be crew have phase her her. Presented I to for a thoughts day when derived",
    name: "Mirja Khan",
    role: "Customer",
    image: "https://picsum.photos/id/64/200/200"
  },
  {
    text: "The selection of artisanal goods is unparalleled. I've found so many unique pieces that add character to my home. The quality is exceptional, and I love knowing that I'm supporting independent creators around the world.",
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    image: "https://picsum.photos/id/65/200/200"
  },
  {
    text: "Shopping here has been a revelation. Shipping is fast, the packaging is beautiful and eco-friendly, and the customer service goes above and beyond to ensure you are completely satisfied with your purchase.",
    name: "David Chen",
    role: "Customer",
    image: "https://picsum.photos/id/66/200/200"
  }
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#EFF2F6] dark:bg-muted/30 py-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="relative inline-block min-h-[120px]">
          {/* Opening Quote */}
          <Quote className="absolute -top-8 -left-12 w-12 h-12 text-[#9dabc0] fill-current opacity-50 transform -scale-x-100" />

          {/* Testimonial Text with Fade transition */}
          <div className="relative flex justify-center items-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 flex items-center justify-center w-full ${
                  index === activeIndex
                    ? "opacity-100 relative"
                    : "opacity-0 absolute pointer-events-none"
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-8 tracking-wide px-8">
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>

          {/* Closing Quote */}
           <div className="absolute -bottom-8 -right-12">
               <Quote className="w-12 h-12 text-[#9dabc0] fill-current opacity-50" />
           </div>
        </div>

        {/* Profile */}
        <div className="mt-16 relative h-24 flex flex-col items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center space-y-3 transition-opacity duration-500 ${
                index === activeIndex
                  ? "opacity-100 absolute"
                  : "opacity-0 absolute pointer-events-none"
              }`}
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                  {testimonial.name}
                </h4>
                <p className="text-gray-400 text-xs">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex
                  ? "bg-teal-500"
                  : "bg-gray-300 hover:bg-teal-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
