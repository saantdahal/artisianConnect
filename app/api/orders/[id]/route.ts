import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// GET - Get single order detail
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: true,
                reviews: {
                  where: { userId: session.user.id },
                  select: {
                    id: true,
                    rating: true,
                    title: true,
                    comment: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow order owner or vendor of items to view
    const isOwner = order.userId === session.user.id;
    const isVendor = order.items.some(
      (item) => item.vendorId === session.user.id,
    );
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isVendor && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

// PATCH - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const body = await request.json();
    const { status, declineReason, cancelReason } = body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner = order.userId === session.user.id;
    const isVendor = order.items.some(
      (item) => item.vendorId === session.user.id,
    );

    // Status transition validation
    const allowedTransitions: Record<
      string,
      { statuses: string[]; role: "owner" | "vendor" }[]
    > = {
      PENDING: [
        { statuses: ["ACCEPTED", "DECLINED"], role: "vendor" },
        { statuses: ["CANCELLED"], role: "owner" },
      ],
      ACCEPTED: [{ statuses: ["CONFIRMED"], role: "vendor" }],
      CONFIRMED: [{ statuses: ["DELIVERED"], role: "vendor" }],
    };

    const transitions = allowedTransitions[order.status];
    if (!transitions) {
      return NextResponse.json(
        { error: `Cannot change status from ${order.status}` },
        { status: 400 },
      );
    }

    const validTransition = transitions.find((t) => {
      if (t.role === "owner" && !isOwner) return false;
      if (t.role === "vendor" && !isVendor) return false;
      return t.statuses.includes(status);
    });

    if (!validTransition) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${order.status} to ${status}`,
        },
        { status: 400 },
      );
    }

    if (status === "DECLINED" && !declineReason) {
      return NextResponse.json(
        { error: "Decline reason is required" },
        { status: 400 },
      );
    }

    if (status === "CANCELLED" && !cancelReason) {
      return NextResponse.json(
        { error: "Cancel reason is required" },
        { status: 400 },
      );
    }

    // If cancelling or declining, restore stock
    const updateData: Record<string, unknown> = { status };
    if (status === "DECLINED") {
      updateData.declineReason = declineReason;
    }
    if (status === "CANCELLED") {
      updateData.cancelReason = cancelReason;
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      if (status === "CANCELLED" || status === "DECLINED") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: updateData,
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
