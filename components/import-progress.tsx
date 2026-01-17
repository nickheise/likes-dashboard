"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImportProgressProps {
  status: "idle" | "importing" | "complete" | "error"
  progress: number
  imported?: number
  total?: number
  message?: string
  error?: string
  onRetry?: () => void
}

export function ImportProgress({
  status,
  progress,
  imported = 0,
  total = 0,
  message,
  error,
  onRetry,
}: ImportProgressProps) {
  if (status === "idle") return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          {status === "importing" && <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />}
          {status === "complete" && <CheckCircle className="w-8 h-8 mx-auto text-green-500" />}
          {status === "error" && <AlertCircle className="w-8 h-8 mx-auto text-red-500" />}
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {status === "importing" && "Fetching Your Likes"}
          {status === "complete" && "Import Complete!"}
          {status === "error" && "Import Failed"}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          {error || message || (total > 0 ? `${imported} of ${total} likes imported` : "Connecting to X.com API...")}
        </p>

        {status === "importing" && <Progress value={progress} className="w-full mb-2" />}

        {status === "error" && onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}

        {status === "importing" && <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>}
      </CardContent>
    </Card>
  )
}
