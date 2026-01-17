"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Settings, X, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function SetupInstructions() {
  const [dismissed, setDismissed] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const generateSecret = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  const copySecret = async () => {
    const secret = generateSecret()
    await navigator.clipboard.writeText(secret)
    setCopiedSecret(true)
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  if (dismissed) return null

  return (
    <Alert className="mb-4">
      <Settings className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Complete setup required. Configure environment variables to enable authentication.</span>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Setup Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Complete Setup Instructions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">1. Environment Variables</CardTitle>
                    <CardDescription>Create a .env.local file in your project root</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Required variables:</p>
                      <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                        {`NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret`}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Generate NEXTAUTH_SECRET:</p>
                      <Button onClick={copySecret} variant="outline" size="sm" className="w-full">
                        {copiedSecret ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied to clipboard!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Generate & Copy Secret
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">2. X.com Developer Setup</CardTitle>
                    <CardDescription>Create a Twitter app to get OAuth credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      1. Visit the{" "}
                      <a
                        href="https://developer.twitter.com/en/portal/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        X Developer Portal <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <p className="text-sm">2. Create a new project and app</p>
                    <p className="text-sm">3. In app settings, enable OAuth 2.0</p>
                    <p className="text-sm">4. Set callback URL: http://localhost:3000/api/auth/callback/twitter</p>
                    <p className="text-sm">5. Copy Client ID and Client Secret to your .env.local</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3. Required Scopes</CardTitle>
                    <CardDescription>Configure these permissions in your Twitter app</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <code>users.read</code> - Read user profile information
                      </li>
                      <li>
                        • <code>tweet.read</code> - Read tweet content
                      </li>
                      <li>
                        • <code>like.read</code> - Read user's liked tweets
                      </li>
                      <li>
                        • <code>offline.access</code> - Refresh tokens
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> After setting up environment variables, restart your development server
                    for changes to take effect.
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
