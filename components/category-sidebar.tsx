"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Folder } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface CategorySidebarProps {
  categories: Array<{ name: string; count: number; color?: string }>
  onCategorySelect: (category: string) => void
  onCategoryCreate: (name: string) => void
  onCategoryDelete: (name: string) => void
  selectedCategory?: string
}

export function CategorySidebar({
  categories,
  onCategorySelect,
  onCategoryCreate,
  onCategoryDelete,
  selectedCategory,
}: CategorySidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onCategoryCreate(newCategoryName.trim())
      setNewCategoryName("")
      setIsCreating(false)
    }
  }

  return (
    <Card className="w-80 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Categories</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
                    Create
                  </Button>
                  <Button variant="outline" onClick={() => setNewCategoryName("")}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={!selectedCategory ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onCategorySelect("")}
        >
          <Folder className="w-4 h-4 mr-2" />
          All Likes
          <Badge variant="secondary" className="ml-auto">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </Badge>
        </Button>

        {categories.map((category) => (
          <div key={category.name} className="group flex items-center gap-1">
            <Button
              variant={selectedCategory === category.name ? "default" : "ghost"}
              className="flex-1 justify-start"
              onClick={() => onCategorySelect(category.name)}
            >
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color || "#6b7280" }} />
              <span className="truncate">{category.name}</span>
              <Badge variant="secondary" className="ml-auto">
                {category.count}
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
              onClick={() => onCategoryDelete(category.name)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
