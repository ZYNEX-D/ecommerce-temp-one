import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

        const products = await prisma.product.findMany({
            where: categoryId ? { categoryId } : {},
            take: limit,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Incoming POST data:', body);

        // Sanitize and validate numeric inputs
        const price = typeof body.price === 'string' ? parseFloat(body.price) : body.price;
        const stock = typeof body.stock === 'string' ? parseInt(body.stock) : body.stock;

        if (isNaN(price) || isNaN(stock)) {
            return NextResponse.json({ error: 'Invalid numeric data detected in price or stock levels.' }, { status: 400 });
        }
        
        const product = await prisma.product.create({
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
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error('API Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json({ 
            error: 'Failed to create product',
            details: error.message 
        }, { status: 500 });
    }
}
