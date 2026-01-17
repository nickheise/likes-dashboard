import { type NextRequest, NextResponse } from "next/server"
import { TwitterApiClient, transformTwitterDataToLikes } from "@/lib/twitter-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const maxResults = Number.parseInt(searchParams.get("maxResults") || "100")
    const paginationToken = searchParams.get("paginationToken")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const bearerToken = process.env.TWITTER_BEARER_TOKEN
    if (!bearerToken) {
      return NextResponse.json(
        {
          error: "Twitter API not configured. Please add TWITTER_BEARER_TOKEN to your environment variables.",
        },
        { status: 500 },
      )
    }

    const client = new TwitterApiClient(bearerToken)
    const apiResponse = await client.getUserLikes(userId, maxResults, paginationToken || undefined)

    const likes = transformTwitterDataToLikes(apiResponse)

    return NextResponse.json({
      likes,
      nextToken: apiResponse.meta.next_token,
      totalCount: apiResponse.meta.result_count,
    })
  } catch (error) {
    console.error("Twitter API Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch likes",
      },
      { status: 500 },
    )
  }
}
