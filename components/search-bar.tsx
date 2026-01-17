"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: string[]) => void
  availableCategories: string[]
  activeFilters: string[]
}

export function SearchBar({ onSearch, onFilterChange, availableCategories, activeFilters }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const toggleFilter = (category: string) => {
    const newFilters = activeFilters.includes(category)
      ? activeFilters.filter((f) => f !== category)
      : [...activeFilters, category]
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search your likes by keyword or @username..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-12 h-12 text-base"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Filter className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium mb-2">Filter by Category</p>
              {availableCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={activeFilters.includes(category)}
                  onCheckedChange={() => toggleFilter(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="outline" className="gap-1">
              {filter}
              <button onClick={() => toggleFilter(filter)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
