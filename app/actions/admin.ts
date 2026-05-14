"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
    try {
        const [
            totalUsers,
            totalVendors,
            totalOrders,
            orders,
        ] = await Promise.all([
            prisma.user.count({ where: { role: "USER" } }),
            prisma.user.count({ where: { role: "VENDOR" } }),
            prisma.order.count(),
            prisma.order.findMany({
                where: { status: "DELIVERED" },
                select: { total: true },
            }),
        ]);

        const totalRevenue = orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0);

        return {
            success: true,
            stats: {
                totalUsers,
                totalVendors,
                totalOrders,
                totalRevenue,
            },
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
            success: false,
            error: "Failed to fetch dashboard statistics",
        };
    }
}

export async function getAdminUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return { success: true, users };
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

export async function getAdminVendors() {
    try {
        const vendors = await prisma.user.findMany({
            where: { role: "VENDOR" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return { success: true, vendors };
    } catch (error) {
        console.error("Error fetching admin vendors:", error);
        return { success: false, error: "Failed to fetch vendors" };
    }
}

export async function verifyVendor(userId: string, status: "REVOKE") {
    try {
        if (status === "REVOKE") {
            await prisma.user.update({
                where: { id: userId },
                data: { role: "USER" },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating vendor status:", error);
        return { success: false, error: "Failed to update vendor status" };
    }
}

export async function getAdminApplications() {
    try {
        const applications = await prisma.vendorApplication.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        return { success: true, applications };
    } catch (error) {
        console.error("Error fetching admin applications:", error);
        return { success: false, error: "Failed to fetch applications" };
    }
}

export async function approveApplication(applicationId: string) {
    try {
        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId }
        });

        if (!application) {
            return { success: false, error: "Application not found" };
        }

        await prisma.$transaction([
            prisma.vendorApplication.update({
                where: { id: applicationId },
                data: { status: "APPROVED" },
            }),
            prisma.user.update({
                where: { id: application.userId },
                data: { role: "VENDOR" },
            })
        ]);

        return { success: true };
    } catch (error) {
        console.error("Error approving application:", error);
        return { success: false, error: "Failed to approve application" };
    }
}

export async function rejectApplication(applicationId: string) {
    try {
        await prisma.vendorApplication.update({
            where: { id: applicationId },
            data: { status: "REJECTED" },
        });

        return { success: true };
    } catch (error) {
        console.error("Error rejecting application:", error);
        return { success: false, error: "Failed to reject application" };
    }
}
