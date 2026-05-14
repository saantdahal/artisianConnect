import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateWilsonScore } from "@/lib/wilson-score";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const excludeUserId = searchParams.get("excludeUserId");
    const sort = searchParams.get("sort") || "rating";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "1000")),
    );
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: Record<string, unknown> = {
      status: "ACTIVE",
      stock: { gt: 0 },
    };

    if (excludeUserId) {
      where.userId = { not: excludeUserId };
    }

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice)
        (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice)
        (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    // Sort order
    let orderBy: Record<string, string> | undefined;
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price_low":
        orderBy = { price: "asc" };
        break;
      case "price_high":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = undefined;
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    let products;
    let total;

    if (sort === "rating") {
      const allProducts = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      const sortedProducts = allProducts.sort((a, b) => {
        const scoreA = calculateWilsonScore(a.averageRating, a.totalRatings);
        const scoreB = calculateWilsonScore(b.averageRating, b.totalRatings);
        
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        } else {
          // Secondary sort: newest first if scores are identical
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      total = sortedProducts.length;
      products = sortedProducts.slice(skip, skip + limit);
    } else {
      const [dbProducts, dbTotal] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      products = dbProducts;
      total = dbTotal;
    }

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
