import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// GET - List addresses for authenticated user
export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json(
            { error: "Failed to fetch addresses" },
            { status: 500 }
        );
    }
}
