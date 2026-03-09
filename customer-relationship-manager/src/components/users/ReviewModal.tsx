"use client";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";

interface ReviewModalProps {
  productName: string;
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    reviewText: string;
    editableUntil: string;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({
  productName,
  productId,
  existingReview,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(
    existingReview?.reviewText || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!existingReview;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async () => {
    if (rating === 0) return setError("Please select a star rating");
    if (reviewText.trim().length < 10)
      return setError("Review must be at least 10 characters");

    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/reviews/${existingReview.id}`
        : "/api/reviews";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, reviewText: reviewText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Something went wrong");

      onSuccess();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sentimentLabel =
    rating >= 4 ? "😊 Positive" : rating === 3 ? "😐 Neutral" : rating > 0 ? "😞 Negative" : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">
              {isEditing ? "Edit Review" : "Write a Review"}
            </h2>
            <p className="text-gray-400 text-sm">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <StarRating rating={rating} onRate={setRating} size="lg" />
              {sentimentLabel && (
                <span className="text-sm text-gray-500">{sentimentLabel}</span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none resize-none text-gray-700 text-sm"
            />
            <div className="flex justify-between mt-1">
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <p className="text-gray-400 text-xs ml-auto">{reviewText.length}/500</p>
            </div>
          </div>

          {isEditing && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-xs">
                ⚠️ Reviews can only be edited within 30 minutes of posting.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : isEditing ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
