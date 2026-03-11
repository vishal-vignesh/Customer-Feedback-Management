import * as React from 'react'
import { prisma } from "@/lib/prisma";
import { Review } from "@prisma/client"; // Import the type
import ReviewCard from "../../../components/ReviewModal"

export const dynamic = "force-dynamic";

export default async function Reviews({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params; 

  const reviews = await prisma.review.findMany({
    where: { productId: id },
    orderBy: { createdAt: "desc" },
    include :{
      responses:true,
      user: true
    }
  })

  const products = await prisma.product.findUnique({
    where: { id: id }
  })

  const avgRating = await prisma.review.aggregate({
  where: { productId: id },
  _avg: {
    rating: true
  }
})



  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Reviews</h1>

<div className="border p-4 rounded-lg mb-6 bg-gray-50">
  <h2 className="text-lg font-semibold">{products?.name}</h2>
  <p className="text-gray-600">Price: ₹{products?.price.toString()}</p>
  <p className="text-yellow-600 font-medium">
    Average Rating: {avgRating._avg.rating?.toFixed(1) ?? "No ratings yet"} ⭐
  </p>
</div>
      
        {reviews.map((r: Review) => (
  <ReviewCard key={r.id} review={r} />
    ))}
      
      {reviews.length === 0 && <p>No reviews yet.</p>}
    </>
  )
}
