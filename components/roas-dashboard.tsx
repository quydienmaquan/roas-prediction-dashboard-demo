"use client"

import { useState } from "react"
import { ConnectionBar } from "./connection-bar"
import { MetricsRow } from "./metrics-row"
import { PredictionForm } from "./prediction-form"
import { VisualizationCharts } from "./visualization-charts"
import { Card, CardContent } from "@/components/ui/card"

export interface Metrics {
  r2_score: number
  rmse: number
  mae: number
  mse?: number
}

export interface ScatterDataPoint {
  Actual: number
  Predicted: number
}

export interface FeatureImportance {
  feature: string
  importance: number
}

export interface DashboardData {
  status: string
  model_info: string
  data: Record<string, unknown>[]
  metrics: Metrics
  feature_importance: FeatureImportance[]
  visualizations: {
    roas_distribution: {
      labels: string[]
      values: number[]
    }
    scatter_data: ScatterDataPoint[]
  }
}

export type ConnectionStatus = "disconnected" | "loading" | "connected" | "error"

export function ROASDashboard() {
  const [apiUrl, setApiUrl] = useState("")
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [data, setData] = useState<DashboardData | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleConnect = async (url: string) => {
    const normalizedUrl = url.trim().replace(/\/+$/, "")
    setApiUrl(normalizedUrl)
    setStatus("loading")
    setErrorMessage("")

    const endpoint = `${normalizedUrl}/load-data`
    console.log("[v0] Attempting to connect to:", endpoint)

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true", // Add ngrok-skip-browser-warning header to bypass Ngrok's HTML warning page
        },
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response content-type:", response.headers.get("content-type"))

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.log("[v0] Non-JSON response received:", text.substring(0, 200))
        throw new Error(`Server returned non-JSON response. Make sure your backend is running and the URL is correct.`)
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: DashboardData = await response.json()
      console.log("[v0] Received data:", result)

      if (result.status === "error") {
        throw new Error("Backend returned error status")
      }

      setData(result)
      setStatus("connected")
    } catch (error) {
      setStatus("error")
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setErrorMessage("Network error. Check if your backend is running and accessible.")
      } else if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Connection Failed. Check URL or Backend.")
      }
      console.error("[v0] Connection error:", error)
    }
  }

  const handleDisconnect = () => {
    setStatus("disconnected")
    setData(null)
    setApiUrl("")
    setErrorMessage("")
  }

  return (
    <div className="min-h-screen bg-background">
      <ConnectionBar
        status={status}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        errorMessage={errorMessage}
      />

      <main className="container mx-auto px-4 py-6">
        {status === "disconnected" && (
          <Card className="mt-20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-muted-foreground text-lg">Please enter API URL to load data</div>
            </CardContent>
          </Card>
        )}

        {status === "loading" && (
          <Card className="mt-20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <div className="mt-4 text-muted-foreground">Loading data...</div>
            </CardContent>
          </Card>
        )}

        {status === "error" && (
          <Card className="mt-20 border-destructive">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-destructive text-lg font-medium">{errorMessage}</div>
            </CardContent>
          </Card>
        )}

        {status === "connected" && data && (
          <div className="space-y-6">
            <MetricsRow metrics={data.metrics} />

            <div className="grid gap-6 lg:grid-cols-2">
              <PredictionForm apiUrl={apiUrl} />

              <VisualizationCharts
                scatterData={data.visualizations.scatter_data}
                featureImportance={data.feature_importance}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
