import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log('Incoming PUT data for ID:', id, body);

        // Sanitize and validate numeric inputs
        const price = typeof body.price === 'string' ? parseFloat(body.price) : body.price;
        const stock = typeof body.stock === 'string' ? parseInt(body.stock) : body.stock;

        if (isNaN(price) || isNaN(stock)) {
            return NextResponse.json({ error: 'Invalid numeric data detected in price or stock levels.' }, { status: 400 });
        }
        
        const product = await prisma.product.update({
            where: { id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: price,
                image: body.image,
                stock: stock,
                sku: body.sku,
                categoryId: body.categoryId,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
                warranty: body.warranty,
                delivery: body.delivery,
                returns: body.returns,
                terms: body.terms,
            } as any,
        });
        return NextResponse.json(product);
    } catch (error: any) {
        console.error('API Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json({ 
            error: 'Failed to update product',
            details: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
