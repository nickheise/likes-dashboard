"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Repeat2, MoreHorizontal, ExternalLink } from "lucide-react"

interface LikeCardProps {
  like: {
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
    hasMedia?: boolean
  }
  onCategoryChange: (likeId: string, categories: string[]) => void
  availableCategories: string[]
}

export function LikeCard({ like, onCategoryChange, availableCategories }: LikeCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md border-border/50">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarImage src={like.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{like.author.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{like.author.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">@{like.author.username}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ExternalLink className="h-3 w-3 mr-2" />
                View on X.com
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed line-clamp-4 text-foreground/90">{like.content}</p>
          {like.hasMedia && (
            <div className="mt-3 w-full h-32 bg-muted/50 rounded-md flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Media</span>
            </div>
          )}
        </div>

        {/* Categories */}
        {like.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {like.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs h-5 px-2">
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{like.metrics.replies}</span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat2 className="h-3 w-3" />
              <span>{like.metrics.retweets}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
              <span>{like.metrics.likes}</span>
            </div>
          </div>
          <span>{like.likedAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
