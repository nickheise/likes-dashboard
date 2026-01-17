"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { HeaderControls } from "@/components/header-controls"
import { LikeCard } from "@/components/like-card"
import { ImportProgress } from "@/components/import-progress"
import { SetupInstructions } from "@/components/setup-instructions"
import { SupabaseSetup } from "@/components/supabase-setup"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"
import { AuthGuard } from "@/components/auth-guard"
import { AuthButton } from "@/components/auth-button"
import { usePersistentData } from "@/hooks/use-persistent-data"
import { SyncButton } from "@/components/sync-button"

export default function Dashboard() {
  const {
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
  } = usePersistentData()
  const [filteredLikes, setFilteredLikes] = useState(likes)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Update filtered likes when likes change
  useEffect(() => {
    setFilteredLikes(likes)
  }, [likes])

  // Filter and sort likes
  useEffect(() => {
    let filtered = likes

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (like) =>
          like.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          like.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          like.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((like) => like.categories.some((cat) => activeFilters.includes(cat)))
    }

    // Apply selected category
    if (selectedCategory) {
      filtered = filtered.filter((like) => like.categories.includes(selectedCategory))
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.metrics.likes - a.metrics.likes
        case "author":
          return a.author.displayName.localeCompare(b.author.displayName)
        case "oldest":
          return a.id.localeCompare(b.id)
        default: // recent
          return b.id.localeCompare(a.id)
      }
    })

    setFilteredLikes(filtered)
  }, [likes, searchQuery, activeFilters, selectedCategory, sortBy, dateRange])

  const handleCategoryChange = (likeId: string, newCategories: string[]) => {
    updateLikeCategories(likeId, newCategories)
  }

  const handleCategoryCreate = (name: string) => {
    createCategory(name)
  }

  const handleCategoryDelete = (categoryId: string) => {
    deleteCategory(categoryId)
  }

  return (
    <SidebarProvider>
      <AppSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onCategoryCreate={handleCategoryCreate}
        onCategoryDelete={handleCategoryDelete}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <HeaderControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              availableCategories={categories.map((cat) => cat.name)}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
          <SyncButton onSync={syncWithTwitter} syncing={syncing} />
          <AuthButton />
        </header>

        <AuthGuard>
          <div className="flex-1 p-4">
            <SetupInstructions />
            <SupabaseSetup />

            {loading && (
              <div className="flex justify-center py-8">
                <ImportProgress
                  status="importing"
                  progress={0}
                  imported={likes.length}
                  message={error || undefined}
                  error={error || undefined}
                  onRetry={() => {}}
                />
              </div>
            )}

            {!loading && likes.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">Click the Sync button to import your X.com likes</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => syncWithTwitter()} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {!loading && likes.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {filteredLikes.map((like) => (
                    <LikeCard
                      key={like.id}
                      like={like}
                      onCategoryChange={handleCategoryChange}
                      availableCategories={categories.map((cat) => cat.name)}
                    />
                  ))}
                </div>

                {filteredLikes.length === 0 && likes.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">No likes found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </AuthGuard>
      </SidebarInset>
    </SidebarProvider>
  )
}
