import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storeName, description } = await req.json();

    if (!storeName || !description) {
      return NextResponse.json({ error: "Store name and description are required" }, { status: 400 });
    }

    // Check if the user already has a pending application
    const existingApplication = await prisma.vendorApplication.findFirst({
      where: {
        userId: session.user.id,
        status: "PENDING"
      }
    });

    if (existingApplication) {
      return NextResponse.json({ error: "You already have a pending application" }, { status: 400 });
    }

    const application = await prisma.vendorApplication.create({
      data: {
        userId: session.user.id,
        storeName,
        description,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Error creating vendor application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
