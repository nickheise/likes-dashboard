import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbService } from "@/lib/db-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Initialize user defaults if this is their first sync
    await dbService.initializeUserDefaults(session.user.id)

    // Fetch likes from Twitter API
    const params = new URLSearchParams({
      max_results: "100",
      "tweet.fields": "created_at,author_id,public_metrics,attachments",
      expansions: "author_id,attachments.media_keys",
      "user.fields": "username,name,profile_image_url",
      "media.fields": "type,url",
    })

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

    // Transform and save likes
    const likes =
      data.data?.map((tweet: any) => {
        const author = data.includes?.users?.find((user: any) => user.id === tweet.author_id)
        const hasMedia = tweet.attachments?.media_keys && tweet.attachments.media_keys.length > 0

        return {
          tweetId: tweet.id,
          content: tweet.text,
          authorName: author?.name || "Unknown User",
          authorHandle: author?.username || "unknown",
          authorAvatar: author?.profile_image_url,
          likedAt: new Date(tweet.created_at),
          hasMedia: hasMedia || false,
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count,
          originalData: tweet,
        }
      }) || []

    // Save to database
    await dbService.saveLikes(session.user.id, likes)

    // Update user preferences with last sync time
    await dbService.upsertUserPreferences(session.user.id, {
      lastSyncAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      imported: likes.length,
      nextToken: data.meta?.next_token,
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to sync" }, { status: 500 })
  }
}
