"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function FailureContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const orderId = searchParams.get("orderId");

    const errorMessages: Record<string, string> = {
        missing_data: "No payment data received from eSewa.",
        invalid_signature: "Payment verification failed — invalid signature.",
        payment_not_found: "Payment record not found.",
        payment_incomplete: "Payment was not completed.",
        verification_failed: "An error occurred during payment verification.",
    };

    const message = error
        ? errorMessages[error] || "An unexpected error occurred."
        : "Your payment could not be processed.";

    return (
        <div className="w-full bg-gray-50 dark:bg-background min-h-[60vh]">
            <div className="container mx-auto px-4 max-w-2xl py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-serif mb-3">
                    Payment Failed
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
                <div className="flex gap-4 justify-center">
                    {orderId ? (
                        <Link href={`/user/orders`}>
                            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                                View My Orders
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/checkout">
                            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                                Try Again
                            </Button>
                        </Link>
                    )}
                    <Link href="/products">
                        <Button variant="outline">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentFailurePage() {
    return (
        <Suspense
            fallback={
                <div className="w-full bg-gray-50 dark:bg-background min-h-[60vh] flex items-center justify-center">
                    <p className="text-gray-400 dark:text-gray-500">Loading...</p>
                </div>
            }
        >
            <FailureContent />
        </Suspense>
    );
}
