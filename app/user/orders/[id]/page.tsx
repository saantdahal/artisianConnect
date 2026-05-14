"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/user/ReviewModal";
import { useState } from "react";
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

const statusTimeline = ["PENDING", "ACCEPTED", "CONFIRMED", "DELIVERED"];

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  product: { id: string; slug: string };
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingRegion: string;
  paymentMethod: string;
  note: string | null;
  declineReason: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [reviewProduct, setReviewProduct] = useState<{
    id: string;
    name: string;
    image: string;
    existingReview?: {
      id: string;
      rating: number;
      title: string | null;
      comment: string | null;
    } | null;
  } | null>(null);

  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(false);

  const { data: order, isLoading } = useQuery<OrderDetail>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
  });

  const cancelOrder = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED", cancelReason: reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      setShowCancelInput(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 text-center py-20">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const sc = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = sc.icon;

  const isTerminalStatus = ["DELIVERED", "CANCELLED", "DECLINED"].includes(
    order.status,
  );
  const currentStepIndex = statusTimeline.indexOf(order.status);

  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link
          href="/user/orders"
          className="hover:text-teal-500 transition-colors"
        >
          My Orders
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700">{order.orderNumber}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Order {order.orderNumber}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 ${sc.color} ${sc.bg}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {sc.label}
        </span>
      </div>

      {/* Status Timeline (for non-terminal statuses) */}
      {!isTerminalStatus && currentStepIndex >= 0 && (
        <div className="bg-white rounded-xl p-5 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            {statusTimeline.map((step, idx) => {
              const stepConf = statusConfig[step];
              const StepIcon = stepConf.icon;
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${isActive
                          ? "bg-teal-500 text-white"
                          : isCompleted
                            ? "bg-teal-100 text-teal-600"
                            : "bg-gray-100 text-gray-300"
                        }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-medium ${isActive
                          ? "text-teal-600"
                          : isCompleted
                            ? "text-gray-600"
                            : "text-gray-300"
                        }`}
                    >
                      {stepConf.label}
                    </span>
                  </div>
                  {idx < statusTimeline.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mt-4 ${idx < currentStepIndex ? "bg-teal-400" : "bg-gray-100"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Declined reason */}
      {order.status === "DECLINED" && order.declineReason && (
        <div className="bg-red-50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Order Declined</p>
            <p className="text-sm text-red-600 mt-1">{order.declineReason}</p>
          </div>
        </div>
      )}

      {/* Cancel reason */}
      {order.status === "CANCELLED" && order.cancelReason && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-start gap-3 border border-gray-200">
          <XCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">Order Cancelled</p>
            <p className="text-sm text-gray-600 mt-1">{order.cancelReason}</p>
          </div>
        </div>
      )}

      {/* Cancel Input Section */}
      {showCancelInput && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Cancel Order
          </h3>
          <p className="text-xs text-red-600 mb-3">
            Please provide a reason for cancelling this order.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="flex-1 px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 bg-white"
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => cancelOrder.mutate({ reason: cancelReason })}
              disabled={!cancelReason || cancelOrder.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {cancelOrder.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Confirm Cancel
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowCancelInput(false);
                setCancelReason("");
              }}
              className="text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6">
        <div className="p-5 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">
            Items ({order.items.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-5">
              <Link
                href={`/products/${item.product.slug}`}
                className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-sm font-medium text-gray-800 hover:text-teal-600 transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-bold text-gray-800">
                  {formatPrice(item.price * item.quantity)}
                </span>
                {order.status === "DELIVERED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setReviewProduct({
                        id: item.product.id,
                        name: item.name,
                        image: item.image,
                        existingReview:
                          (item.product as any).reviews?.[0] || null,
                      })
                    }
                    className="text-xs h-8 text-teal-600 border-teal-200 hover:bg-teal-50 hover:text-teal-700 mt-2"
                  >
                    {(item.product as any).reviews &&
                      (item.product as any).reviews.length > 0
                      ? "Edit Review"
                      : "Write Review"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {reviewProduct && (
        <ReviewModal
          isOpen={!!reviewProduct}
          onClose={() => setReviewProduct(null)}
          product={reviewProduct}
          existingReview={reviewProduct.existingReview}
        />
      )}

      {/* Order Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Shipping */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-teal-500" />
            Shipping Address
          </h2>
          <div className="space-y-1.5 text-sm">
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {order.shippingName}
            </p>
            <p className="text-gray-500 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {order.shippingPhone}
            </p>
            <p className="text-gray-500 pl-5.5">{order.shippingAddress}</p>
            <p className="text-gray-500 pl-5.5">{order.shippingRegion}</p>
          </div>
        </div>

        {/* Payment & Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-teal-500" />
            Payment Summary
          </h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-gray-800">
                Cash on Delivery
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>
                {order.shippingCost === 0
                  ? "Free"
                  : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      {order.note && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Order Note
          </h2>
          <p className="text-sm text-gray-500">{order.note}</p>
        </div>
      )}

      {/* Cancel Button */}
      {order.status === "PENDING" && !showCancelInput && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setShowCancelInput(true)}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Order
          </Button>
        </div>
      )}
    </div>
  );
}
