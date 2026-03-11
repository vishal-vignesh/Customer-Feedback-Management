import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  const userId = payload?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      product: true,
      responses: {
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
        }
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Sync status with responses if needed
  for (const review of reviews) {
    if (review.responses.length > 0 && review.status === "UNRESOLVED") {
      // Update review to RESOLVED if it has responses but status is still UNRESOLVED
      await prisma.review.update({
        where: { id: review.id },
        data: { status: "RESOLVED" }
      });
      review.status = "RESOLVED";
    }
  }

  // Map reviews to include computed fields
  const reviewsWithEditableUntil = reviews.map(review => ({
    ...review,
    status: review.status,
    editableUntil: new Date(review.createdAt.getTime() + 30 * 60 * 1000).toISOString()
  }));

  const response = NextResponse.json(reviewsWithEditableUntil);
  // Ensure no caching so fresh data is always returned
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return response;
}