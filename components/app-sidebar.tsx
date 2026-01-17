"use client"

import * as React from "react"
import { Folder, Plus, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  categories: Array<{ name: string; count: number; color?: string }>
  selectedCategory?: string
  onCategorySelect: (category: string) => void
  onCategoryCreate: (name: string) => void
  onCategoryDelete: (name: string) => void
}

export function AppSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  onCategoryCreate,
  onCategoryDelete,
  ...props
}: AppSidebarProps) {
  const { data: session } = useSession()
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onCategoryCreate(newCategoryName.trim())
      setNewCategoryName("")
      setIsCreating(false)
    }
  }

  const totalLikes = categories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-1 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
                <X className="h-3 w-3" />
              </div>
              <span className="font-semibold">Likes Organizer</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session?.user?.image || "/placeholder.svg?height=24&width=24"} />
                    <AvatarFallback className="text-xs">
                      {session?.user?.name?.[0] || session?.user?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">@{session?.user?.username || "username"}</p>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            {isCreating ? (
              <div className="flex items-center gap-1">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateCategory()
                    if (e.key === "Escape") {
                      setNewCategoryName("")
                      setIsCreating(false)
                    }
                  }}
                  placeholder="Category name"
                  className="h-6 w-24 text-xs"
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={!selectedCategory} onClick={() => onCategorySelect("")} className="group">
                  <Folder className="h-4 w-4" />
                  <span>All Likes</span>
                  <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs font-normal">
                    {totalLikes}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton
                    isActive={selectedCategory === category.name}
                    onClick={() => onCategorySelect(category.name)}
                    className="group"
                  >
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color || "#6b7280" }} />
                    <span className="truncate">{category.name}</span>
                    <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs font-normal">
                      {category.count}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Import Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Privacy</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
