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
  originalData?: any
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface Category {
  id: string
  name: string
  color: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface UserPreferences {
  id: string
  userId: string
  autoCategorizationEnabled: boolean
  defaultCategories: string[]
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Simple in-memory database for demo purposes
// In production, you'd use a real database like PostgreSQL, MongoDB, etc.
class InMemoryDB {
  private likes: Map<string, Like> = new Map()
  private categories: Map<string, Category> = new Map()
  private userPreferences: Map<string, UserPreferences> = new Map()

  // Likes operations
  async saveLikes(likes: Omit<Like, "createdAt" | "updatedAt">[]): Promise<void> {
    const now = new Date()
    for (const like of likes) {
      const existingLike = this.likes.get(like.id)
      this.likes.set(like.id, {
        ...like,
        createdAt: existingLike?.createdAt || now,
        updatedAt: now,
      })
    }
  }

  async getLikesByUserId(userId: string, limit = 100, offset = 0): Promise<Like[]> {
    const userLikes = Array.from(this.likes.values())
      .filter((like) => like.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return userLikes.slice(offset, offset + limit)
  }

  async updateLikeCategories(likeId: string, categories: string[]): Promise<void> {
    const like = this.likes.get(likeId)
    if (like) {
      this.likes.set(likeId, {
        ...like,
        categories,
        updatedAt: new Date(),
      })
    }
  }

  async searchLikes(userId: string, query: string): Promise<Like[]> {
    const userLikes = Array.from(this.likes.values()).filter((like) => like.userId === userId)

    if (!query) return userLikes

    const lowerQuery = query.toLowerCase()
    return userLikes.filter(
      (like) =>
        like.content.toLowerCase().includes(lowerQuery) ||
        like.author.username.toLowerCase().includes(lowerQuery) ||
        like.author.displayName.toLowerCase().includes(lowerQuery),
    )
  }

  // Categories operations
  async saveCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    const now = new Date()
    const id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newCategory: Category = {
      ...category,
      id,
      createdAt: now,
      updatedAt: now,
    }
    this.categories.set(id, newCategory)
    return newCategory
  }

  async getCategoriesByUserId(userId: string): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter((category) => category.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  async updateCategory(id: string, updates: Partial<Pick<Category, "name" | "color">>): Promise<void> {
    const category = this.categories.get(id)
    if (category) {
      this.categories.set(id, {
        ...category,
        ...updates,
        updatedAt: new Date(),
      })
    }
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories.delete(id)

    // Remove category from all likes
    for (const [likeId, like] of this.likes.entries()) {
      const categoryToDelete = Array.from(this.categories.values()).find((cat) => cat.id === id)
      if (categoryToDelete && like.categories.includes(categoryToDelete.name)) {
        this.likes.set(likeId, {
          ...like,
          categories: like.categories.filter((cat) => cat !== categoryToDelete.name),
          updatedAt: new Date(),
        })
      }
    }
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return this.userPreferences.get(userId) || null
  }

  async saveUserPreferences(prefs: Omit<UserPreferences, "id" | "createdAt" | "updatedAt">): Promise<UserPreferences> {
    const existing = this.userPreferences.get(prefs.userId)
    const now = new Date()
    const id = existing?.id || `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const preferences: UserPreferences = {
      ...prefs,
      id,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    this.userPreferences.set(prefs.userId, preferences)
    return preferences
  }

  // Analytics
  async getLikesCount(userId: string): Promise<number> {
    return Array.from(this.likes.values()).filter((like) => like.userId === userId).length
  }

  async getCategoriesCount(userId: string): Promise<number> {
    return Array.from(this.categories.values()).filter((category) => category.userId === userId).length
  }

  async getCategoryStats(userId: string): Promise<Array<{ name: string; count: number; color: string }>> {
    const userLikes = Array.from(this.likes.values()).filter((like) => like.userId === userId)
    const userCategories = Array.from(this.categories.values()).filter((category) => category.userId === userId)

    const stats = userCategories.map((category) => ({
      name: category.name,
      color: category.color,
      count: userLikes.filter((like) => like.categories.includes(category.name)).length,
    }))

    return stats.sort((a, b) => b.count - a.count)
  }
}

// Singleton instance
export const db = new InMemoryDB()

// Initialize with some default categories for new users
export async function initializeUserDefaults(userId: string) {
  const existingCategories = await db.getCategoriesByUserId(userId)

  if (existingCategories.length === 0) {
    const defaultCategories = [
      { name: "Product Design", color: "#3b82f6" },
      { name: "AI", color: "#8b5cf6" },
      { name: "Growth", color: "#10b981" },
      { name: "Marketing", color: "#f59e0b" },
      { name: "Inspiration", color: "#ef4444" },
      { name: "UI/UX", color: "#06b6d4" },
      { name: "Funny", color: "#84cc16" },
      { name: "Programming", color: "#6366f1" },
      { name: "Research", color: "#ec4899" },
    ]

    for (const category of defaultCategories) {
      await db.saveCategory({ ...category, userId })
    }
  }

  // Initialize user preferences if they don't exist
  const existingPrefs = await db.getUserPreferences(userId)
  if (!existingPrefs) {
    await db.saveUserPreferences({
      userId,
      autoCategorizationEnabled: true,
      defaultCategories: ["Product Design", "AI", "Programming"],
    })
  }
}
