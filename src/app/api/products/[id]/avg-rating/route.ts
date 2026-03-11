import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const avgRating = await prisma.review.aggregate({
      where: { productId: id },
      _avg: {
        rating: true
      }
    });
    return NextResponse.json(avgRating, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch average rating" }, { status: 500 });
  }
}