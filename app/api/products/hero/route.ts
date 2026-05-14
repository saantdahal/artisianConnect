import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeUserId = searchParams.get("excludeUserId");

    const where: Record<string, unknown> = {
      isHero: true,
      status: "ACTIVE",
      stock: { gt: 0 },
    };

    if (excludeUserId) {
      where.userId = { not: excludeUserId };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching hero products:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero products" },
      { status: 500 },
    );
  }
}
