import { prisma } from "./prisma"
import type { Like, Category, UserPreferences } from "@prisma/client"

export interface LikeWithCategories extends Like {
  categories: Array<{
    category: {
      id: string
      name: string
      color: string
    }
  }>
}

export interface CategoryWithCount extends Category {
  _count: {
    likes: number
  }
}

export class DatabaseService {
  // Likes operations
  async saveLikes(
    userId: string,
    likes: Array<{
      tweetId: string
      content: string
      authorName: string
      authorHandle: string
      authorAvatar?: string
      likedAt: Date
      hasMedia?: boolean
      likes: number
      retweets: number
      replies: number
      originalData?: any
    }>,
  ) {
    const operations = likes.map((like) =>
      prisma.like.upsert({
        where: { tweetId: like.tweetId },
        update: {
          content: like.content,
          authorName: like.authorName,
          authorHandle: like.authorHandle,
          authorAvatar: like.authorAvatar,
          hasMedia: like.hasMedia || false,
          likes: like.likes,
          retweets: like.retweets,
          replies: like.replies,
          originalData: like.originalData,
        },
        create: {
          ...like,
          userId,
          hasMedia: like.hasMedia || false,
        },
      }),
    )

    await prisma.$transaction(operations)
  }

  async getLikesByUserId(userId: string, limit = 100, offset = 0): Promise<LikeWithCategories[]> {
    return prisma.like.findMany({
      where: { userId },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { likedAt: "desc" },
      take: limit,
      skip: offset,
    })
  }

  async searchLikes(userId: string, query: string): Promise<LikeWithCategories[]> {
    return prisma.like.findMany({
      where: {
        userId,
        OR: [
          { content: { contains: query, mode: "insensitive" } },
          { authorName: { contains: query, mode: "insensitive" } },
          { authorHandle: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { likedAt: "desc" },
    })
  }

  async updateLikeCategories(likeId: string, categoryIds: string[]) {
    await prisma.$transaction(async (tx) => {
      // Remove existing categories
      await tx.likeCategory.deleteMany({
        where: { likeId },
      })

      // Add new categories
      if (categoryIds.length > 0) {
        await tx.likeCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            likeId,
            categoryId,
          })),
        })
      }
    })
  }

  // Categories operations
  async getCategoriesByUserId(userId: string): Promise<CategoryWithCount[]> {
    return prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { name: "asc" },
    })
  }

  async createCategory(userId: string, name: string, color = "#6b7280"): Promise<Category> {
    return prisma.category.create({
      data: {
        name,
        color,
        userId,
      },
    })
  }

  async updateCategory(categoryId: string, updates: { name?: string; color?: string }) {
    return prisma.category.update({
      where: { id: categoryId },
      data: updates,
    })
  }

  async deleteCategory(categoryId: string) {
    await prisma.category.delete({
      where: { id: categoryId },
    })
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return prisma.userPreferences.findUnique({
      where: { userId },
    })
  }

  async upsertUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return prisma.userPreferences.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    })
  }

  // Analytics
  async getLikesCount(userId: string): Promise<number> {
    return prisma.like.count({
      where: { userId },
    })
  }

  async getCategoriesCount(userId: string): Promise<number> {
    return prisma.category.count({
      where: { userId },
    })
  }

  async getCategoryStats(userId: string) {
    const categories = await this.getCategoriesByUserId(userId)
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      count: category._count.likes,
    }))
  }

  // Initialize user with default categories
  async initializeUserDefaults(userId: string) {
    const existingCategories = await this.getCategoriesByUserId(userId)

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

      await prisma.category.createMany({
        data: defaultCategories.map((category) => ({
          ...category,
          userId,
        })),
      })
    }

    // Initialize user preferences if they don't exist
    const existingPrefs = await this.getUserPreferences(userId)
    if (!existingPrefs) {
      await this.upsertUserPreferences(userId, {
        autoCategorizationEnabled: true,
        defaultCategories: ["Product Design", "AI", "Programming"],
      })
    }
  }
}

export const dbService = new DatabaseService()
