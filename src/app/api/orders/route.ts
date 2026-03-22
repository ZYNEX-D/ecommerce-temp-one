import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        const body = await request.json();
        const { items, shippingData, total, paymentMethod } = body;

        // Generate unique reference
        const reference = `AX-${Math.floor(100000 + Math.random() * 900000)}`;

        // Link to user if logged in AND user exists in DB to prevent P2003
        let validUserId = null;
        if (session?.user?.id) {
            const userExists = await prisma.user.findUnique({
                where: { id: (session.user as any).id },
                select: { id: true }
            });
            if (userExists) {
                validUserId = userExists.id;
            } else {
                console.warn('DEBUG: Session has userId but user not found in DB:', (session.user as any).id);
            }
        }

        // Create the order
        const order = await (prisma.order.create as any)({
            data: {
                total,
                shippingFirstName: shippingData.firstName,
                shippingLastName: shippingData.lastName,
                shippingAddress: shippingData.address,
                shippingCity: shippingData.city,
                shippingZip: shippingData.zip,
                paymentMethod,
                paymentStatus: 'PENDING',
                reference,
                userId: validUserId,
                orderItems: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        // If PayHere, generate the hash
        let payhereData = null;
        if (paymentMethod === 'PAYHERE') {
            const merchantId = process.env.PAYHERE_MERCHANT_ID || '1211149';
            const merchantSecret = process.env.PAYHERE_SECRET || '8O1G4A6A4E6A8A4A8A4A8A4A8A4A8A4A8A4A8A4A';
            
            const hashedSecret = crypto
                .createHash('md5')
                .update(merchantSecret)
                .digest('hex')
                .toUpperCase();
            
            const amountFormatted = parseFloat(total.toString()).toFixed(2);
            const currency = 'LKR';
            
            const hash = crypto
                .createHash('md5')
                .update(merchantId + order.id + amountFormatted + currency + hashedSecret)
                .digest('hex')
                .toUpperCase();

            payhereData = {
                merchant_id: merchantId,
                return_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
                cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
                notify_url: `${process.env.NEXTAUTH_URL}/api/orders/payhere/notify`,
                order_id: order.id,
                items: (order as any).reference,
                amount: amountFormatted,
                currency: currency,
                hash: hash,
                first_name: shippingData.firstName,
                last_name: shippingData.lastName,
                email: session?.user?.email || 'customer@example.com',
                phone: '0771234567',
                address: shippingData.address,
                city: shippingData.city,
                country: 'Sri Lanka',
            };
        }

        return NextResponse.json({ order, payhereData }, { status: 201 });
    } catch (error: any) {
        console.error('Order Creation Failure:', error);
        return NextResponse.json({ error: 'Failed to initialize order sequence.', details: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // Security Policy:
        // 1. Admins see all orders.
        // 2. Customers see only their own orders via userId param.
        // 3. Unauthenticated users see nothing.

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
        }

        const userRole = (session.user as any).role;
        const currentUserId = (session.user as any).id;
        
        const allOrdersInDb = await prisma.order.findMany({ select: { id: true, userId: true } });
        console.log('DEBUG: All Orders in DB:', allOrdersInDb);
        console.log('DEBUG: GET Orders - Role:', userRole, 'ID:', currentUserId, 'Query Param userId:', userId);

        let whereClause: any = {};
        
        if (userRole !== 'ADMIN') {
            // Force filter to current user by ID or Email for robust matching
            whereClause = {
                OR: [
                    { userId: currentUserId },
                    { user: { email: session.user?.email } }
                ]
            };
            
            // Temporary Grace Period logic: If no specific orders found for this user,
            // check if there are orders with the same shipping name that are unlinked (userId: null)
            const userName = session.user?.name || '';
            const nameParts = userName.split(' ');
            if (nameParts.length >= 1) {
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');
                (whereClause.OR as any[]).push({
                    AND: [
                        { userId: null },
                        { shippingFirstName: firstName },
                        { shippingLastName: lastName || '' }
                    ]
                });
            }
        } else if (userId) {
            // Admin can filter by specific userId if provided
            whereClause = { userId };
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error('Order Retrieval Failure:', error);
        return NextResponse.json({ error: 'Failed to retrieve system transactions.' }, { status: 500 });
    }
}
