"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface PredictionFormProps {
  apiUrl: string
}

interface PredictionResult {
  status: string
  predicted_roas: number
  decision: string
}

const PLATFORMS = ["Facebook", "Google", "Instagram", "LinkedIn", "Twitter"]
const CONTENT_TYPES = ["Video", "Image", "Text", "Carousel"]
const AGE_GROUPS = ["18-24", "25-34", "35-44", "45-54", "55+"]
const GENDERS = ["All", "Male", "Female"]
const REGIONS = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"]

export function PredictionForm({ apiUrl }: PredictionFormProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    Budget: "",
    Clicks: "",
    CTR: "",
    CPC: "",
    Conversions: "",
    CPA: "",
    Conversion_Rate: "",
    Duration: "",
    Revenue: "",
    Spend: "",
    Impressions: "",
    Platform: "",
    Content_Type: "",
    Target_Age: "",
    Target_Gender: "",
    Region: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          Budget: Number.parseFloat(formData.Budget) || 0,
          Clicks: Number.parseInt(formData.Clicks) || 0,
          CTR: Number.parseFloat(formData.CTR) || 0,
          CPC: Number.parseFloat(formData.CPC) || 0,
          Conversions: Number.parseInt(formData.Conversions) || 0,
          CPA: Number.parseFloat(formData.CPA) || 0,
          Conversion_Rate: Number.parseFloat(formData.Conversion_Rate) || 0,
          Duration: Number.parseInt(formData.Duration) || 0,
          Revenue: Number.parseFloat(formData.Revenue) || 0,
          Spend: Number.parseFloat(formData.Spend) || 0,
          Impressions: Number.parseInt(formData.Impressions) || 0,
          Platform: formData.Platform,
          Content_Type: formData.Content_Type,
          Target_Age: formData.Target_Age,
          Target_Gender: formData.Target_Gender,
          Region: formData.Region,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PredictionResult = await response.json()

      if (data.status === "error") {
        throw new Error("Prediction failed on server")
      }

      setResult(data)
    } catch (err) {
      setError("Prediction failed. Please check your inputs and try again.")
      console.error("Prediction error:", err)
    } finally {
      setLoading(false)
    }
  }

  const numericFields = [
    { name: "Budget", label: "Budget", placeholder: "e.g. 10000" },
    { name: "Clicks", label: "Clicks", placeholder: "e.g. 1200" },
    { name: "CTR", label: "CTR (%)", placeholder: "e.g. 2.5" },
    { name: "CPC", label: "CPC", placeholder: "e.g. 1.2" },
    { name: "Conversions", label: "Conversions", placeholder: "e.g. 60" },
    { name: "CPA", label: "CPA", placeholder: "e.g. 24" },
    { name: "Conversion_Rate", label: "Conversion Rate (%)", placeholder: "e.g. 5.0" },
    { name: "Duration", label: "Duration (days)", placeholder: "e.g. 30" },
    { name: "Revenue", label: "Revenue", placeholder: "e.g. 10000" },
    { name: "Spend", label: "Spend", placeholder: "e.g. 1400" },
    { name: "Impressions", label: "Impressions", placeholder: "e.g. 48000" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROAS Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {numericFields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name} className="text-sm">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type="number"
                  step="any"
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Platform</Label>
              <Select value={formData.Platform} onValueChange={(v) => handleInputChange("Platform", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Content Type</Label>
              <Select value={formData.Content_Type} onValueChange={(v) => handleInputChange("Content_Type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Target Age</Label>
              <Select value={formData.Target_Age} onValueChange={(v) => handleInputChange("Target_Age", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Target Gender</Label>
              <Select value={formData.Target_Gender} onValueChange={(v) => handleInputChange("Target_Gender", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Region</Label>
              <Select value={formData.Region} onValueChange={(v) => handleInputChange("Region", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict ROAS"
            )}
          </Button>

          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="flex items-center gap-2 py-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className="border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Prediction Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">Predicted ROAS:</span>
                  <span className="text-2xl font-bold text-emerald-600">{result.predicted_roas.toFixed(4)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground">Decision:</span>
                  <span className="text-sm font-medium">{result.decision}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
