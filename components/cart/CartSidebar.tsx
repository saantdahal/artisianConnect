"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/useCartStore";
import { formatPrice } from "@/lib/formatPrice";

const CartSidebar = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();
  console.log(isCartOpen);
  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-bold text-gray-800 font-serif">
              Your Cart
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full">
              {getTotalItems()} items
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-gray-600 font-medium mb-1">Your cart is empty</p>
            <p className="text-sm text-gray-400 mb-6">
              Add some products to get started
            </p>
            <Link href="/products" onClick={closeCart}>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 py-3 border-b border-gray-50 last:border-0"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-gray-800 hover:text-teal-600 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-gray-700 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-sm font-bold text-gray-800 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-5 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-500">
                    {getTotalPrice() >= 50 ? "Free" : formatPrice(5)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-900">
                    {formatPrice(
                      getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 5)
                    )}
                  </span>
                </div>
              </div>

              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium">
                  Proceed to Checkout
                </Button>
              </Link>

              <button
                onClick={closeCart}
                className="w-full text-center text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
