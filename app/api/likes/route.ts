import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbService } from "@/lib/db-service"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search")

    let likes
    if (search) {
      likes = await dbService.searchLikes(session.user.id, search)
    } else {
      likes = await dbService.getLikesByUserId(session.user.id, limit, offset)
    }

    // Transform to match frontend format
    const transformedLikes = likes.map((like) => ({
      id: like.id,
      content: like.content,
      author: {
        username: like.authorHandle,
        displayName: like.authorName,
        avatar: like.authorAvatar || "/placeholder.svg?height=32&width=32",
      },
      likedAt: formatRelativeTime(like.likedAt),
      categories: like.categories.map((c) => c.category.name),
      metrics: {
        likes: like.likes,
        retweets: like.retweets,
        replies: like.replies,
      },
      hasMedia: like.hasMedia,
    }))

    return NextResponse.json({ likes: transformedLikes })
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
  return `${Math.floor(diffInSeconds / 604800)}w`
}
