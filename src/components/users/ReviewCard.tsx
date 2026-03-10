"use client";
//for my-review page
import { useState } from "react";
import StarRating from "./StarRating";
import ReviewModal from "./ReviewModal";
import { Review } from "../../app/users/types";

interface ReviewCardProps {
  review: Review;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function ReviewCard({ review, onDelete, onUpdate }: ReviewCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canEdit = new Date() < new Date(review.editableUntil);
  const timeLeft = canEdit
    ? Math.max(0, Math.ceil((new Date(review.editableUntil).getTime() - Date.now()) / 60000))
    : 0;

  const sentimentColors = {
    EXCELLENT: "bg-green-100 text-green-700",
    GOOD: "bg-green-100 text-green-700",
    SATISFIED: "bg-green-100 text-green-700",
    BAD: "bg-red-100 text-red-700",
    POOR: "bg-red-100 text-red-700",
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (res.ok) onDelete(review.id);
    } finally {
      setDeleting(false);
    }
  };

  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.product.name)}&background=000000&color=fff&size=100&bold=true`;

  return (
    <>
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {/* Card Header */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={review.product.imageUrl?.startsWith("http") ? review.product.imageUrl : fallbackImage}
                  alt={review.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{review.product.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sentimentColors[review.sentiment]}`}>
                    {review.sentiment.charAt(0) + review.sentiment.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {canEdit && review.status === "UNRESOLVED" && (
                <button
                  onClick={() => setShowEdit(true)}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-black hover:text-black transition-all"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                // disabled={deleting}
                className="px-3 py-1.5 text-xs font-medium border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
              >
                {deleting ? "..." : "Delete"}
              </button>
            </div>
          </div>

          {/* Review Text */}
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{review.reviewText}</p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
              })}
            </span>
            <div className="flex items-center gap-2">
              {review.status === "RESOLVED" ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Resolved</span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Unresolved</span>
              )}
              {canEdit && (
                <span className="text-xs text-yellow-600">⏱ {timeLeft}min left to edit</span>
              )}
            </div>
          </div>
        </div>

        {/* Admin Responses */}
        {review.responses.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Admin Response{review.responses.length > 1 ? "s" : ""}
            </p>
            {review.responses.map((response) => (
              <div key={response.id} className="bg-white rounded-lg p-3.5 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {response.admin.name?.[0]?.toUpperCase() || "A"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {response.admin.name || "Admin"}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(response.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{response.message}</p>
              </div>
            ))}
          </div>
        )}

        {review.responses.length === 0 && (
          <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Awaiting admin response</span>
          </div>
        )}
      </div>

      {showEdit && (
        <ReviewModal
          productName={review.product.name}
          productId={review.product.id}
          existingReview={{
            id: review.id,
            rating: review.rating,
            reviewText: review.reviewText,
            editableUntil: review.editableUntil,
          }}
          onClose={() => setShowEdit(false)}
          onSuccess={() => { setShowEdit(false); onUpdate(); }}
        />
      )}
    </>
  );
}