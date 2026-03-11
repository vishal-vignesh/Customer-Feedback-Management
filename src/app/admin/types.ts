export type Product = {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string | null
  createdAt: string
  reviews: {
    rating: number
  }[]
}

export interface Review {
  id: number;
  productId: number;
  product: string;
  rating: number;
  message: string;
  status: "New" | "In Progress" | "Resolved";
}