import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateWilsonScore } from "@/lib/wilson-score";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeUserId = searchParams.get("excludeUserId");

    const where: Record<string, unknown> = {
      status: "ACTIVE",
      stock: { gt: 0 },
    };

    if (excludeUserId) {
      where.userId = { not: excludeUserId };
    }

    const allProducts = await prisma.product.findMany({
      where,
    });

    const sortedProducts = allProducts.sort((a, b) => {
      const scoreA = calculateWilsonScore(a.averageRating, a.totalRatings);
      const scoreB = calculateWilsonScore(b.averageRating, b.totalRatings);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const trendingProducts = sortedProducts.slice(0, 2);

    return NextResponse.json(trendingProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
