"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");

    return (
        <div className="w-full bg-gray-50 dark:bg-background min-h-[60vh]">
            <div className="container mx-auto px-4 max-w-2xl py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-teal-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-serif mb-3">
                    Payment Successful!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Your payment via <span className="font-semibold text-green-600">eSewa</span> has been confirmed.
                </p>
                {orderNumber && (
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                        Order Number:{" "}
                        <span className="font-bold text-gray-800 dark:text-gray-200">{orderNumber}</span>
                    </p>
                )}
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
                    You will receive a confirmation email shortly.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/user/orders">
                        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                            View My Orders
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full bg-gray-50 dark:bg-background min-h-[60vh] flex items-center justify-center">
                    <p className="text-gray-400 dark:text-gray-500">Loading...</p>
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}
