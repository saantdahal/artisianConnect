"use client";

import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Heart,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { useSession } from "@/lib/auth-client";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useEffect } from "react";

// Replaced hardcoded products with dynamic fetching

const FeaturedProducts = () => {
  const { data: session } = useSession();
  const { fetchWishlist, toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (session?.user) {
      fetchWishlist();
    }
  }, [session?.user, fetchWishlist]);

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featuredProducts", session?.user?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (session?.user?.id) params.set("excludeUserId", session.user.id);
      const response = await axios.get(`/api/products/featured?${params.toString()}`);
      return response.data;
    },
  });

  const displayProducts = featuredProducts || [];

  return (
    <div className="w-full bg-white dark:bg-background pb-24 pt-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-foreground mb-2 font-serif">
              Featured Products
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              The new collection and deals of summer is heading here.
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-gray-200 text-gray-400 hover:bg-teal-400 hover:text-white hover:border-teal-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-gray-200 bg-teal-400 text-white hover:bg-teal-500 hover:border-teal-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product: any) => (
              <div key={product.id} className="group cursor-pointer">
                {/* Image Container with Hover Overlay */}
                <div className="relative w-full aspect-square bg-[#F9F9F9] dark:bg-muted/50 mb-4 overflow-hidden flex items-center justify-center rounded-md">
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={
                        product.images?.[0] ||
                        "https://picsum.photos/id/164/600/600"
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                      onClick={() => {
                        if (!session?.user) {
                          useAuthModalStore.getState().openModal();
                          return;
                        }
                        useCartStore.getState().addItem({
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          image: product.images?.[0] || "https://picsum.photos/id/164/600/600",
                          stock: product.stock || 0,
                        });
                      }}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-teal-400 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (!session?.user) {
                          useAuthModalStore.getState().openModal();
                          return;
                        }
                        toggleItem(product.id);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isInWishlist(product.id)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white text-gray-600 hover:bg-teal-400 hover:text-white"
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-teal-400 hover:text-white transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-gray-100 font-bold text-sm">
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
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-gray-800 dark:text-gray-200 font-bold text-lg hover:text-teal-400 dark:hover:text-teal-500 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center flex-col items-center h-48 text-gray-500">
            <p>No featured products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
