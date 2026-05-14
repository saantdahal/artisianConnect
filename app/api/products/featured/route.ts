import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeUserId = searchParams.get("excludeUserId");

    const where: Record<string, unknown> = {
      isFeatured: true,
      status: "ACTIVE",
      stock: { gt: 0 },
    };

    if (excludeUserId) {
      where.userId = { not: excludeUserId };
    }

    const featuredProducts = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
