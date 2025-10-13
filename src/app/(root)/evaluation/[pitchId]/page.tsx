"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface EvaluationScores {
  Introduction: number
  PitchContent: number
  QandAHandling: number
  DeliveryAndStyle: number
  BusinessInvestability: number
  TotalScore: number
  BusinessInvestabilityConfidence: number
}

interface PitchEvaluation {
  _id: string
  userId: string
  pitchId: string
  scores: EvaluationScores
  summary: string
  createdAt: string
}

const MAX_PER_ITEM = 5

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNumericCriteria = (section: any): number[] => {
  if (!section || typeof section !== "object") return []
  return Object.entries(section)
    .filter(([k, v]) => k !== "Subtotal" && typeof v === "number" && !Number.isNaN(v))
    .map(([, v]) => clamp(v as number, 0, MAX_PER_ITEM))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const computeSectionSubtotal = (section: any): number => {
  const values = getNumericCriteria(section)
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Number.parseFloat(sum.toFixed(2))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSectionMax = (section: any): number => getNumericCriteria(section).length * MAX_PER_ITEM

const getTotalMax = (scores: EvaluationScores): number =>
  getSectionMax(scores.Introduction) +
  getSectionMax(scores.PitchContent) +
  getSectionMax(scores.QandAHandling) +
  getSectionMax(scores.DeliveryAndStyle) +
  getSectionMax(scores.BusinessInvestability)

const computeRawTotal = (scores: EvaluationScores): number => {
  const subs = [
    computeSectionSubtotal(scores.Introduction),
    computeSectionSubtotal(scores.PitchContent),
    computeSectionSubtotal(scores.QandAHandling),
    computeSectionSubtotal(scores.DeliveryAndStyle),
    computeSectionSubtotal(scores.BusinessInvestability),
  ]
  return Number.parseFloat(subs.reduce((s, n) => s + n, 0).toFixed(2))
}

const calculateTotalScore = (scores: EvaluationScores): number => {
  const rawTotal = computeRawTotal(scores)
  const totalMax = getTotalMax(scores) || 1
  return Math.round((rawTotal / totalMax) * 100)
}

const getPerformanceLabel = (p: number) =>
  p >= 85 ? "Excellent" : p >= 70 ? "Good" : p >= 50 ? "Fair" : "Needs Improvement"

// Pie Chart Component with consistent direction
const PieChart = ({
  score,
  maxScore = 5,
  label,
  color,
  size = 100,
}: {
  score: number
  maxScore?: number
  label: string
  color?: string
  size?: number
}) => {
  const radius = size * 0.4
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min((score / maxScore) * 100, 100)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle - all start from top and go clockwise */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color || "var(--color-primary)"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-card-foreground">{score.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground mt-2 text-center">{label}</span>
    </div>
  )
}

// Score Breakdown Component
const ScoreBreakdownChart = ({ scores }: { scores: EvaluationScores }) => {
  const sectionData = [
    {
      label: "Introduction",
      score: computeSectionSubtotal(scores.Introduction),
      maxScore: getSectionMax(scores.Introduction),
      color: "var(--color-chart-1)",
    },
    {
      label: "Pitch Content",
      score: computeSectionSubtotal(scores.PitchContent),
      maxScore: getSectionMax(scores.PitchContent),
      color: "var(--color-chart-2)",
    },
    {
      label: "Q&A Handling",
      score: computeSectionSubtotal(scores.QandAHandling),
      maxScore: getSectionMax(scores.QandAHandling),
      color: "var(--color-chart-3)",
    },
    {
      label: "Delivery & Style",
      score: computeSectionSubtotal(scores.DeliveryAndStyle),
      maxScore: getSectionMax(scores.DeliveryAndStyle),
      color: "var(--color-chart-4)",
    },
    {
      label: "Business",
      score: computeSectionSubtotal(scores.BusinessInvestability),
      maxScore: getSectionMax(scores.BusinessInvestability),
      color: "var(--color-chart-5)",
    },
  ]

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Score Breakdown</h3>
      <div className="flex flex-wrap justify-center gap-8">
        {sectionData.map((section) => (
          <PieChart
            key={section.label}
            score={section.score}
            maxScore={section.maxScore}
            label={section.label}
            color={section.color}
            size={90}
          />
        ))}
      </div>
    </div>
  )
}

// Score Card Component for individual sections
const ScoreCard = ({
  title,
  data,
  //maxScore = 5,
  color,
}: {
  title: string
  data: number
  maxScore?: number
  color: string
}) => {
  if (!data || typeof data !== "object") return null

  const subtotal = computeSectionSubtotal(data)
  const criteria = getNumericCriteria(data)
  const sectionMax = getSectionMax(data)

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <PieChart score={subtotal} maxScore={sectionMax} label="Score" color={color} size={80} />
      </div>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          if (key !== "Subtotal" && typeof value === "number") {
            return (
              <div key={key} className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-card-foreground">{(value as number).toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">/ {MAX_PER_ITEM}</span>
                </div>
              </div>
            )
          }
          return null
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <span className="font-semibold text-card-foreground">Subtotal</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">{subtotal.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">/ {sectionMax}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{criteria.length} criteria</div>
    </div>
  )
}

export default function EvaluationPage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)

  // Extract and clean pitchId
  let pitchId = decodeURIComponent(params.pitchId as string)
  if (pitchId.startsWith("pitchId=")) {
    pitchId = pitchId.replace("pitchId=", "")
  }

  const [evaluation, setEvaluation] = useState<PitchEvaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch evaluation on page load
  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!pitchId) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/pitch-eval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pitchId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch evaluation")
        }

        if (data.evaluation) {
          setEvaluation(data.evaluation)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [pitchId])

  // Generate or regenerate evaluation
  const generateEvaluation = async () => {
    if (!pitchId) return

    try {
      setGenerating(true)
      setError(null)

      const response = await fetch("/api/pitch-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate evaluation")
      }

      setEvaluation(data.evaluation)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate evaluation")
    } finally {
      setGenerating(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading evaluation...</p>
        </div>
      </div>
    )
  }

  const totalScore = evaluation ? calculateTotalScore(evaluation.scores) : 0
  const rawTotal = evaluation ? computeRawTotal(evaluation.scores) : 0
  const totalMax = evaluation ? getTotalMax(evaluation.scores) : 0
  //const performanceLabel = evaluation ? getPerformanceLabel(totalScore) : ""

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Pitch Evaluation</h1>
          <p className="text-muted-foreground mt-2">Detailed analysis of your pitch performance</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-destructive">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Generate Evaluation Button */}
        {!evaluation && !loading && (
          <div className="text-center py-12">
            <div className="bg-card rounded-lg border shadow-sm p-8">
              <svg
                className="w-16 h-16 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-card-foreground mb-2">No Evaluation Found</h3>
              <p className="text-muted-foreground mb-6">
                Generate an evaluation for this pitch to see detailed scores and feedback.
              </p>
              <button
                onClick={generateEvaluation}
                disabled={generating}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {generating ? "Generating Evaluation..." : "Generate Evaluation"}
              </button>
            </div>
          </div>
        )}

        {/* Evaluation Results */}
        {evaluation && (
          <div className="space-y-6">
            {/* Overall Score Card with Pie Chart */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-card-foreground">Overall Score</h2>
                  <p className="text-muted-foreground mt-1">
                    Based on comprehensive analysis of all sections (each criterion scored out of 5)
                  </p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                      <span className="text-muted-foreground">Introduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                      <span className="text-muted-foreground">Pitch Content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                      <span className="text-muted-foreground">Q&A Handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                      <span className="text-muted-foreground">Delivery & Style</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-5"></div>
                      <span className="text-muted-foreground">Business</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <strong>Scoring System:</strong> Each criterion is out of 5 points. A section&apos;s maximum
                      equals its criteria count × 5. Overall maximum equals the sum of all sections&apos; maximums.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <PieChart
                    score={totalScore}
                    maxScore={100}
                    label="Total Score"
                    color="var(--color-primary)"
                    size={120}
                  />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      {totalScore}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-1 inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {getPerformanceLabel(totalScore)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Overall Performance</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {`${rawTotal.toFixed(1)} / ${totalMax || 0} points`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <ScoreBreakdownChart scores={evaluation.scores} />

            {/* Confidence Score */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Business Investability Confidence
                <span className="text-sm font-normal text-muted-foreground ml-2">(0-100%)</span>
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-chart-2 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${clamp(evaluation.scores.BusinessInvestabilityConfidence, 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-chart-2">
                    {evaluation.scores.BusinessInvestabilityConfidence}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {"Confidence level in the business's investment potential"}
              </div>
            </div>

            {/* Section Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScoreCard
                title="Introduction"
                data={evaluation.scores.Introduction}
                maxScore={5}
                color="var(--color-chart-1)"
              />
              <ScoreCard
                title="Pitch Content"
                data={evaluation.scores.PitchContent}
                maxScore={5}
                color="var(--color-chart-2)"
              />
              <ScoreCard
                title="Q&A Handling"
                data={evaluation.scores.QandAHandling}
                maxScore={5}
                color="var(--color-chart-3)"
              />
              <ScoreCard
                title="Delivery & Style"
                data={evaluation.scores.DeliveryAndStyle}
                maxScore={5}
                color="var(--color-chart-4)"
              />
              <ScoreCard
                title="Business Investability"
                data={evaluation.scores.BusinessInvestability}
                maxScore={5}
                color="var(--color-chart-5)"
              />
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Summary</h3>
              <p className="text-card-foreground/80 leading-relaxed">{evaluation.summary}</p>
            </div>

            {/* Metadata */}
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground">
                Evaluation generated on {new Date(evaluation.createdAt).toLocaleDateString()} at{" "}
                {new Date(evaluation.createdAt).toLocaleTimeString()}
              </div>
            </div>

            {/* Regenerate Button */}
            <div className="text-center">
              <button
                onClick={generateEvaluation}
                disabled={generating}
                className="bg-secondary hover:bg-secondary/80 disabled:bg-secondary/50 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {generating ? "Regenerating Evaluation..." : "Regenerate Evaluation"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
