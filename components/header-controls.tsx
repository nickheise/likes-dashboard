"use client"
import { CalendarDays, Filter, Search, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface HeaderControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  activeFilters: string[]
  onFilterChange: (filters: string[]) => void
  availableCategories: string[]
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
}

export function HeaderControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  activeFilters,
  onFilterChange,
  availableCategories,
  dateRange,
  onDateRangeChange,
}: HeaderControlsProps) {
  const toggleFilter = (category: string) => {
    const newFilters = activeFilters.includes(category)
      ? activeFilters.filter((f) => f !== category)
      : [...activeFilters, category]
    onFilterChange(newFilters)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search likes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9"
        />
      </div>

      {/* Date Range */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <CalendarDays className="h-4 w-4 mr-2" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sortBy} onValueChange={onSortChange}>
            <DropdownMenuRadioItem value="recent">Most Recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="popular">Most Popular</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="author">By Author</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFilters.length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableCategories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={activeFilters.includes(category)}
              onCheckedChange={() => toggleFilter(category)}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
