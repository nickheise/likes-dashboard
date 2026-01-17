"use client"

import { useState, useCallback } from "react"

interface TwitterUser {
  id: string
  username: string
  name: string
  profile_image_url: string
}

interface Like {
  id: string
  content: string
  author: {
    username: string
    displayName: string
    avatar: string
  }
  likedAt: string
  categories: string[]
  metrics: {
    likes: number
    retweets: number
    replies: number
  }
  hasMedia: boolean
}

interface UseTwitterApiReturn {
  likes: Like[]
  loading: boolean
  error: string | null
  progress: number
  fetchLikes: (username: string) => Promise<void>
  hasMore: boolean
  loadMore: () => Promise<void>
}

export function useTwitterApi(): UseTwitterApiReturn {
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentUser, setCurrentUser] = useState<TwitterUser | null>(null)
  const [nextToken, setNextToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchUser = async (username: string): Promise<TwitterUser> => {
    const response = await fetch(`/api/twitter/user?username=${encodeURIComponent(username)}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user")
    }

    return data.user
  }

  const fetchUserLikes = async (
    userId: string,
    paginationToken?: string,
  ): Promise<{
    likes: Like[]
    nextToken?: string
    totalCount: number
  }> => {
    const params = new URLSearchParams({
      userId,
      maxResults: "100",
    })

    if (paginationToken) {
      params.append("paginationToken", paginationToken)
    }

    const response = await fetch(`/api/twitter/likes?${params}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch likes")
    }

    return data
  }

  const fetchLikes = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)
    setProgress(0)
    setLikes([])
    setNextToken(null)
    setHasMore(false)

    try {
      // Step 1: Get user info
      setProgress(10)
      const user = await fetchUser(username)
      setCurrentUser(user)

      // Step 2: Fetch likes in batches
      setProgress(30)
      const firstBatch = await fetchUserLikes(user.id)

      setLikes(firstBatch.likes)
      setNextToken(firstBatch.nextToken || null)
      setHasMore(!!firstBatch.nextToken)
      setProgress(100)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      console.error("Error fetching likes:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!currentUser || !nextToken || loading) return

    setLoading(true)
    try {
      const moreLikes = await fetchUserLikes(currentUser.id, nextToken)
      setLikes((prev) => [...prev, ...moreLikes.likes])
      setNextToken(moreLikes.nextToken || null)
      setHasMore(!!moreLikes.nextToken)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load more likes"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [currentUser, nextToken, loading])

  return {
    likes,
    loading,
    error,
    progress,
    fetchLikes,
    hasMore,
    loadMore,
  }
}
