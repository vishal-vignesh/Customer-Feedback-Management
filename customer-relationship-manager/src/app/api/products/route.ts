import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reviews: { select: { rating: true } },
      },
    });

    const productsWithStats = products.map((product) => {
      const totalReviews = product.reviews.length;
      const avgRating =
        totalReviews > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews,
      };
    });

    return NextResponse.json(productsWithStats, {
  headers: {
    "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
  },
});
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}