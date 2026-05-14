import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session?.user;
}

// GET /api/user/wishlist — fetch user's wishlist
export async function GET() {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const wishlist = await prisma.wishlist.findMany({
            where: { userId: user.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        price: true,
                        images: true,
                        stock: true,
                        averageRating: true,
                        totalRatings: true,
                        category: {
                            select: { id: true, name: true, slug: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 }
        );
    }
}

// POST /api/user/wishlist — add product to wishlist
export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json(
                { error: "productId is required" },
                { status: 400 }
            );
        }

        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: user.id,
                productId,
            },
        });

        return NextResponse.json(wishlistItem, { status: 201 });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json(
                { error: "Already in wishlist" },
                { status: 409 }
            );
        }
        console.error("Error adding to wishlist:", error);
        return NextResponse.json(
            { error: "Failed to add to wishlist" },
            { status: 500 }
        );
    }
}

// DELETE /api/user/wishlist — remove product from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json(
                { error: "productId is required" },
                { status: 400 }
            );
        }

        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return NextResponse.json(
            { error: "Failed to remove from wishlist" },
            { status: 500 }
        );
    }
}
