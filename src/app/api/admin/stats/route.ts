import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [totalRevenue, customerCount, productCount, orderCount] = await Promise.all([
            prisma.order.aggregate({
                _sum: {
                    total: true,
                },
            }),
            prisma.user.count({
                where: { role: "CUSTOMER" },
            }),
            prisma.product.count(),
            prisma.order.count(),
        ]);

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Format stats for the frontend
        const stats = [
            { 
                label: "Total Revenue", 
                value: `$${(totalRevenue._sum.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
                change: "+0%", 
                icon: "CreditCard" 
            },
            { 
                label: "Active Customers", 
                value: customerCount.toLocaleString(), 
                change: "+0%", 
                icon: "Users" 
            },
            { 
                label: "Inventory Items", 
                value: productCount.toLocaleString(), 
                change: "+0%", 
                icon: "Package" 
            },
            { 
                label: "Order Volume", 
                value: orderCount.toLocaleString(), 
                change: "+0%", 
                icon: "Activity" 
            },
        ];

        return NextResponse.json({
            stats,
            recentOrders,
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
