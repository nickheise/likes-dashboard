"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, ExternalLink, CheckCircle, X, Copy, Check, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function SupabaseSetup() {
  const [dismissed, setDismissed] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState("")

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedUrl(type)
    setTimeout(() => setCopiedUrl(""), 2000)
  }

  if (dismissed) return null

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <Database className="h-4 w-4 text-green-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-green-900">
          <strong>Supabase Setup:</strong> Follow the step-by-step guide to create your database.
        </span>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                Supabase Setup Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Complete Supabase Setup for X Likes Organizer</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Step 1: Create Account */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                        1
                      </div>
                      Create Supabase Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                      <span>
                        Go to{" "}
                        <a
                          href="https://supabase.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline font-medium inline-flex items-center gap-1"
                        >
                          supabase.com <ExternalLink className="h-3 w-3" />
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                      <span>Click "Start your project" or "Sign up"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                      <span>Sign up with GitHub, Google, or email</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Create Project */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                        2
                      </div>
                      Create New Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-800">Project Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>Click "New project"</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>
                              <strong>Name:</strong>{" "}
                              <code className="bg-green-100 px-1 rounded">x-likes-organizer</code>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>
                              <strong>Database Password:</strong> Generate strong password
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>
                              <strong>Region:</strong> Choose closest to you
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-800">Recommended Settings</h4>
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <div className="text-sm space-y-1">
                            <div>
                              <strong>Project Name:</strong> x-likes-organizer
                            </div>
                            <div>
                              <strong>Plan:</strong> Free tier (perfect for this project)
                            </div>
                            <div>
                              <strong>Region:</strong> US East (N. Virginia) or closest
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Alert className="border-green-300 bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Save your database password!</strong> You'll need it for the connection string.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Step 3: Get Connection String */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                        3
                      </div>
                      Get DATABASE_URL
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-800">Navigation Steps</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>Wait for project to be created (~2 minutes)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>Go to project dashboard</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>Click "Settings" in left sidebar</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>Click "Database" under Settings</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-green-600" />
                            <span>Scroll to "Connection string"</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-800">Connection String</h4>
                        <div className="space-y-2">
                          <p className="text-sm">Look for the "URI" connection string:</p>
                          <div className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                            postgresql://postgres:[YOUR-PASSWORD]@db.abc123.supabase.co:5432/postgres
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Replace [YOUR-PASSWORD] with your actual database password
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 4: Add to Environment */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                        4
                      </div>
                      Add to .env.local
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Create or update your .env.local file:</p>
                      <div className="relative">
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                          {`# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@db.abc123.supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# X.com OAuth Configuration
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here`}
                        </pre>
                        <Button
                          onClick={() =>
                            copyToClipboard(
                              `# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@db.abc123.supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# X.com OAuth Configuration
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here`,
                              "env",
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          {copiedUrl === "env" ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertDescription className="text-yellow-800">
                        <strong>Important:</strong> Replace the placeholder values with your actual credentials!
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Step 5: Setup Database */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                        5
                      </div>
                      Initialize Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">Run these commands in your terminal (in order):</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">1. Install Prisma dependencies:</p>
                        <div className="relative">
                          <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm">
                            npm install @prisma/client prisma
                          </pre>
                          <Button
                            onClick={() => copyToClipboard("npm install @prisma/client prisma", "install")}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            {copiedUrl === "install" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">2. Generate Prisma client:</p>
                        <div className="relative">
                          <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm">npx prisma generate</pre>
                          <Button
                            onClick={() => copyToClipboard("npx prisma generate", "generate")}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            {copiedUrl === "generate" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">3. Create database tables:</p>
                        <div className="relative">
                          <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm">npx prisma db push</pre>
                          <Button
                            onClick={() => copyToClipboard("npx prisma db push", "push")}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            {copiedUrl === "push" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">4. (Optional) View your database:</p>
                        <div className="relative">
                          <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm">npx prisma studio</pre>
                          <Button
                            onClick={() => copyToClipboard("npx prisma studio", "studio")}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            {copiedUrl === "studio" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 6: Verify Setup */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">
                        6
                      </div>
                      Verify Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Database tables created successfully</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Prisma Studio opens at http://localhost:5555</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Your app can now store and retrieve likes data</span>
                      </div>
                    </div>
                    <Alert className="border-green-300 bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Success!</strong> Your Supabase database is ready. You can now sync your X.com likes and
                        they'll be stored permanently.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Troubleshooting */}
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-800">🔧 Troubleshooting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-yellow-800">
                    <div>
                      <strong>Connection Error:</strong> Double-check your DATABASE_URL and password
                    </div>
                    <div>
                      <strong>Tables Not Created:</strong> Make sure you ran <code>npx prisma db push</code>
                    </div>
                    <div>
                      <strong>Environment Variables:</strong> Restart your dev server after updating .env.local
                    </div>
                    <div>
                      <strong>Need Help:</strong> Check the Supabase dashboard logs for detailed error messages
                    </div>
                  </CardContent>
                </Card>
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
