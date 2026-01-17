"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Terminal, CheckCircle, X, Copy, Check, Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function DatabaseSetup() {
  const [dismissed, setDismissed] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const copyLocalUrl = async () => {
    const localUrl = "postgresql://username:password@localhost:5432/x_likes_organizer"
    await navigator.clipboard.writeText(localUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  if (dismissed) return null

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Database className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-900">Database setup required. Choose from Vercel's marketplace providers.</span>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Get DATABASE_URL
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Database Setup Options (Updated 2024)</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Vercel Marketplace Options */}
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Update:</strong> Vercel now uses marketplace providers for databases. Choose from the
                    options below.
                  </AlertDescription>
                </Alert>

                {/* Supabase via Vercel */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                      🚀 Supabase (via Vercel Marketplace) - Recommended
                    </CardTitle>
                    <CardDescription>PostgreSQL with built-in auth, real-time, and storage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                            1
                          </div>
                          <span className="text-sm font-medium">Via Vercel Dashboard</span>
                        </div>
                        <ul className="text-sm space-y-1 ml-8 text-green-700">
                          <li>• Go to Vercel Dashboard → Storage</li>
                          <li>• Click "Browse Marketplace"</li>
                          <li>• Select "Supabase"</li>
                          <li>• Click "Add Integration"</li>
                          <li>• Follow setup wizard</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                            2
                          </div>
                          <span className="text-sm font-medium">Direct Supabase</span>
                        </div>
                        <ul className="text-sm space-y-1 ml-8 text-green-700">
                          <li>
                            • Go to{" "}
                            <a href="https://supabase.com" target="_blank" className="underline" rel="noreferrer">
                              supabase.com
                            </a>
                          </li>
                          <li>• Create new project</li>
                          <li>• Go to Settings → Database</li>
                          <li>• Copy connection string</li>
                        </ul>
                      </div>
                    </div>
                    <Alert className="border-green-300 bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Free tier:</strong> 500MB database, 50MB file storage, 2 projects
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Neon */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                      ⚡ Neon - Serverless Postgres
                    </CardTitle>
                    <CardDescription>Serverless PostgreSQL with branching and autoscaling</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                          1
                        </div>
                        <span className="text-sm font-medium">Setup Steps</span>
                      </div>
                      <ul className="text-sm space-y-1 ml-8 text-purple-700">
                        <li>
                          • Go to{" "}
                          <a href="https://neon.tech" target="_blank" className="underline" rel="noreferrer">
                            neon.tech
                          </a>
                        </li>
                        <li>• Create account and new project</li>
                        <li>• Name: "x-likes-organizer"</li>
                        <li>• Copy connection string from dashboard</li>
                        <li>• Add to .env.local</li>
                      </ul>
                    </div>
                    <Alert className="border-purple-300 bg-purple-100">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        <strong>Free tier:</strong> 0.5GB storage, 1 project, perfect for development
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Railway */}
                <Card className="border-indigo-200 bg-indigo-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-indigo-800">
                      🚂 Railway - Simple Deployment
                    </CardTitle>
                    <CardDescription>Easy PostgreSQL hosting with great developer experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                          1
                        </div>
                        <span className="text-sm font-medium">Setup Steps</span>
                      </div>
                      <ul className="text-sm space-y-1 ml-8 text-indigo-700">
                        <li>
                          • Go to{" "}
                          <a href="https://railway.app" target="_blank" className="underline" rel="noreferrer">
                            railway.app
                          </a>
                        </li>
                        <li>• Create new project</li>
                        <li>• Add "PostgreSQL" service</li>
                        <li>• Go to Variables tab</li>
                        <li>• Copy DATABASE_URL</li>
                      </ul>
                    </div>
                    <Alert className="border-indigo-300 bg-indigo-100">
                      <CheckCircle className="h-4 w-4 text-indigo-600" />
                      <AlertDescription className="text-indigo-800">
                        <strong>Pricing:</strong> $5/month after trial, includes 1GB RAM, 1GB storage
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Local PostgreSQL */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">🐘 Local PostgreSQL</CardTitle>
                    <CardDescription>Run PostgreSQL on your machine (free for development)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-800">macOS</h4>
                        <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs">
                          {`brew install postgresql
brew services start postgresql`}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-800">Ubuntu/Debian</h4>
                        <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs">
                          {`sudo apt update
sudo apt install postgresql`}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-800">Windows</h4>
                        <p className="text-xs text-blue-700">
                          Download from{" "}
                          <a
                            href="https://www.postgresql.org/download/windows/"
                            target="_blank"
                            className="underline"
                            rel="noreferrer"
                          >
                            postgresql.org
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-800">Create Database & User</h4>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                        {`psql postgres
CREATE DATABASE x_likes_organizer;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE x_likes_organizer TO myuser;
\\q`}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-blue-800">Your DATABASE_URL</h4>
                        <Button onClick={copyLocalUrl} variant="outline" size="sm">
                          {copiedUrl ? (
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
                      <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                        DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/x_likes_organizer"
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Setup Commands */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      After Getting DATABASE_URL
                    </CardTitle>
                    <CardDescription>Run these commands to set up your database</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">1. Add to .env.local:</p>
                      <pre className="bg-muted p-2 rounded text-sm">DATABASE_URL="your_connection_string_here"</pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">2. Install dependencies:</p>
                      <pre className="bg-gray-900 text-green-400 p-2 rounded text-sm">
                        npm install @prisma/client prisma
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">3. Generate Prisma client:</p>
                      <pre className="bg-gray-900 text-green-400 p-2 rounded text-sm">npx prisma generate</pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">4. Create database tables:</p>
                      <pre className="bg-gray-900 text-green-400 p-2 rounded text-sm">npx prisma db push</pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">5. (Optional) View your database:</p>
                      <pre className="bg-gray-900 text-green-400 p-2 rounded text-sm">npx prisma studio</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Recommendation */}
                <Alert className="border-green-200 bg-green-50">
                  <Star className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>My Recommendation:</strong> Start with <strong>Supabase</strong> - it has the most generous
                    free tier (500MB) and integrates well with Vercel. You can always migrate later if needed.
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
