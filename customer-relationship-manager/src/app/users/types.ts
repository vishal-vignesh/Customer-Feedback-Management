export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  avgRating: number;
  totalReviews: number;
}

export interface AdminResponse {
  id: string;
  message: string;
  createdAt: string;
  admin: {
    name: string | null;
    email: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  reviewText: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  status: "RESOLVED" | "UNRESOLVED";
  createdAt: string;
  editableUntil: string;
  product: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
  responses: AdminResponse[];
}