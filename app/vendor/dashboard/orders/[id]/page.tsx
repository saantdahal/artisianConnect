"use client";

import { use, useState } from "react";
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
  Mail,
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
  user: { id: string; name: string; email: string };
}

export default function VendorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(false);

  const { data: order, isLoading } = useQuery<OrderDetail>({
    queryKey: ["vendor-order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      status,
      reason,
    }: {
      status: string;
      reason?: string;
    }) => {
      const res = await fetch(`/api/orders/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["vendor-order", id] });
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      setShowDeclineInput(false);
      setShowCancelInput(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
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
    <div>
      {/* Breadcrumb */}
      {/* <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link
          href="/vendor/dashboard/orders"
          className="hover:text-blue-500 transition-colors"
        >
          Orders
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700">{order.orderNumber}</span>
      </div> */}
      <DashboardHeader />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order {order.orderNumber}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {order.user.name}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 ${sc.color} ${sc.bg}`}
          >
            <StatusIcon className="w-4 h-4" />
            {sc.label}
          </span>
          <div className="flex items-center gap-2">
            {order.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  onClick={() => updateStatus.mutate({ status: "ACCEPTED" })}
                  disabled={updateStatus.isPending}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {updateStatus.isPending &&
                    updateStatus.variables?.status === "ACCEPTED" ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {updateStatus.isPending &&
                    updateStatus.variables?.status === "ACCEPTED"
                    ? "Accepting..."
                    : "Accept Order"}
                </Button>
                {!showDeclineInput ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDeclineInput(true)}
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Decline
                  </Button>
                ) : null}
              </>
            )}
            {order.status === "ACCEPTED" && (
              <>
                <Button
                  size="sm"
                  onClick={() => updateStatus.mutate({ status: "CONFIRMED" })}
                  disabled={updateStatus.isPending}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {updateStatus.isPending &&
                    updateStatus.variables?.status === "CONFIRMED" ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Package className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {updateStatus.isPending &&
                    updateStatus.variables?.status === "CONFIRMED"
                    ? "Confirming..."
                    : "Confirm Order"}
                </Button>
                {!showCancelInput ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCancelInput(true)}
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Cancel
                  </Button>
                ) : null}
              </>
            )}
            {order.status === "CONFIRMED" && (
              <Button
                size="sm"
                onClick={() => updateStatus.mutate({ status: "DELIVERED" })}
                disabled={updateStatus.isPending}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                {updateStatus.isPending &&
                  updateStatus.variables?.status === "DELIVERED" ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Truck className="w-3.5 h-3.5 mr-1.5" />
                )}
                {updateStatus.isPending &&
                  updateStatus.variables?.status === "DELIVERED"
                  ? "Updating..."
                  : "Mark Delivered"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Decline Input Section */}
      {showDeclineInput && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Decline Order
          </h3>
          <p className="text-xs text-red-600 mb-3">
            Please provide a reason for declining this order. The customer will
            be notified.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for declining..."
              className="flex-1 px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
              autoFocus
            />
            <Button
              size="sm"
              onClick={() =>
                updateStatus.mutate({
                  status: "DECLINED",
                  reason: declineReason,
                })
              }
              disabled={!declineReason || updateStatus.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {updateStatus.isPending &&
                updateStatus.variables?.status === "DECLINED" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {updateStatus.isPending &&
                updateStatus.variables?.status === "DECLINED"
                ? "Declining..."
                : "Confirm Decline"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowDeclineInput(false);
                setDeclineReason("");
              }}
              className="text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              Cancel
            </Button>
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
            Please provide a reason for cancelling this order. The customer will
            be notified.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="flex-1 px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
              autoFocus
            />
            <Button
              size="sm"
              onClick={() =>
                updateStatus.mutate({
                  status: "CANCELLED",
                  reason: cancelReason,
                })
              }
              disabled={!cancelReason || updateStatus.isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {updateStatus.isPending &&
                updateStatus.variables?.status === "CANCELLED" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {updateStatus.isPending &&
                updateStatus.variables?.status === "CANCELLED"
                ? "Cancelling..."
                : "Confirm Cancel"}
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

      {/* Status Timeline */}
      {!isTerminalStatus && currentStepIndex >= 0 && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100 shadow-sm">
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${isActive
                          ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                          : isCompleted
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-300"
                        }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${isActive
                          ? "text-blue-600"
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
                      className={`h-0.5 flex-1 -mt-6 transition-colors ${idx < currentStepIndex ? "bg-blue-400" : "bg-gray-100"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Decline Reason Display */}
      {order.status === "DECLINED" && order.declineReason && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Order Declined</p>
            <p className="text-sm text-red-600 mt-1">{order.declineReason}</p>
          </div>
        </div>
      )}

      {/* Cancel Reason Display */}
      {order.status === "CANCELLED" && order.cancelReason && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-800">Order Cancelled</p>
            <p className="text-sm text-gray-600 mt-1">{order.cancelReason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Product ID:{" "}
                      <span className="font-mono">{item.product.slug}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-blue-500" />
              Customer Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {order.user.name}
                  </p>
                  <p className="text-xs text-gray-500">{order.user.email}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-50">
                <a
                  href={`mailto:${order.user.email}`}
                  className="text-xs text-blue-500 hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-500" />
              Shipping Address
            </h2>
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-gray-800">{order.shippingName}</p>
              <p className="text-gray-500">{order.shippingAddress}</p>
              <p className="text-gray-500">{order.shippingRegion}</p>
              <div className="flex items-center gap-2 text-gray-500 mt-2 pt-2 border-t border-gray-50">
                <Phone className="w-3.5 h-3.5" />
                {order.shippingPhone}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Payment Summary
            </h2>
            <div className="space-y-2 text-sm">
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
              <div className="flex justify-between pt-3 border-t border-gray-100 mt-2">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-blue-600 text-lg">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-amber-800 mb-2">
                Customer Note
              </h2>
              <p className="text-sm text-amber-700">{order.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
