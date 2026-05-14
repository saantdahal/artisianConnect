import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

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
    const { productId, rating, title, comment } = body;

    if (!productId || rating === undefined) {
      return NextResponse.json(
        { error: "Product ID and rating are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Create the review and update product rating in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Upsert the review (update if exists, create otherwise)
      const review = await tx.review.upsert({
        where: {
          productId_userId: {
            productId,
            userId: session.user.id,
          },
        },
        update: {
          rating,
          title,
          comment,
        },
        create: {
          productId,
          userId: session.user.id,
          rating,
          title,
          comment,
          // Check if they bought it
          isVerified: await tx.orderItem
            .findFirst({
              where: {
                productId,
                order: {
                  userId: session.user.id,
                  status: "DELIVERED",
                },
              },
            })
            .then((item) => !!item),
        },
      });

      // Recalculate average rating
      const aggregations = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          averageRating: aggregations._avg.rating || 0,
          totalRatings: aggregations._count.id,
        },
      });

      return review;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 },
      );
    }

    // Verify ownership
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (
      existingReview.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized to delete this review" },
        { status: 403 },
      );
    }

    const productId = existingReview.productId;

    // Delete review and update product rating in transaction
    await prisma.$transaction(async (tx) => {
      await tx.review.delete({
        where: { id: reviewId },
      });

      // Recalculate average rating
      const aggregations = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          averageRating: aggregations._avg.rating || 0,
          totalRatings: aggregations._count.id,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
