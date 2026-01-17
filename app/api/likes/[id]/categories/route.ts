import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { categories } = await request.json()
    await db.updateLikeCategories(params.id, categories)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating like categories:", error)
    return NextResponse.json({ error: "Failed to update categories" }, { status: 500 })
  }
}
