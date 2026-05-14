"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

// Fallback static data for the hero slide
const staticSlides = [
  {
    id: 1,
    subtitle: "Wood, Collection",
    title: "KRQ Solid Wood Collection",
    image: "https://picsum.photos/id/116/800/800", // Minimalist wooden chair
    description: "Experience the premium quality of our solid wood collection.",
  },
  {
    id: 2,
    subtitle: "New, Arrival",
    title: "Minimalist Lounge Chair",
    image: "https://picsum.photos/id/117/800/800", // Lounge Chair
    description: "Discover the comfort of modern minimalist design.",
  },
  {
    id: 3,
    subtitle: "Best, Seller",
    title: "Modern Table Lamp",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", // Room interior
    description: "Light up your room with our best-selling lamps.",
  },
];

const HeroSlide = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const { data: session } = useSession();

  const { data: heroProducts, isLoading } = useQuery({
    queryKey: ["heroProducts", session?.user?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (session?.user?.id) params.set("excludeUserId", session.user.id);
      const response = await axios.get(`/api/products/hero?${params.toString()}`);
      return response.data;
    },
  });

  const displaySlides =
    heroProducts && heroProducts.length > 0
      ? heroProducts.map((product: any) => ({
        id: product.id,
        slug: product.slug,
        subtitle: product.category?.name || "Featured",
        title: product.name,
        image:
          product.images?.[0] ||
          "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
        description: product.description,
      }))
      : [];

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="w-full bg-[#F9F9F9] dark:bg-background py-20 relative">
      <Carousel
        setApi={setApi}
        className="w-full max-w-7xl mx-auto px-4 "
        opts={{ loop: true }}
      >
        <CarouselContent>
          {isLoading ? (
            <CarouselItem>
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </CarouselItem>
          ) : (
            displaySlides.map((slide: any) => (
              <CarouselItem key={slide.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-[500px]">
                  <div className="flex flex-col items-start space-y-4 pl-4 md:pl-0">
                    <span className="text-gray-400 dark:text-gray-500 font-medium text-sm">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-[#1a202c] dark:text-foreground leading-[1.1] mb-6 font-serif">
                      {slide.title
                        .replace(" Collection", "")
                        .replace(" Chair", "")
                        .replace(" Lamp", "")}{" "}
                      <br />
                      {slide.title.includes("Collection")
                        ? "Collection"
                        : slide.title.includes("Chair")
                          ? "Chair"
                          : "Lamp"}
                    </h1>
                    <div className="pt-8">
                      <Link href={slide.slug ? `/products/${slide.slug}` : "/products"}>
                        <Button
                          variant="outline"
                          className="rounded-none border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-transparent hover:text-gray-600 dark:hover:text-gray-400 bg-transparent px-8 py-6 text-xs font-bold uppercase tracking-wider transition-all min-w-[160px]"
                        >
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-end relative h-full w-full">
                    <div className="relative w-[500px] h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[400px] relative">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>

      {/* Functional Dots */}
      <div className="absolute left-[calc(50%-600px)] bottom-20 flex space-x-3 pl-4 hidden xl:flex">
        {!isLoading &&
          displaySlides.map((slide: any, index: number) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${current === index ? "bg-teal-400" : "border border-gray-400 hover:bg-gray-200"}`}
            ></div>
          ))}
      </div>
      {/* Mobile Functional dots */}
      <div className="absolute left-10 bottom-10 flex space-x-3 xl:hidden">
        {!isLoading &&
          displaySlides.map((slide: any, index: number) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${current === index ? "bg-teal-400" : "border border-gray-400 hover:bg-gray-200"}`}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default HeroSlide;
