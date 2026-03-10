import Link from "next/link";
import ProductTable from "../components/ProductTable";
import { prisma } from "@/lib/prisma";

// Make sure Product type is defined/imported
import { Product } from "../types"; // adjust path as needed

export default async function Page() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { reviews: true }
  });

  const formattedProducts: Product[] = products.map(product => ({
    ...product,
    price: Number(product.price), // Decimal → number
    createdAt: product.createdAt.toISOString(), 
    updatedAt: product.updatedAt.toISOString(),
    reviews: product.reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }))
  }));

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Products</h1>

        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Product
        </Link>
      </div>

      <ProductTable products={formattedProducts} />
    </div>
  );
}