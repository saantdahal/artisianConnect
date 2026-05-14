import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import {
    generateEsewaSignature,
    generateTransactionUuid,
    buildSignatureMessage,
    ESEWA_PRODUCT_CODE,
} from "@/lib/esewa";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { error: "Order ID is required" },
                { status: 400 },
            );
        }

        // Fetch the order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 },
            );
        }

        if (order.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 },
            );
        }

        // Generate transaction UUID and signature
        const transactionUuid = generateTransactionUuid();
        const totalAmount = order.total;
        const signatureMessage = buildSignatureMessage(totalAmount, transactionUuid);
        const signature = generateEsewaSignature(signatureMessage);

        // Create payment record
        await prisma.payment.create({
            data: {
                orderId: order.id,
                method: "ESEWA",
                transactionUuid,
                amount: totalAmount,
                status: "PENDING",
            },
        });

        // Build the base URL for success/failure redirects
        const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

        // Return form data for client-side submission
        const formData = {
            amount: totalAmount,
            tax_amount: 0,
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
            product_code: ESEWA_PRODUCT_CODE,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: `${baseUrl}/api/esewa/verify`,
            failure_url: `${baseUrl}/payment/failure?orderId=${order.id}`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
        };

        return NextResponse.json(formData);
    } catch (error) {
        console.error("Error initiating eSewa payment:", error);
        return NextResponse.json(
            { error: "Failed to initiate payment" },
            { status: 500 },
        );
    }
}
