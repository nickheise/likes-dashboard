"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, X } from "lucide-react"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                <X className="h-6 w-6" />
              </div>
              <CardTitle>Welcome to X Likes Organizer</CardTitle>
              <CardDescription>
                Sign in with your X.com account to access your likes and organize them with our powerful tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Secure OAuth 2.0 authentication</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your data stays private and secure</span>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  <X className="h-4 w-4 mr-2" />
                  Sign in with X
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}
