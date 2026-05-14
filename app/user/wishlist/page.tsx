"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import { formatPrice } from "@/lib/formatPrice";

interface WishlistItem {
    id: string;
    productId: string;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: any;
        stock: number;
        averageRating: number;
        totalRatings: number;
        category: { id: string; name: string; slug: string };
    };
}

export default function WishlistPage() {
    const queryClient = useQueryClient();
    const { toggleItem } = useWishlistStore();

    const { data: wishlistItems, isLoading } = useQuery<WishlistItem[]>({
        queryKey: ["user-wishlist"],
        queryFn: async () => {
            const res = await fetch("/api/user/wishlist");
            if (!res.ok) throw new Error("Failed to fetch wishlist");
            return res.json();
        },
    });

    const handleRemove = async (productId: string) => {
        await toggleItem(productId);
        queryClient.invalidateQueries({ queryKey: ["user-wishlist"] });
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 font-serif">
                My Wishlist
                {wishlistItems && wishlistItems.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({wishlistItems.length})
                    </span>
                )}
            </h1>

            {!wishlistItems || wishlistItems.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border">
                    <Heart className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Your wishlist is empty</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                        Browse products and tap the heart icon to save them here
                    </p>
                    <Link href="/products">
                        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => {
                        const imageUrl =
                            Array.isArray(item.product.images) &&
                                item.product.images.length > 0
                                ? item.product.images[0]
                                : "https://picsum.photos/id/164/600/600";

                        return (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border overflow-hidden group"
                            >
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="relative w-full aspect-square block bg-gray-50 dark:bg-muted"
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </Link>

                                <div className="p-4">
                                    <Link
                                        href={`/products/${item.product.slug}`}
                                        className="text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-2"
                                    >
                                        {item.product.name}
                                    </Link>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {item.product.category.name}
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-2">
                                        {formatPrice(item.product.price)}
                                    </p>

                                    <div className="flex gap-2 mt-3">
                                        <Button
                                            size="sm"
                                            className="flex-1 h-9 bg-teal-500 hover:bg-teal-600 text-white text-xs"
                                            disabled={item.product.stock === 0}
                                            onClick={() => {
                                                useCartStore.getState().addItem({
                                                    productId: item.product.id,
                                                    name: item.product.name,
                                                    slug: item.product.slug,
                                                    price: item.product.price,
                                                    image: imageUrl,
                                                    stock: item.product.stock,
                                                });
                                            }}
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                                            {item.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-9 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-300"
                                            onClick={() => handleRemove(item.product.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
