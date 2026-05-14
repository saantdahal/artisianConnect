"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function getVendorDashboardStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.session || session.user.role !== "VENDOR") {
            return { success: false, error: "Unauthorized" };
        }

        const vendorId = session.user.id;

        // Fetch Total Sales (sum of order items where status is not cancelled)
        // Note: Our order_item doesn't have status, we need to check the associated Order status
        const [
            totalOrdersData,
            recentCustomersData,
            orderItems
        ] = await Promise.all([
            // Count unique orders that have at least one item from this vendor
            prisma.order.count({
                where: {
                    items: {
                        some: {
                            vendorId: vendorId
                        }
                    },
                    status: {
                        not: "CANCELLED"
                    }
                }
            }),
            // Count unique customers making those orders
            prisma.order.groupBy({
                by: ['userId'],
                where: {
                    items: {
                        some: {
                            vendorId: vendorId
                        }
                    },
                    status: {
                        not: "CANCELLED"
                    }
                }
            }),
            // Fetch items to calculate total sales and profit 
            prisma.orderItem.findMany({
                where: {
                    vendorId: vendorId,
                    order: {
                        status: {
                            not: "CANCELLED"
                        }
                    }
                },
                select: {
                    price: true,
                    quantity: true
                }
            })
        ]);

        const totalSales = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // We'll estimate profit at 60% of sales for now as there's no cost field
        const totalProfit = totalSales * 0.6;
        const totalOrders = totalOrdersData;
        const newCustomers = recentCustomersData.length; // total unique customers 

        return {
            success: true,
            stats: {
                totalSales,
                totalOrders,
                totalProfit,
                newCustomers,
            },
        };

    } catch (error) {
        console.error("Error fetching vendor stats:", error);
        return { success: false, error: "Failed to fetch vendor statistics" };
    }
}

export async function getVendorSalesChartData() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.session || session.user.role !== "VENDOR") {
            return { success: false, error: "Unauthorized" };
        }

        const vendorId = session.user.id;

        // Product Data (Top Selling)
        const topProductsData = await prisma.orderItem.groupBy({
            by: ['name'],
            where: {
                vendorId: vendorId,
                order: {
                    status: {
                        not: "CANCELLED"
                    }
                }
            },
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 6
        });

        const productData = topProductsData.map(item => ({
            name: item.name,
            sales: item._sum.quantity || 0
        }));

        // Revenue Over Time (Last 5 weeks)
        // We'll approximate this by grouping by week.
        const fiveWeeksAgo = new Date();
        fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 35);

        const recentItems = await prisma.orderItem.findMany({
            where: {
                vendorId: vendorId,
                createdAt: {
                    gte: fiveWeeksAgo
                },
                order: {
                    status: {
                        not: "CANCELLED"
                    }
                }
            },
            select: {
                createdAt: true,
                price: true,
                quantity: true
            }
        });

        // Group by week
        const weeklyDataMap = new Map();
        recentItems.forEach(item => {
            // Get the week string e.g. "Week 1"
            // We'll just simple bucket into 5 intervals
            const diffTime = Math.abs(item.createdAt.getTime() - fiveWeeksAgo.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weekNumber = Math.ceil(diffDays / 7);

            const weekName = `Week ${weekNumber}`;
            const revenue = item.price * item.quantity;

            if (weeklyDataMap.has(weekName)) {
                weeklyDataMap.set(weekName, weeklyDataMap.get(weekName) + revenue);
            } else {
                weeklyDataMap.set(weekName, revenue);
            }
        });

        const salesData = [];
        for (let i = 1; i <= 5; i++) {
            const weekName = `Week ${i}`;
            salesData.push({
                name: weekName,
                sales: weeklyDataMap.get(weekName) || 0,
                traffic: (weeklyDataMap.get(weekName) || 0) * 1.2, // mock traffic
            });
            // add some empty points to smooth chart like in design
            if (i < 5) {
                salesData.push({ name: "", sales: (weeklyDataMap.get(weekName) || 0) * 0.9, traffic: (weeklyDataMap.get(weekName) || 0) * 1.1 });
                salesData.push({ name: "", sales: (weeklyDataMap.get(weekName) || 0) * 1.1, traffic: (weeklyDataMap.get(weekName) || 0) * 1.3 });
            }
        }


        return {
            success: true,
            salesData: salesData,
            productData: productData
        };

    } catch (error) {
        console.error("Error fetching chart data:", error);
        return { success: false, error: "Failed to fetch chart data" };
    }
}

export async function getVendorRecentTransactions() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.session || session.user.role !== "VENDOR") {
            return { success: false, error: "Unauthorized" };
        }

        const vendorId = session.user.id;

        const transactions = await prisma.orderItem.findMany({
            where: { vendorId: vendorId },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        shippingName: true,
                        status: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        const formattedTransactions = transactions.map(t => ({
            id: `#${t.order.orderNumber.slice(-4)}`,
            date: new Intl.DateTimeFormat('en-GB').format(new Date(t.order.createdAt)), // DD/MM/YYYY
            product: t.name,
            customer: t.order.shippingName,
            amount: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR' }).format(t.price * t.quantity),
            status: t.order.status.charAt(0).toUpperCase() + t.order.status.slice(1).toLowerCase(),
            statusColor: t.order.status === "DELIVERED" ? "text-green-500"
                : t.order.status === "CANCELLED" || t.order.status === "DECLINED" ? "text-red-500"
                    : "text-orange-500"
        }));

        return {
            success: true,
            transactions: formattedTransactions
        };

    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        return { success: false, error: "Failed to fetch recent transactions" };
    }
}

export async function getVendorSettings() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.session || session.user.role !== "VENDOR") {
            return { success: false, error: "Unauthorized" };
        }

        const vendorId = session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: vendorId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                image: true
            }
        });

        const storeInfo = await prisma.vendorApplication.findFirst({
            where: {
                userId: vendorId,
                status: "APPROVED"
            },
            select: {
                id: true,
                storeName: true,
                description: true
            }
        });

        if (!user || !storeInfo) {
            return { success: false, error: "Vendor details not found" };
        }

        return {
            success: true,
            settings: {
                personal: user,
                store: storeInfo
            }
        };

    } catch (error) {
        console.error("Error fetching vendor settings:", error);
        return { success: false, error: "Failed to fetch vendor settings" };
    }
}

export async function updateVendorSettings(data: { name: string, phoneNumber?: string, storeName: string, description: string }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.session || session.user.role !== "VENDOR") {
            return { success: false, error: "Unauthorized" };
        }

        const vendorId = session.user.id;

        // Update User
        await prisma.user.update({
            where: { id: vendorId },
            data: {
                name: data.name,
                phoneNumber: data.phoneNumber,
            }
        });

        // Update VendorApplication (store details)
        const application = await prisma.vendorApplication.findFirst({
            where: {
                userId: vendorId,
                status: "APPROVED"
            }
        });

        if (application) {
            await prisma.vendorApplication.update({
                where: { id: application.id },
                data: {
                    storeName: data.storeName,
                    description: data.description
                }
            });
        }

        return { success: true };

    } catch (error) {
        console.error("Error updating vendor settings:", error);
        return { success: false, error: "Failed to update vendor settings" };
    }
}
