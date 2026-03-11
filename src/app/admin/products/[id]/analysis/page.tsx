import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SentimentChart from "../../../charts/SentimentChart";

import { notFound } from "next/navigation";
import RatingDistributionChart from "../../../charts/RatingDistributionChart";
import StatusChart from "../../../charts/StatusChart";

export const dynamic = "force-dynamic";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { reviews: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Analysis for {product.name}
          </h1>
          <p className="text-gray-500 mt-1">Insights and feedback overview</p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SentimentChart reviews={product.reviews} />
        <RatingDistributionChart reviews={product.reviews} />
        <StatusChart reviews={product.reviews} />
      </div>
    </div>
  );
}
