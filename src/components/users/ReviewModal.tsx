// "use client";
// import { useState, useEffect } from "react";
// import StarRating from "./StarRating";

// interface ReviewModalProps {
//   productName: string;
//   productId: string;
//   existingReview?: {
//     id: string;
//     rating: number;
//     reviewText: string;
//     editableUntil: string;
//   } | null;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function ReviewModal({
//   productName,
//   productId,
//   existingReview,
//   onClose,
//   onSuccess,
// }: ReviewModalProps) {
//   const [rating, setRating] = useState(existingReview?.rating || 0);
//   const [reviewText, setReviewText] = useState(
//     existingReview?.reviewText || ""
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const isEditing = !!existingReview;

//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   const handleSubmit = async () => {
//     if (rating === 0) return setError("Please select a star rating");
//     if (reviewText.trim().length < 10)
//       return setError("Review must be at least 10 characters");

//     setLoading(true);
//     setError("");

//     try {
//       const url = isEditing
//         ? `/api/reviews/${existingReview.id}`
//         : "/api/reviews";
//       const method = isEditing ? "PATCH" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ productId, rating, reviewText: reviewText.trim() }),
//       });

//       const data = await res.json();
//       if (!res.ok) return setError(data.error || "Something went wrong");

//       onSuccess();
//       onClose();
//     } catch {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sentimentLabel =
//     rating === 5 ? "EXCELLENT" : rating === 4 ? "GOOD" : rating === 3 ? "SATISFIED" : rating === 2 ? "BAD" : "POOR";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/60"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
//         {/* Header */}
//         <div className="bg-black px-6 py-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-white font-bold text-lg">
//               {isEditing ? "Edit Review" : "Write a Review"}
//             </h2>
//             <p className="text-gray-400 text-sm">{productName}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-4">
//           {/* Star Rating */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Rating <span className="text-red-500">*</span>
//             </label>
//             <div className="flex items-center gap-3">
//               <StarRating rating={rating} onRate={setRating} size="lg" />
//               {sentimentLabel && (
//                 <span className="text-sm text-gray-500">{sentimentLabel}</span>
//               )}
//             </div>
//           </div>

//           {/* Review Text */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Your Review <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={reviewText}
//               onChange={(e) => setReviewText(e.target.value)}
//               placeholder="Share your experience..."
//               rows={4}
//               maxLength={500}
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none resize-none text-gray-700 text-sm"
//             />
//             <div className="flex justify-between mt-1">
//               {error && <p className="text-red-500 text-xs">{error}</p>}
//               <p className="text-gray-400 text-xs ml-auto">{reviewText.length}/500</p>
//             </div>
//           </div>

//           {isEditing && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//               <p className="text-yellow-700 text-xs">
//                 ⚠️ Reviews can only be edited within 30 minutes of posting.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 pb-6 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                 </svg>
//                 Submitting...
//               </>
//             ) : isEditing ? "Update Review" : "Submit Review"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";

interface ReviewModalProps {
  productName: string;
  productId: string;
  userName?: string;       // ← pass the logged-in user's name here
  userImage?: string;      // ← optional: real avatar URL
  existingReview?: {
    id: string;
    rating: number;
    reviewText: string;
    editableUntil: string;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name?: string) {
  const colors = [
    "#7C3AED", "#2563EB", "#059669", "#DC2626",
    "#D97706", "#0891B2", "#DB2777", "#4F46E5",
  ];
  if (!name) return colors[0];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function ReviewModal({
  productName,
  productId,
  userName,
  userImage,
  existingReview,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || "");
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
      const url = isEditing ? `/api/reviews/${existingReview.id}` : "/api/reviews";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    rating === 5 ? "Excellent" :
    rating === 4 ? "Good" :
    rating === 3 ? "Satisfied" :
    rating === 2 ? "Bad" :
    rating === 1 ? "Poor" : "";

  const displayName = userName ?? "Anonymous";
  const initials = getInitials(displayName);
  const avatarColor = getAvatarColor(displayName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

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

          {/* ── Social media–style user row ── */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            {userImage ? (
              <img
                src={userImage}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ring-2 ring-gray-100"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-400">Posting a public review</p>
            </div>
          </div>

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
