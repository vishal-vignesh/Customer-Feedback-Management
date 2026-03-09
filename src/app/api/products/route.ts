import { NextResponse } from "next/server";
import { prisma } from "../../../../customer-relationship-manager/lib/prisma-shreya";
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
    },
  });

  return NextResponse.json(product);
}