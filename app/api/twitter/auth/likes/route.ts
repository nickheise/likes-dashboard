import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const maxResults = Number.parseInt(searchParams.get("maxResults") || "100")
    const paginationToken = searchParams.get("paginationToken")

    const params = new URLSearchParams({
      max_results: maxResults.toString(),
      "tweet.fields": "created_at,author_id,public_metrics,attachments",
      expansions: "author_id,attachments.media_keys",
      "user.fields": "username,name,profile_image_url",
      "media.fields": "type,url",
    })

    if (paginationToken) {
      params.append("pagination_token", paginationToken)
    }

    const url = `https://api.twitter.com/2/users/${session.user.id}/liked_tweets?${params}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: `Twitter API Error: ${response.status} - ${error.detail || response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Transform the data
    const likes =
      data.data?.map((tweet: any) => {
        const author = data.includes?.users?.find((user: any) => user.id === tweet.author_id)
        const hasMedia = tweet.attachments?.media_keys && tweet.attachments.media_keys.length > 0

        return {
          id: tweet.id,
          content: tweet.text,
          author: {
            username: author?.username || "unknown",
            displayName: author?.name || "Unknown User",
            avatar: author?.profile_image_url || "/placeholder.svg?height=32&width=32",
          },
          likedAt: formatRelativeTime(tweet.created_at),
          categories: [],
          metrics: {
            likes: tweet.public_metrics.like_count,
            retweets: tweet.public_metrics.retweet_count,
            replies: tweet.public_metrics.reply_count,
          },
          hasMedia: hasMedia || false,
          originalData: tweet,
        }
      }) || []

    return NextResponse.json({
      likes,
      nextToken: data.meta?.next_token,
      totalCount: data.meta?.result_count || 0,
    })
  } catch (error) {
    console.error("Twitter API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch likes" },
      { status: 500 },
    )
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
  return `${Math.floor(diffInSeconds / 604800)}w`
}
