"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
    Loader2,
    Clock,
    XCircle,
    RotateCcw,
    ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

interface OrderItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    declineReason: string | null;
    items: OrderItem[];
}

export default function MyReturnsPage() {
    const { data: orders, isLoading } = useQuery<Order[]>({
        queryKey: ["user-orders"],
        queryFn: async () => {
            const res = await fetch("/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            return res.json();
        },
    });

    const declinedOrders = orders?.filter((o) => o.status === "DECLINED") || [];

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
                My Returns
            </h1>

            {declinedOrders.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border">
                    <RotateCcw className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">No returns</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                        Orders that were declined will appear here
                    </p>
                    <Link href="/user/orders">
                        <button className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition-colors">
                            View Orders
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {declinedOrders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/user/orders/${order.id}`}
                            className="block bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border p-5 hover:shadow-md dark:hover:border-gray-500 transition-shadow transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                        {order.orderNumber}
                                    </span>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50">
                                        <XCircle className="w-3 h-3" />
                                        Declined
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                        {formatPrice(order.total)}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                </div>
                            </div>

                            {order.declineReason && (
                                <p className="text-xs text-red-500 dark:text-red-400 mb-3 bg-red-50 dark:bg-red-900/50 rounded-lg px-3 py-2">
                                    Reason: {order.declineReason}
                                </p>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {order.items.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-background"
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                    {order.items.length}{" "}
                                    {order.items.length === 1 ? "item" : "items"} ·{" "}
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
