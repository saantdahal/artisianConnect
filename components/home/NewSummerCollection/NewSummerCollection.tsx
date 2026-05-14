"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

// Mock data based on screenshot
const products = [
  {
    id: 1,
    name: "Stand Light",
    price: "Rs. 60",
    image:
      "https://picsum.photos/id/160/600/600", // Floor Lamp
  },
  {
    id: 2,
    name: "Ceramic Vase",
    price: "Rs. 60",
    image:
      "https://picsum.photos/id/175/600/600", // Ceramic Vase
  },
  {
    id: 3,
    name: "Wooden Chair",
    price: "Rs. 60",
    image:
      "https://picsum.photos/id/169/600/600", // Wooden Stool/Chair
  },
];

const NewSummerCollection = () => {
  return (
    <div className="w-full bg-white py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Product Carousel */}
          <div className="relative">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-1/2 md:basis-1/2 lg:basis-1/2 pl-4"
                  >
                    <div className="flex flex-col group cursor-pointer">
                      <div className="relative bg-[#FAFAFA] aspect-[3/4] w-full mb-6 flex items-center justify-center">
                        <div className="relative w-3/4 h-3/4">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-900 font-bold text-lg">
                          {product.price}
                        </span>
                        <div className="flex text-gray-200">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-gray-900 font-bold text-lg">
                        {product.name}
                      </h3>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-[calc(50%+2rem)] w-10 h-10 rounded-full border-0 bg-gray-400/50 hover:bg-teal-400 text-white" />
              <CarouselNext className="absolute -right-4 top-1/2 -translate-y-[calc(50%+2rem)] w-10 h-10 rounded-full border-0 bg-gray-900 hover:bg-teal-400 text-white" />
            </Carousel>
          </div>

          {/* Right Side: Text Content */}
          <div className="flex flex-col items-start space-y-8 lg:pl-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a202c] leading-tight font-serif">
              New Summer <br /> Collection of 2019
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Road, intermixing without horn ran my we finally, changes upright,
              out it would on lady guest have right, design they which came
              could structure a made.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                className="rounded-none border border-gray-400 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white px-10 py-6 uppercase tracking-wider text-xs font-bold transition-all min-w-[160px]"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSummerCollection;
