"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PackageOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

interface Product {
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
}

interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const fetchProducts = async (params: {
    category: string | null;
    search: string | null;
    minPrice: string | null;
    maxPrice: string | null;
    sort: string | null;
    page: string;
}): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set("category", params.category);
    if (params.search) searchParams.set("search", params.search);
    if (params.minPrice) searchParams.set("minPrice", params.minPrice);
    if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice);
    if (params.sort) searchParams.set("sort", params.sort);
    searchParams.set("page", params.page);
    searchParams.set("limit", "12");

    const res = await fetch(`/api/products/list?${searchParams.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

const ProductList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const page = searchParams.get("page") || "1";

    const { data, isLoading } = useQuery({
        queryKey: ["products", category, search, minPrice, maxPrice, sort, page],
        queryFn: () => fetchProducts({ category, search, minPrice, maxPrice, sort, page }),
        staleTime: 2 * 60 * 1000,
    });

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`/products?${params.toString()}`);
    };

    if (isLoading) {
        return (
            <div className="flex-1">
                {/* Skeleton Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="w-full aspect-square bg-gray-100 dark:bg-muted/50 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-100 dark:bg-muted/50 rounded w-1/3 mb-2" />
                            <div className="h-5 bg-gray-100 dark:bg-muted/50 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data || data.products.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
                <PackageOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    No products found
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {search
                        ? `No results for "${search}". Try a different search term.`
                        : "No products available in this category yet."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1">
            {/* Results Info */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Showing{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    {(data.page - 1) * data.limit + 1}–
                    {Math.min(data.page * data.limit, data.total)}
                </span>{" "}
                of <span className="font-medium text-gray-700 dark:text-gray-300">{data.total}</span>{" "}
                products
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={data.page <= 1}
                        onClick={() => handlePageChange(data.page - 1)}
                        className="rounded-full w-10 h-10 border-gray-200 dark:border-border text-gray-400 dark:text-gray-500 hover:bg-teal-400 hover:text-white hover:border-teal-400 transition-colors disabled:opacity-40"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                            return (
                                p === 1 ||
                                p === data.totalPages ||
                                Math.abs(p - data.page) <= 1
                            );
                        })
                        .map((p, idx, arr) => (
                            <span key={p} className="flex items-center gap-1">
                                {idx > 0 && arr[idx - 1] !== p - 1 && (
                                    <span className="text-gray-400 px-1">…</span>
                                )}
                                <Button
                                    variant={p === data.page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(p)}
                                    className={`rounded-full w-10 h-10 transition-colors ${p === data.page
                                        ? "bg-teal-400 text-white border-teal-400 hover:bg-teal-500"
                                        : "border-gray-200 dark:border-border text-gray-600 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-500/20 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-800"
                                        }`}
                                >
                                    {p}
                                </Button>
                            </span>
                        ))}

                    <Button
                        variant="outline"
                        size="icon"
                        disabled={data.page >= data.totalPages}
                        onClick={() => handlePageChange(data.page + 1)}
                        className="rounded-full w-10 h-10 border-gray-200 dark:border-border text-gray-400 dark:text-gray-500 hover:bg-teal-400 hover:text-white hover:border-teal-400 transition-colors disabled:opacity-40"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
