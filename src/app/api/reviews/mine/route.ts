import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await verifyToken(token);

  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      product: true,
      responses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}
