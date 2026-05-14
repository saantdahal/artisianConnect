"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const ProductSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const [query, setQuery] = useState(initialSearch);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Sync state if URL changes externally
        setQuery(searchParams.get("search") || "");
    }, [searchParams]);

    const updateSearch = (value: string) => {
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value.trim()) {
                params.set("search", value.trim());
            } else {
                params.delete("search");
            }
            // Reset to page 1 when searching
            params.delete("page");
            router.push(`/products?${params.toString()}`);
        }, 300);
    };

    const clearSearch = () => {
        setQuery("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all"
            />
            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default ProductSearch;
