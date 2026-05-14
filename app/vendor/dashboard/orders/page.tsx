"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import { formatPrice } from "@/lib/formatPrice";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: Clock,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Declined",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: XCircle,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-purple-600",
    bg: "bg-purple-50",
    icon: Package,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-teal-600",
    bg: "bg-teal-50",
    icon: Truck,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: XCircle,
  },
};

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface VendorOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingRegion: string;
  note: string | null;
  declineReason: string | null;
  createdAt: string;
  items: OrderItem[];
  user: { id: string; name: string; email: string };
}

function OrderRow({ order }: { order: VendorOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async ({
      status,
      reason,
    }: {
      status: string;
      reason?: string;
    }) => {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, declineReason: reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      setShowDeclineInput(false);
    },
  });

  const sc = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = sc.icon;

  const vendorTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/vendor/dashboard/orders/${order.id}`}
                className="text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {order.orderNumber}
              </Link>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${sc.color} ${sc.bg}`}
              >
                <StatusIcon className="w-2.5 h-2.5" />
                {sc.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{order.user.name}</span>
              <span>·</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>·</span>
              <span>{order.items.length} items</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-800">
            {formatPrice(vendorTotal)}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <Link
            href={`/vendor/dashboard/orders/${order.id}`}
            className="text-xs font-medium text-blue-600 hover:underline ml-2"
          >
            Manage
          </Link>
        </div>
      </div>
      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-50 p-5 space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Customer</p>
              <p className="text-sm text-gray-800">{order.user.name}</p>
              <p className="text-xs text-gray-400">{order.user.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Ship To</p>
              <p className="text-sm text-gray-800">{order.shippingName}</p>
              <p className="text-xs text-gray-400">{order.shippingAddress}</p>
              <p className="text-xs text-gray-400">
                {order.shippingRegion} · {order.shippingPhone}
              </p>
            </div>
          </div>
          {/* Note */}
          {order.note && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">
                Customer Note
              </p>
              <p className="text-sm text-gray-600">{order.note}</p>
            </div>
          )}
          {/* Decline reason */}
          {order.declineReason && (
            <div className="bg-red-50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-red-700">
                  Decline Reason
                </p>
                <p className="text-sm text-red-600">{order.declineReason}</p>
              </div>
            </div>
          )}
          {/* Link to Detail Page */}
          <div className="pt-3 border-t border-gray-100 text-right">
            <Link
              href={`/vendor/dashboard/orders/${order.id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View Full Details & Actions →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorOrdersPage() {
  const { data: orders, isLoading } = useQuery<VendorOrder[]>({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      const res = await fetch("/api/vendor/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Orders containing your products will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
