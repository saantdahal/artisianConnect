import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEsewaResponse, checkTransactionStatus } from "@/lib/esewa";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const encodedData = url.searchParams.get("data");

        if (!encodedData) {
            return NextResponse.redirect(
                new URL("/payment/failure?error=missing_data", request.url),
            );
        }

        // Decode and verify signature
        const { valid, data } = verifyEsewaResponse(encodedData);

        if (!valid || !data) {
            return NextResponse.redirect(
                new URL("/payment/failure?error=invalid_signature", request.url),
            );
        }

        // Find the payment record
        const payment = await prisma.payment.findUnique({
            where: { transactionUuid: data.transaction_uuid },
            include: { order: true },
        });

        if (!payment) {
            return NextResponse.redirect(
                new URL("/payment/failure?error=payment_not_found", request.url),
            );
        }

        // Double-verify with eSewa status API
        try {
            const statusResult = await checkTransactionStatus(
                data.total_amount,
                data.transaction_uuid,
                data.product_code,
            );

            if (statusResult.status !== "COMPLETE") {
                // Update payment as failed
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: "FAILED",
                        rawResponse: statusResult as object,
                    },
                });

                return NextResponse.redirect(
                    new URL(
                        `/payment/failure?orderId=${payment.orderId}&error=payment_incomplete`,
                        request.url,
                    ),
                );
            }
        } catch (statusError) {
            console.error("eSewa status check failed:", statusError);
            // Continue with signature verification alone if status API fails
        }

        // Update payment record as completed
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: "COMPLETED",
                transactionCode: data.transaction_code,
                paidAt: new Date(),
                rawResponse: data as object,
            },
        });

        // Redirect to success page
        const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
        return NextResponse.redirect(
            new URL(
                `/payment/success?orderId=${payment.orderId}&orderNumber=${payment.order.orderNumber}`,
                baseUrl,
            ),
        );
    } catch (error) {
        console.error("Error verifying eSewa payment:", error);
        return NextResponse.redirect(
            new URL("/payment/failure?error=verification_failed", request.url),
        );
    }
}
