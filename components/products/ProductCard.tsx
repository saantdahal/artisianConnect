"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Search } from "lucide-react";
import useCartStore from "@/stores/useCartStore";
import useWishlistStore from "@/stores/useWishlistStore";
import { formatPrice } from "@/lib/formatPrice";
import { useSession } from "@/lib/auth-client";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useEffect } from "react";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
        stock: number;
        averageRating: number;
        totalRatings: number;
        category: {
            id: string;
            name: string;
            slug: string;
        };
    };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const imageUrl =
        Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : "https://picsum.photos/id/164/600/600";

    const { data: session } = useSession();
    const { fetchWishlist, toggleItem, isInWishlist } = useWishlistStore();
    const wishlisted = isInWishlist(product.id);

    useEffect(() => {
        if (session?.user) {
            fetchWishlist();
        }
    }, [session?.user, fetchWishlist]);

    return (
        <Link href={`/products/${product.slug}`} className="group cursor-pointer block">
            {/* Image Container with Hover Overlay */}
            <div className="relative w-full aspect-square bg-[#F9F9F9] dark:bg-muted/50 mb-4 overflow-hidden flex items-center justify-center rounded-lg">
                <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!session?.user) {
                                useAuthModalStore.getState().openModal();
                                return;
                            }
                            useCartStore.getState().addItem({
                                productId: product.id,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                image: imageUrl,
                                stock: product.stock,
                            });
                        }}
                        className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-400 dark:hover:bg-teal-500 hover:text-white dark:hover:text-white transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!session?.user) {
                                useAuthModalStore.getState().openModal();
                                return;
                            }
                            toggleItem(product.id);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${wishlisted
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-teal-400 dark:hover:bg-teal-500 hover:text-white dark:hover:text-white"
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/products/${product.slug}`;
                        }}
                        className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-400 dark:hover:bg-teal-500 hover:text-white transition-colors"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-gray-100 font-bold text-sm">
                        {formatPrice(product.price)}
                    </span>
                    <div className="flex text-gray-200">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 fill-current ${i < Math.round(product.averageRating)
                                    ? "text-amber-400"
                                    : "text-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <h3 className="text-gray-800 dark:text-gray-200 font-bold text-lg group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                    {product.name}
                </h3>
                <span className="text-xs text-gray-400">{product.category.name}</span>
            </div>
        </Link>
    );
};

export default ProductCard;
