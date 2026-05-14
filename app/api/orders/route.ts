import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

function generateOrderNumber(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ORD-${code}`;
}

// POST - Create order from cart
export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { items, shippingName, shippingPhone, shippingAddress, shippingRegion, note, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        if (!shippingName || !shippingPhone || !shippingAddress || !shippingRegion) {
            return NextResponse.json(
                { error: "Shipping information is required" },
                { status: 400 }
            );
        }

        // Fetch all products to validate stock and get vendor info
        const productIds = items.map((item: { productId: string }) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // Validate all products exist and have enough stock
        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.productId}` },
                    { status: 400 }
                );
            }
            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
                    { status: 400 }
                );
            }
        }

        // Calculate totals
        let subtotal = 0;
        const orderItems = items.map((item: { productId: string; quantity: number; name: string; image: string; price: number }) => {
            const product = products.find((p) => p.id === item.productId)!;
            subtotal += item.price * item.quantity;
            return {
                productId: item.productId,
                vendorId: product.userId || "",
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
            };
        });

        const shippingCost = subtotal >= 50 ? 0 : 5;
        const total = subtotal + shippingCost;

        // Generate unique order number
        let orderNumber = generateOrderNumber();
        let attempts = 0;
        while (attempts < 5) {
            const existing = await prisma.order.findUnique({ where: { orderNumber } });
            if (!existing) break;
            orderNumber = generateOrderNumber();
            attempts++;
        }

        // Create order and decrement stock in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Decrement stock for each product
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Create the order
            return tx.order.create({
                data: {
                    orderNumber,
                    userId: session.user.id,
                    subtotal,
                    shippingCost,
                    total,
                    shippingName,
                    shippingPhone,
                    shippingAddress,
                    shippingRegion,
                    paymentMethod: paymentMethod || "COD",
                    note: note || null,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: true,
                },
            });
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

// GET - List orders for authenticated user
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, slug: true, images: true },
                        },
                    },
                },
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
