"use client";

import { create } from "zustand";
import { toast } from "sonner";

interface WishlistStore {
    items: Set<string>; // productIds
    isLoading: boolean;
    hasFetched: boolean;
    fetchWishlist: () => Promise<void>;
    toggleItem: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

const useWishlistStore = create<WishlistStore>((set, get) => ({
    items: new Set<string>(),
    isLoading: false,
    hasFetched: false,

    fetchWishlist: async () => {
        if (get().hasFetched) return;
        set({ isLoading: true });
        try {
            const res = await fetch("/api/user/wishlist");
            if (res.ok) {
                const data = await res.json();
                set({
                    items: new Set(data.map((w: any) => w.productId)),
                    hasFetched: true,
                });
            }
        } catch {
            // silently fail for non-logged-in users
        } finally {
            set({ isLoading: false });
        }
    },

    toggleItem: async (productId: string) => {
        const { items } = get();
        const isCurrentlyInWishlist = items.has(productId);

        // Optimistic update
        const newItems = new Set(items);
        if (isCurrentlyInWishlist) {
            newItems.delete(productId);
        } else {
            newItems.add(productId);
        }
        set({ items: newItems });

        try {
            const res = await fetch("/api/user/wishlist", {
                method: isCurrentlyInWishlist ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!res.ok) {
                // Revert optimistic update
                set({ items });
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to update wishlist");
                return;
            }

            toast.success(
                isCurrentlyInWishlist
                    ? "Removed from wishlist"
                    : "Added to wishlist"
            );
        } catch {
            set({ items });
            toast.error("Failed to update wishlist");
        }
    },

    isInWishlist: (productId: string) => {
        return get().items.has(productId);
    },
}));

export default useWishlistStore;
