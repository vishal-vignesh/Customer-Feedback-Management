import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {

    const url = new URL(req.url)
    const reviewId = url.pathname.split("/").pop()

    console.log("Deleting review:", reviewId)

    if (!reviewId) {
      return NextResponse.json(
        { error: "reviewId is missing" },
        { status: 400 }
      )
    }

    await prisma.response.deleteMany({
      where: { reviewId }
    })

    await prisma.review.delete({
      where: { id: reviewId }
    })

    return NextResponse.json({
      message: "Review deleted successfully"
    })

  } catch (error) {

    console.error("Delete Review Error:", error)

    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    )

  }
}