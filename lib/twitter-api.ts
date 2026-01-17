interface TwitterUser {
  id: string
  username: string
  name: string
  profile_image_url: string
}

interface TwitterTweet {
  id: string
  text: string
  created_at: string
  author_id: string
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
  }
  attachments?: {
    media_keys: string[]
  }
}

interface TwitterApiResponse {
  data: TwitterTweet[]
  includes?: {
    users: TwitterUser[]
    media?: Array<{
      media_key: string
      type: string
      url?: string
    }>
  }
  meta: {
    result_count: number
    next_token?: string
  }
}

export class TwitterApiClient {
  private bearerToken: string

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken
  }

  private async makeRequest(url: string): Promise<any> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Twitter API Error: ${response.status} - ${error.detail || response.statusText}`)
    }

    return response.json()
  }

  async getUserByUsername(username: string): Promise<TwitterUser> {
    const cleanUsername = username.replace("@", "")
    const url = `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=profile_image_url`

    const response = await this.makeRequest(url)
    return response.data
  }

  async getUserLikes(userId: string, maxResults = 100, paginationToken?: string): Promise<TwitterApiResponse> {
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

    const url = `https://api.twitter.com/2/users/${userId}/liked_tweets?${params}`
    return this.makeRequest(url)
  }
}

export function transformTwitterDataToLikes(apiResponse: TwitterApiResponse) {
  const { data: tweets, includes } = apiResponse
  const users = includes?.users || []
  const media = includes?.media || []

  return tweets.map((tweet) => {
    const author = users.find((user) => user.id === tweet.author_id)
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
      categories: [], // Will be populated by auto-categorization
      metrics: {
        likes: tweet.public_metrics.like_count,
        retweets: tweet.public_metrics.retweet_count,
        replies: tweet.public_metrics.reply_count,
      },
      hasMedia: hasMedia || false,
      originalData: tweet,
    }
  })
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
