import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// GET - List orders containing this vendor's products
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

        if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Vendor access required" },
                { status: 403 }
            );
        }

        // Find all orders that contain at least one item from this vendor
        const orders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        vendorId: session.user.id,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    where: {
                        vendorId: session.user.id,
                    },
                    include: {
                        product: {
                            select: { id: true, slug: true, images: true },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching vendor orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
