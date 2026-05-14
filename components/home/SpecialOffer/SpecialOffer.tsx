"use client";

import Image from "next/image";

const SpecialOffer = () => {
  return (
    <div className="w-full bg-[#EFF2F6] py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left: Text & Timer */}
          <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
            <span className="text-gray-500 font-bold uppercase text-sm tracking-widest relative pl-8 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-6 before:h-[2px] before:bg-teal-400">
              Special Offer
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1a202c] leading-tight font-serif max-w-md">
              Minimal Lens Vision Bedside <br /> Stand Light
            </h2>
            <p className="text-teal-500 font-bold text-xl">Rs. 789.00</p>

            <div className="pt-8">
              <p className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wider">
                Hurry Up! Offer ends in:
              </p>
              <div className="flex space-x-3">
                {[
                  { value: "05", label: "DAYS" },
                  { value: "01", label: "HOURS" },
                  { value: "10", label: "MINS" },
                  { value: "30", label: "SEC" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded shadow-sm"
                  >
                    <span className="text-xl font-bold text-gray-900">
                      {item.value}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium tracking-wider">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0 relative">
            {/* Placeholder for Lamp Image from screenshot */}
            <div className="relative w-[400px] h-[500px]">
              <Image
                src="https://picsum.photos/id/119/600/800" // Modern Lamp
                alt="Special Offer Lamp"
                fill
                className="object-contain" // Contain to show full lamp shape
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
