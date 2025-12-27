"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { ConnectionStatus } from "./roas-dashboard"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

interface ConnectionBarProps {
  status: ConnectionStatus
  onConnect: (url: string) => void
  onDisconnect: () => void
  errorMessage: string
}

export function ConnectionBar({ status, onConnect, onDisconnect, errorMessage }: ConnectionBarProps) {
  const [inputUrl, setInputUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUrl.trim()) {
      onConnect(inputUrl.trim().replace(/\/$/, ""))
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
            <Wifi className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        )
      case "loading":
        return (
          <Badge variant="secondary">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Connecting...
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <WifiOff className="mr-1 h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <WifiOff className="mr-1 h-3 w-3" />
            Disconnected
          </Badge>
        )
    }
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center gap-4 px-4 py-3">
        <h1 className="text-lg font-semibold whitespace-nowrap">ROAS Prediction Dashboard</h1>

        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
          <Input
            type="url"
            placeholder="Enter Ngrok API URL (e.g., https://your-url.ngrok.io)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={status === "loading" || status === "connected"}
            className="flex-1"
          />
          {status === "connected" ? (
            <Button type="button" variant="outline" onClick={onDisconnect}>
              Disconnect
            </Button>
          ) : (
            <Button type="submit" disabled={status === "loading" || !inputUrl.trim()}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect & Initialize"
              )}
            </Button>
          )}
        </form>

        {getStatusBadge()}
      </div>
    </div>
  )
}
