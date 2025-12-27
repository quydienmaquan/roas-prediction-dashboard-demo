"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Metrics } from "./roas-dashboard"
import { TrendingUp, Target, BarChart3 } from "lucide-react"

interface MetricsRowProps {
  metrics: Metrics
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  const metricItems = [
    {
      label: "R² Score",
      value: metrics.r2_score.toFixed(4),
      icon: TrendingUp,
      description: "Model accuracy",
    },
    {
      label: "RMSE",
      value: metrics.rmse.toFixed(4),
      icon: Target,
      description: "Root Mean Square Error",
    },
    {
      label: "MAE",
      value: metrics.mae.toFixed(4),
      icon: BarChart3,
      description: "Mean Absolute Error",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metricItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
