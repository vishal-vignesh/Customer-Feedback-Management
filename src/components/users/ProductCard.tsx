"use client";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import ReviewModal from "./ReviewModal";
import { Product, Review } from "../../app/users/types";

interface ProductCardProps {
  product: Product;
  userReview?: Review | null;
  onReviewUpdate: () => void;
}

export default function ProductCard({ product, userReview, onReviewUpdate }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const canEdit = userReview && new Date() < new Date(userReview.editableUntil);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          setUserName(user.name || user.email);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=000000&color=fff&size=400&bold=true`;

  return (
    <>
      <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
        {/* Image */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          <img
            src={product.imageUrl?.startsWith("http") ? product.imageUrl : product.imageUrl ? product.imageUrl : fallbackImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
          />
          {product.totalReviews > 0 && (
            <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow text-xs font-bold text-gray-700">
              ⭐ {product.avgRating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
          <p className="text-gray-500 text-sm mt-1 flex-1 line-clamp-2">{product.description}</p>

          {/* Rating Row */}
          <div className="flex items-center gap-2 mt-3 pb-3 border-b border-gray-100">
            {/* <StarRating rating={Math.round(product.avgRating)} readonly size="sm" />
            <span className="text-gray-400 text-xs">
              {product.totalReviews === 0 ? "No reviews yet" : `${product.totalReviews} review${product.totalReviews > 1 ? "s" : ""}`}
            </span> */}
          </div>

          {/* User Review Status */}
          {userReview ? (
            <div className="mt-3 space-y-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-500">Your Review</span>
                  <StarRating rating={userReview.rating} readonly size="sm" />
                </div>
                <p className="text-gray-600 text-xs line-clamp-2">{userReview.reviewText}</p>
              </div>
              {canEdit && (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:border-black hover:text-black transition-all"
                >
                  ✏️ Edit Review
                </button>
              )}
              {!canEdit && (
                <p className="text-center text-xs text-gray-400">Edit window expired</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 w-full py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all"
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <ReviewModal
          productName={product.name}
          productId={product.id}
          userName={userName}
          existingReview={canEdit && userReview ? {
            id: userReview.id,
            rating: userReview.rating,
            reviewText: userReview.reviewText,
            editableUntil: userReview.editableUntil,
          } : null}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); onReviewUpdate(); }}
        />
      )}
    </>
  );
}