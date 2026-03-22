import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const category = await prisma.category.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                image: body.image,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
            },
        });
        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error('API Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json({ 
            error: 'Failed to create category',
            details: error.message 
        }, { status: 500 });
    }
}
