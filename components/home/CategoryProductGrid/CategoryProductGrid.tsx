"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { useSession } from "@/lib/auth-client";

const CategoryProductGrid = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const { data: session } = useSession();

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["grid-categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data;
    },
  });

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["grid-products", selectedCategoryId, session?.user?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategoryId) params.set("category", selectedCategoryId);
      if (session?.user?.id) params.set("excludeUserId", session.user.id);
      const url = `/api/products/list?${params.toString()}`;
      const response = await axios.get(url);
      return response.data;
    },
    enabled: !!selectedCategoryId || !!categories,
  });

  const products = productsData?.products || [];

  return (
    <div className="w-full bg-white dark:bg-background py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row shadow-sm border border-gray-100 dark:border-border rounded-lg overflow-hidden min-h-[500px]">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-[#F7F7F7] dark:bg-muted/30 border-r border-gray-100 dark:border-border">
            {isCategoriesLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <ul className="flex flex-col h-full">
                <li
                  onClick={() => setSelectedCategoryId(null)}
                  className={`px-8 py-5 text-sm font-medium cursor-pointer transition-colors border-b border-gray-100 dark:border-border last:border-none
                  ${!selectedCategoryId
                      ? "bg-teal-400 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-muted/50"
                    }
                `}
                >
                  All Categories
                </li>
                {categories?.slice(0, 8).map((category: any) => (
                  <li
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`px-8 py-5 text-sm font-medium cursor-pointer transition-colors border-b border-gray-100 dark:border-border last:border-none
                    ${selectedCategoryId === category.id
                        ? "bg-teal-400 text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-teal-400 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-muted/50"
                      }
                  `}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Product Grid */}
          <div className="w-full lg:w-3/4 bg-white dark:bg-background p-8">
            {isProductsLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
                {products.slice(0, 6).map((product: any) => (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="flex flex-col h-full group"
                  >
                    <div className="relative w-full aspect-square bg-[#F9F9F9] dark:bg-muted/50 mb-4 flex items-center justify-center rounded-md overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            product.images?.[0] ||
                            "https://picsum.photos/id/111/400/400"
                          }
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                          {formatPrice(product.price || 0)}
                        </span>
                        <div className="flex text-amber-400 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 0) ? "fill-current" : "text-gray-200 fill-current"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium text-sm line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                <p>No products found in this category.</p>
                <div
                  className="mt-4 px-4 py-2 bg-gray-100 dark:bg-muted rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-muted/80 transition-colors"
                  onClick={() => setSelectedCategoryId(null)}
                >
                  View All Products
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductGrid;
