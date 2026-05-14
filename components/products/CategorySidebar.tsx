"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, Loader2, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    _count: {
        products: number;
    };
}

const fetchCategories = async (): Promise<Category[]> => {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
};

const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
];

const CategorySidebar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category");
    const activeSort = searchParams.get("sort") || "rating";

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000,
    });

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    };

    const handleCategoryClick = (categoryId: string | null) => {
        updateParams({ category: categoryId });
    };

    const handleSortChange = (value: string) => {
        updateParams({ sort: value === "rating" ? null : value });
    };

    const handlePriceFilter = () => {
        updateParams({
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
        });
    };

    const clearPriceFilter = () => {
        setMinPrice("");
        setMaxPrice("");
        updateParams({ minPrice: null, maxPrice: null });
    };

    const totalProducts = categories.reduce(
        (sum, cat) => sum + cat._count.products,
        0
    );

    const hasPriceFilter = searchParams.get("minPrice") || searchParams.get("maxPrice");

    if (isLoading) {
        return (
            <aside className="w-full lg:w-64 shrink-0">
                <div className="bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border p-5 shadow-sm">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
            <div className="bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border p-5 shadow-sm top-24">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-teal-500" />
                    Category
                </h3>
                <Select
                    value={activeCategory || "all"}
                    onValueChange={(value) => handleCategoryClick(value === "all" ? null : value)}
                >
                    <SelectTrigger className="w-full h-9 text-sm">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            All Products ({totalProducts})
                        </SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name} ({category._count.products})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-teal-500" />
                    Price Range
                </h3>
                <div className="flex items-center gap-2 mb-3">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-9 text-sm"
                        min="0"
                    />
                    <span className="text-gray-400 dark:text-gray-500 text-sm">–</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-9 text-sm"
                        min="0"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handlePriceFilter}
                        size="sm"
                        className="flex-1 h-8 bg-teal-500 hover:bg-teal-600 text-white text-xs"
                    >
                        Apply
                    </Button>
                    {hasPriceFilter && (
                        <Button
                            onClick={clearPriceFilter}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Sort By */}
            <div className="bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-teal-500" />
                    Sort By
                </h3>
                <Select value={activeSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full h-9 text-sm">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </aside>
    );
};

export default CategorySidebar;
