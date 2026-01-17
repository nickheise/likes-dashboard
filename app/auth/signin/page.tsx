"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to app
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <X className="h-6 w-6" />
            </div>
            <CardTitle>Sign in to X Likes Organizer</CardTitle>
            <CardDescription>
              Connect your X.com account to organize and search your likes with powerful categorization tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers &&
              Object.values(providers).map((provider: any) => (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  className="w-full"
                  size="lg"
                >
                  <X className="h-5 w-5 mr-2" />
                  Continue with {provider.name}
                </Button>
              ))}

            <div className="text-center text-xs text-muted-foreground">
              <p>
                By signing in, you agree to our terms of service and privacy policy. We only access your public profile
                and liked tweets.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
