import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Try to find by slug first, then by id
        let product = await prisma.product.findUnique({
            where: { slug: id },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
                user: {
                    select: { id: true, name: true, image: true },
                },
                reviews: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    include: {
                        user: {
                            select: { id: true, name: true, image: true },
                        },
                    },
                },
            },
        });

        if (!product) {
            product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: {
                        select: { id: true, name: true, slug: true },
                    },
                    user: {
                        select: { id: true, name: true, image: true },
                    },
                    reviews: {
                        orderBy: { createdAt: "desc" },
                        take: 10,
                        include: {
                            user: {
                                select: { id: true, name: true, image: true },
                            },
                        },
                    },
                },
            });
        }

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {
            name,
            description,
            price,
            categoryId,
            stock,
            images,
            status,
            attributes,
            isHero,
            isFeatured,
        } = body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: price !== undefined ? parseFloat(price.toString()) : undefined,
                categoryId,
                stock: stock !== undefined ? parseInt(stock.toString()) : undefined,
                images,
                status,
                attributes,
                isHero,
                isFeatured,
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Failed to delete product. It may be associated with existing orders." },
            { status: 500 }
        );
    }
}
