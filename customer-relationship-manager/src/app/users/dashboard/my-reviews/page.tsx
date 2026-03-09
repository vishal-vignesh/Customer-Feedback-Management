"use client";
import { useEffect, useState, useCallback } from "react";
import ReviewCard from "../../../../components/users/ReviewCard";
import { Review } from "../../types";
export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "responded" | "pending">("all");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews/mine");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = reviews.filter((r) => {
    if (filter === "responded") return r.responses.length > 0;
    if (filter === "pending") return r.responses.length === 0;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
        <p className="text-gray-500 mt-1">{reviews.length} total review{reviews.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: reviews.length },
          { label: "Responded", value: reviews.filter((r) => r.responses.length > 0).length },
          { label: "Pending", value: reviews.filter((r) => r.responses.length === 0).length },
        ].map((s) => (
          <div key={s.label} className="bg-white shadow rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "responded", "pending"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-black text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
            }`}
          >
            {f === "all" ? "All" : f === "responded" ? "Responded" : "Pending"}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white shadow rounded-xl">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-gray-700 font-semibold text-lg">No reviews found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all" ? "You haven't written any reviews yet." : `No ${filter} reviews.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
              onUpdate={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
}
