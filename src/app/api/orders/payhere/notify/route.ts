import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const data: any = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const {
            merchant_id,
            order_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
        } = data;

        const merchantSecret = process.env.PAYHERE_SECRET || '8O1G4A6A4E6A8A4A8A4A8A4A8A4A8A4A8A4A8A4A';
        
        const hashedSecret = crypto
            .createHash('md5')
            .update(merchantSecret)
            .digest('hex')
            .toUpperCase();

        const expectedHash = crypto
            .createHash('md5')
            .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
            .digest('hex')
            .toUpperCase();

        if (md5sig === expectedHash) {
            let paymentStatus = 'FAILED';
            if (status_code === '2') {
                paymentStatus = 'COMPLETED';
            } else if (status_code === '0') {
                paymentStatus = 'PENDING';
            }

            await prisma.order.update({
                where: { id: order_id },
                data: { paymentStatus } as any,
            });

            return NextResponse.json({ message: 'ACK' });
        } else {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('PayHere Notification Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
