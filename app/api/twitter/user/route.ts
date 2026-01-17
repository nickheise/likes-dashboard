import { type NextRequest, NextResponse } from "next/server"
import { TwitterApiClient } from "@/lib/twitter-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
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
    const user = await client.getUserByUsername(username)

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Twitter API Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch user data",
      },
      { status: 500 },
    )
  }
}
