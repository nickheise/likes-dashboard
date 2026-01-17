"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Settings, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ApiSetupBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Alert className="mb-4">
      <Settings className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>X.com API integration requires setup. Configure your API keys to fetch real likes.</span>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Setup Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>X.com API Setup</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">1. Get X.com API Access</CardTitle>
                    <CardDescription>You'll need a X.com Developer account and API keys</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      1. Visit the{" "}
                      <a
                        href="https://developer.twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        X Developer Portal <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <p className="text-sm">2. Create a new app and generate API keys</p>
                    <p className="text-sm">3. Make sure to enable OAuth 2.0 and request appropriate scopes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">2. Environment Variables</CardTitle>
                    <CardDescription>Add these to your .env.local file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                      {`TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3. API Permissions</CardTitle>
                    <CardDescription>Required scopes for fetching likes</CardDescription>
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
                    </ul>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertDescription>
                    <strong>Note:</strong> X.com API has rate limits and may require a paid plan for higher usage. The
                    free tier allows limited requests per month.
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
