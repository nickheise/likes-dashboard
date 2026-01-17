"use client"

import { useState, useEffect, useCallback } from "react"
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

interface Category {
  id: string
  name: string
  color: string
  count: number
}

export function usePersistentData() {
  const { data: session } = useSession()
  const [likes, setLikes] = useState<Like[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  // Load cached data on mount
  useEffect(() => {
    if (session?.user?.id) {
      loadCachedData()
    }
  }, [session?.user?.id])

  const loadCachedData = async () => {
    setLoading(true)
    try {
      // Load likes
      const likesResponse = await fetch("/api/likes")
      if (likesResponse.ok) {
        const { likes } = await likesResponse.json()
        setLikes(likes)
      }

      // Load categories
      const categoriesResponse = await fetch("/api/categories")
      if (categoriesResponse.ok) {
        const { stats } = await categoriesResponse.json()
        setCategories(stats)
      }
    } catch (err) {
      console.error("Error loading cached data:", err)
      setError("Failed to load cached data")
    } finally {
      setLoading(false)
    }
  }

  const syncWithTwitter = useCallback(async () => {
    if (!session?.user?.id) return

    setSyncing(true)
    setError(null)

    try {
      const response = await fetch("/api/sync", { method: "POST" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Sync failed")
      }

      // Reload cached data after sync
      await loadCachedData()

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sync failed"
      setError(errorMessage)
      throw err
    } finally {
      setSyncing(false)
    }
  }, [session?.user?.id])

  const updateLikeCategories = async (likeId: string, categories: string[]) => {
    try {
      const response = await fetch(`/api/likes/${likeId}/categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      })

      if (response.ok) {
        // Update local state
        setLikes((prev) => prev.map((like) => (like.id === likeId ? { ...like, categories } : like)))

        // Reload categories to update counts
        const categoriesResponse = await fetch("/api/categories")
        if (categoriesResponse.ok) {
          const { stats } = await categoriesResponse.json()
          setCategories(stats)
        }
      }
    } catch (err) {
      console.error("Error updating like categories:", err)
    }
  }

  const createCategory = async (name: string, color?: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      })

      if (response.ok) {
        // Reload categories
        const categoriesResponse = await fetch("/api/categories")
        if (categoriesResponse.ok) {
          const { stats } = await categoriesResponse.json()
          setCategories(stats)
        }
      }
    } catch (err) {
      console.error("Error creating category:", err)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Reload data
        await loadCachedData()
      }
    } catch (err) {
      console.error("Error deleting category:", err)
    }
  }

  const searchLikes = async (query: string) => {
    try {
      const response = await fetch(`/api/likes?search=${encodeURIComponent(query)}`)
      if (response.ok) {
        const { likes } = await response.json()
        return likes
      }
    } catch (err) {
      console.error("Error searching likes:", err)
    }
    return []
  }

  return {
    likes,
    categories,
    loading,
    error,
    syncing,
    syncWithTwitter,
    updateLikeCategories,
    createCategory,
    deleteCategory,
    searchLikes,
    refreshData: loadCachedData,
  }
}
