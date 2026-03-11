"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import StatsBar from "../../../components/users/StatsBar";
import { Review } from "../types";

export const dynamic = "force-dynamic";
export default function UserDashboardPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, reviewsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/reviews/mine"),
      ]);
      const productsData = await productsRes.json();
      const reviewsData = await reviewsRes.json();
      setTotalProducts(Array.isArray(productsData) ? productsData.length : 0);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const pendingResponses = reviews.filter((r) => r.responses.length === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's your activity overview.</p>
      </div>

      <StatsBar
        totalProducts={totalProducts}
        totalReviews={reviews.length}
        avgRating={avgRating}
        pendingResponses={pendingResponses}
      />

      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Recent Reviews</h3>
          <button
            onClick={() => router.push("/users/dashboard/my-reviews")}
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">You haven't written any reviews yet.</p>
            <button
              onClick={() => router.push("/users/dashboard/products")}
              className="mt-3 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{review.product.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{review.reviewText}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <span className="text-yellow-400 text-sm">{"★".repeat(review.rating)}</span>
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      review.responses.length > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {review.responses.length > 0 ? "Resolved" : "Unresolved"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}