"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Star,
    ShoppingCart,
    Heart,
    ChevronRight,
    Loader2,
    Package,
    User,
    Calendar,
    Truck,
    Shield,
    RotateCcw,
    Clock,
    Tag,
    Layers,
    Box,
    Minus,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/useCartStore";
import { formatPrice } from "@/lib/formatPrice";
import { useSession } from "@/lib/auth-client";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

interface Review {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: string;
    attributes: Record<string, string>;
    averageRating: number;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    user: {
        id: string;
        name: string | null;
        image: string | null;
    } | null;
    reviews: Review[];
}

const fetchProduct = async (slug: string): Promise<Product> => {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) throw new Error("Product not found");
    return res.json();
};

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: slug } = use(params);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { data: session } = useSession();

    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", slug],
        queryFn: () => fetchProduct(slug),
        staleTime: 2 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <div className="w-full bg-gray-50 dark:bg-background min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="w-full bg-gray-50 dark:bg-background min-h-[60vh] flex flex-col items-center justify-center">
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Product not found
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                    The product you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link href="/products">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                        Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : ["https://picsum.photos/id/164/800/800"];

    const attributes = typeof product.attributes === "object" && product.attributes
        ? Object.entries(product.attributes)
        : [];

    const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: product.reviews.filter((r) => r.rating === star).length,
        percentage: product.totalRatings > 0
            ? (product.reviews.filter((r) => r.rating === star).length / product.reviews.length) * 100
            : 0,
    }));

    return (
        <div className="w-full bg-gray-50 dark:bg-background">
            <div className="container mx-auto px-4 max-w-7xl py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-8">
                    <Link href="/" className="hover:text-teal-500 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/products" className="hover:text-teal-500 transition-colors">
                        Products
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link
                        href={`/products?category=${product.category.id}`}
                        className="hover:text-teal-500 transition-colors"
                    >
                        {product.category.name}
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{product.name}</span>
                </div>

                {/* Product Main Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Image Gallery */}
                    <div className=" self-start">
                        <div className="relative aspect-square bg-[#F9F9F9] dark:bg-muted/50 rounded-xl overflow-hidden mb-4 max-h-[500px]">
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${selectedImage === idx
                                            ? "border-teal-400"
                                            : "border-gray-200 dark:border-border hover:border-gray-300 dark:hover:border-gray-500"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full">
                                {product.category.name}
                            </span>
                            {product.stock > 0 ? (
                                <span className="text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 rounded-full">
                                    In Stock ({product.stock})
                                </span>
                            ) : (
                                <span className="text-xs font-medium px-2.5 py-1 bg-red-50 text-red-600 rounded-full">
                                    Out of Stock
                                </span>
                            )}
                            <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-muted text-gray-500 dark:text-gray-400 rounded-full">
                                SKU: {product.slug}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-foreground font-serif mb-3">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 fill-current ${i < Math.round(product.averageRating)
                                            ? "text-amber-400"
                                            : "text-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                {product.averageRating.toFixed(1)} ({product.totalRatings} {product.totalRatings === 1 ? "review" : "reviews"})
                            </span>
                        </div>

                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {formatPrice(product.price)}
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {attributes.length > 0 && (
                            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-border">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Specifications</h3>
                                <div className="space-y-2">
                                    {attributes.map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-4 text-sm py-1.5 border-b border-dashed border-gray-100 dark:border-border last:border-0">
                                            <span className="text-gray-500 dark:text-gray-400 w-32 shrink-0">{key}</span>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6 pb-6 border-b border-gray-100 dark:border-border space-y-2.5">
                            <div className="flex items-center text-sm">
                                <Tag className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-gray-500 dark:text-gray-400 w-24 shrink-0">Category</span>
                                <Link
                                    href={`/products?category=${product.category.id}`}
                                    className="text-teal-600 hover:underline"
                                >
                                    {product.category.name}
                                </Link>
                            </div>
                            <div className="flex items-center text-sm">
                                <Layers className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-gray-500 dark:text-gray-400 w-24 shrink-0">Availability</span>
                                <span className={product.stock > 0 ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-400"}>
                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-gray-500 dark:text-gray-400 w-24 shrink-0">Listed</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric", month: "long", day: "numeric"
                                    })}
                                </span>
                            </div>
                        </div>

                        {product.user && (
                            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-muted/50 rounded-xl">
                                <div className="w-11 h-11 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center overflow-hidden">
                                    {product.user.image ? (
                                        <Image
                                            src={product.user.image}
                                            alt={product.user.name || "Seller"}
                                            width={44}
                                            height={44}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Sold by</p>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {product.user.name || "Unknown Seller"}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            {session?.user?.id && product.user?.id === session.user.id ? (
                                <div className="flex-1 h-12 bg-gray-100 dark:bg-muted rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                                    This is your product
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center border border-gray-200 dark:border-border rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted rounded-l-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 min-w-[40px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted rounded-r-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <Button
                                        className="flex-1 h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm"
                                        disabled={product.stock === 0}
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
                                                image: images[0],
                                                stock: product.stock,
                                            }, quantity);
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 border-gray-200 dark:border-border text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/30 transition-colors"
                            >
                                <Heart className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
