"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SyncButtonProps {
  onSync: () => Promise<any>
  syncing: boolean
  className?: string
}

export function SyncButton({ onSync, syncing, className }: SyncButtonProps) {
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSync = async () => {
    try {
      setSyncStatus("idle")
      const result = await onSync()
      setLastSync(new Date())
      setSyncStatus("success")

      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus("idle"), 3000)
    } catch (error) {
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 3000)
    }
  }

  const getIcon = () => {
    if (syncing) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (syncStatus === "success") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (syncStatus === "error") return <AlertCircle className="h-4 w-4 text-red-600" />
    return <RefreshCw className="h-4 w-4" />
  }

  const getTooltipText = () => {
    if (syncing) return "Syncing with X.com..."
    if (syncStatus === "success") return `Last synced: ${lastSync?.toLocaleTimeString()}`
    if (syncStatus === "error") return "Sync failed - click to retry"
    return "Sync with X.com to import latest likes"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing} className={className}>
            {getIcon()}
            <span className="ml-2">{syncing ? "Syncing..." : "Sync"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
