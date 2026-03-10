// src/app/api/products/[id]/avg-rating/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params Promise
  const { id } = await context.params;
  
  try {
    const avgRating = await prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
    });

    return NextResponse.json({
      message: 'Average rating calculated',
      data: avgRating,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error calculating average rating', error },
      { status: 500 }
    );
  }
}