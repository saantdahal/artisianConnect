"use client";

import Image from "next/image";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CategorySkeleton = () => (
  <div className="bg-[#F8F8F8] dark:bg-muted p-8 flex justify-between items-center h-48 animate-pulse rounded-lg">
    <div className="flex flex-col space-y-4 w-1/2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
    </div>
    <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
  </div>
);

const bgColors = [
  "bg-[#F8F8F8] dark:bg-slate-800/40",
  "bg-[#F0F8FF] dark:bg-blue-900/20",
  "bg-[#FFF0F5] dark:bg-pink-900/20",
  "bg-[#F5FFFA] dark:bg-emerald-900/20",
];

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["home-categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data;
    },
  });

  const displayCategories = categories?.slice(0, 3) || [];
  return (
    <div className="w-full bg-white dark:bg-background py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </>
          ) : displayCategories.length > 0 ? (
            displayCategories.map((item: any, index: number) => {
              const bg = bgColors[index % bgColors.length];
              return (
                <div
                  key={item.id}
                  className={`${bg} p-8 flex justify-between items-center transition-all hover:shadow-sm duration-300 group rounded-lg`}
                >
                  <div className="flex flex-col space-y-3 z-10 max-w-[60%]">
                    <span className="text-gray-400 dark:text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                      {item.description
                        ? item.description.substring(0, 25)
                        : "Featured Collection"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-teal-400 dark:group-hover:text-teal-500 transition-colors font-serif">
                      {item.name}
                    </h3>

                    <div className="pt-4">
                      <Link
                        href={`/products?category=${item.id}`}
                        className="text-[10px] font-extrabold uppercase border-b border-gray-900 dark:border-gray-100 pb-0.5 text-gray-900 dark:text-gray-100 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-400 dark:hover:text-teal-500 transition-colors tracking-wider"
                      >
                        SHOP NOW
                      </Link>
                    </div>
                  </div>
                  <div className="relative w-32 h-32 flex-shrink-0">
                    {/* Placeholder for images to match screenshot placement on right */}
                    <div className="w-full h-full relative">
                      {/* Using a placeholder div to represent the image area if asset missing */}
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src={
                            item.image ||
                            `https://picsum.photos/id/${110 + index}/600/600`
                          }
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8">
              No categories found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
