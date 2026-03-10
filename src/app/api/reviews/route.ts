import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Sentiment } from "@prisma/client";

// POST - Create a new review
export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, reviewText } = body;

    if (!productId || !rating || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ratingNumber = Number(rating);
    if (ratingNumber < 1 || ratingNumber > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const sentimentMap: Record<number, Sentiment> = {
      5: "EXCELLENT",
      4: "GOOD",
      3: "SATISFIED",
      2: "BAD",
      1: "POOR",
    };

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: ratingNumber,
        reviewText,
        sentiment: sentimentMap[ratingNumber],
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}