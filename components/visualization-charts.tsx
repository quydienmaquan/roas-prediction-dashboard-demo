"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScatterDataPoint, FeatureImportance } from "./roas-dashboard"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts"

interface VisualizationChartsProps {
  scatterData: ScatterDataPoint[]
  featureImportance: FeatureImportance[]
}

const CHART_COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(199, 89%, 48%)",
  "hsl(280, 65%, 60%)",
  "hsl(30, 80%, 55%)",
  "hsl(350, 80%, 55%)",
]

export function VisualizationCharts({ scatterData, featureImportance }: VisualizationChartsProps) {
  const sortedFeatures = [...featureImportance].sort((a, b) => b.importance - a.importance).slice(0, 10)

  // Calculate max value for reference line
  const maxActual = scatterData.length > 0 ? Math.max(...scatterData.map((d) => d.Actual)) : 10
  const maxPredicted = scatterData.length > 0 ? Math.max(...scatterData.map((d) => d.Predicted)) : 10
  const maxValue = Math.max(maxActual, maxPredicted)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actual vs Predicted ROAS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  dataKey="Actual"
                  name="Actual ROAS"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Actual ROAS",
                    position: "bottom",
                    offset: 20,
                    fontSize: 12,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="Predicted"
                  name="Predicted ROAS"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Predicted ROAS",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => value.toFixed(4)}
                />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: maxValue, y: maxValue },
                  ]}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                />
                <Scatter name="ROAS" data={scatterData} fill="hsl(221, 83%, 53%)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Feature Importance (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedFeatures} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={95}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => value.toFixed(4)}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {sortedFeatures.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
