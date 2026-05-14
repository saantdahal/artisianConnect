import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { calculateWilsonScore } from "@/lib/wilson-score";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    // Basic server-side validation
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate slug
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        userId: session?.user?.id,
        slug,
        description,
        price,
        categoryId,
        stock,
        images: images || [],
        status: status || "DRAFT",
        attributes: attributes || {},
        isHero: isHero || false,
        isFeatured: isFeatured || false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const products = await prisma.product.findMany({
      where: {
        userId: session?.user?.id,
      },
      include: {
        category: true,
        user: true,
      },
    });

    const sortedProducts = products.sort((a, b) => {
      const scoreA = calculateWilsonScore(a.averageRating, a.totalRatings);
      const scoreB = calculateWilsonScore(b.averageRating, b.totalRatings);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
