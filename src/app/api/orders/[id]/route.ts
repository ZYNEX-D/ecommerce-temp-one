import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;
        const { id: orderId } = await params;

        // Fetch order to verify ownership and current status
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Only allow user to modify their own orders, unless they are an ADMIN
        const userRole = (session.user as any).role;
        const currentUserId = (session.user as any).id;

        if (userRole !== 'ADMIN' && order.userId !== currentUserId) {
            return NextResponse.json({ 
                error: 'Forbidden', 
                details: 'You do not have permission to modify this transaction sequence.' 
            }, { status: 403 });
        }

        const VALID_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'CANCELLATION_REQUESTED'];

        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        if (userRole === 'ADMIN') {
            // Admins can set any valid status directly
        } else {
            // Customers: restricted transitions only
            if (status === 'CANCELLED') {
                if (order.status !== 'PENDING') {
                    return NextResponse.json({ error: 'Only pending orders can be directly cancelled.' }, { status: 400 });
                }
            } else if (status === 'CANCELLATION_REQUESTED') {
                if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
                    return NextResponse.json({ error: 'Cannot request cancellation for this order status.' }, { status: 400 });
                }
            } else {
                return NextResponse.json({ error: 'You do not have permission to set this status.' }, { status: 403 });
            }
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status } as any,
        });

        return NextResponse.json(updatedOrder);
    } catch (error: any) {
        console.error('Order Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
