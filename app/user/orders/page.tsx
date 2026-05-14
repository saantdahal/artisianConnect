"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
    Package,
    ChevronRight,
    Loader2,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    PENDING: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
    ACCEPTED: { label: "Accepted", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 },
    DECLINED: { label: "Declined", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
    CONFIRMED: { label: "Confirmed", color: "text-purple-600", bg: "bg-purple-50", icon: Package },
    DELIVERED: { label: "Delivered", color: "text-teal-600", bg: "bg-teal-50", icon: Truck },
    CANCELLED: { label: "Cancelled", color: "text-gray-600", bg: "bg-gray-100", icon: XCircle },
};

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
    items: OrderItem[];
}

export default function UserOrdersPage() {
    const { data: orders, isLoading } = useQuery<Order[]>({
        queryKey: ["user-orders"],
        queryFn: async () => {
            const res = await fetch("/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">My Orders</h1>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-16">
                    <ShoppingBag className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">No orders yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Your placed orders will appear here</p>
                    <Link href="/products">
                        <button className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition-colors">
                            Start Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const sc = statusConfig[order.status] || statusConfig.PENDING;
                        const StatusIcon = sc.icon;

                        return (
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
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${sc.color} ${sc.bg} dark:bg-muted`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {sc.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                            {formatPrice(order.total)}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div
                                                key={item.id}
                                                className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white"
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
                                        {order.items.length > 3 && (
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-muted border-2 border-white dark:border-background flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                        {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
