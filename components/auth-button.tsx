"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, User } from "lucide-react"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Button variant="outline" size="sm" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (!session) {
    return (
      <Button onClick={() => signIn("twitter")} size="sm">
        <LogIn className="h-4 w-4 mr-2" />
        Sign in with X
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback className="text-xs">
              {session.user?.name?.[0] || session.user?.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          @{session.user?.username || "user"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <User className="h-4 w-4 mr-2" />
          {session.user?.name || session.user?.username}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
