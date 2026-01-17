"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"

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

interface UseAuthenticatedTwitterApiReturn {
  likes: Like[]
  loading: boolean
  error: string | null
  progress: number
  fetchLikes: () => Promise<void>
  hasMore: boolean
  loadMore: () => Promise<void>
}

export function useAuthenticatedTwitterApi(): UseAuthenticatedTwitterApiReturn {
  const { data: session } = useSession()
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [nextToken, setNextToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchUserLikes = async (
    paginationToken?: string,
  ): Promise<{
    likes: Like[]
    nextToken?: string
    totalCount: number
  }> => {
    const params = new URLSearchParams({
      maxResults: "100",
    })

    if (paginationToken) {
      params.append("paginationToken", paginationToken)
    }

    const response = await fetch(`/api/twitter/auth/likes?${params}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch likes")
    }

    return data
  }

  const fetchLikes = useCallback(async () => {
    if (!session) {
      setError("Not authenticated")
      return
    }

    setLoading(true)
    setError(null)
    setProgress(0)
    setLikes([])
    setNextToken(null)
    setHasMore(false)

    try {
      setProgress(30)
      const firstBatch = await fetchUserLikes()

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
  }, [session])

  const loadMore = useCallback(async () => {
    if (!session || !nextToken || loading) return

    setLoading(true)
    try {
      const moreLikes = await fetchUserLikes(nextToken)
      setLikes((prev) => [...prev, ...moreLikes.likes])
      setNextToken(moreLikes.nextToken || null)
      setHasMore(!!moreLikes.nextToken)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load more likes"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [session, nextToken, loading])

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
