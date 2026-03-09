import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, imageUrl: true } },
        responses: {
          include: { admin: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, reviewText } = await req.json();

    if (!productId || !rating || !reviewText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Check if already reviewed
    const existing = await prisma.review.findFirst({
      where: { productId, userId },
    });

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
    }

    const sentiment = rating >= 4 ? "POSITIVE" : rating === 3 ? "NEUTRAL" : "NEGATIVE";
    const editableUntil = new Date(Date.now() + 30 * 60 * 1000);

    const review = await prisma.review.create({
      data: { productId, userId, rating, reviewText, sentiment, editableUntil },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, imageUrl: true } },
        responses: {
          include: { admin: { select: { name: true, email: true } } },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}