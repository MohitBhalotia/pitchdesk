"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AIGenerationLoader from "@/components/AIGenerationLoader";

interface EvaluationScores {
  Introduction: Record<string, number>;
  PitchContent: Record<string, number>;
  QandAHandling: Record<string, number>;
  BusinessInvestability: Record<string, number>;
  TotalScore: number;
  BusinessInvestabilityConfidence: number;
}

interface PitchEvaluation {
  _id: string;
  userId: string;
  pitchId: string;
  scores: EvaluationScores;
  summary: string;
  createdAt: string;
}

interface CriterionFeedback {
  score_received: number;
  max_score: number;
  marks_lost: number;
  reason: string;
  how_to_improve: string;
}

interface SectionSummary {
  strengths: string[];
  gaps: string[];
  improvements: string[];
}

interface SectionImprovement {
  criteria_feedback: Record<string, CriterionFeedback>;
  summary: SectionSummary;
}

interface PitchImprovement {
  _id: string;
  userId: string;
  pitchId: string;
  evaluationId: string;
  section_wise_improvements: Record<string, SectionImprovement>;
  createdAt: string;
}

// Exact max scores from backend system prompt
const MICRO_MAX_SCORES: Record<string, Record<string, number>> = {
  "Introduction": {
    "Clarity of Speech": 2,
    "Confidence & Presence": 2,
    "Hook / Attention Grabber": 2,
    "Relevance to Audience": 2,
    "Personal Branding / Credibility": 2,
  },
  "Pitch Content": {
    "Structure & Flow": 5,
    "Clarity & Conciseness": 5,
    "Value Proposition": 5,
    "Supporting Evidence": 5,
    "Audience Engagement": 4,
    "Storytelling / Narrative": 3,
    "Persuasiveness": 4,
    "Creativity / Originality": 4,
  },
  "Q&A Handling": {
    "Comprehension of Questions": 5,
    "Clarity of Answers": 5,
    "Accuracy / Knowledge Depth": 5,
    "Problem-Solving Ability": 5,
    "Handling Challenging Questions": 5,
  },
  "Business Investability": {
    "Market Opportunity & TAM/SAM/SOM": 5,
    "Unit Economics & Profitability": 5,
    "Revenue Model & Scalability": 5,
    "Competitive Advantage / Moat": 4,
    "Traction & KPIs": 4,
    "Team & Execution Capability": 4,
    "Funding Ask & Use of Proceeds": 2,
    "Risk Mitigation & Barriers": 2,
  },
};

// Section max scores (sum of all criteria in each section)
const SECTION_MAX_SCORES: Record<string, number> = {
  "Introduction": 10,
  "Pitch Content": 35,
  "Q&A Handling": 25,
  "Business Investability": 30,
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

// Get the max score for a specific criterion
const getCriterionMax = (sectionName: string, criterionName: string): number => {
  return MICRO_MAX_SCORES[sectionName]?.[criterionName] || 5;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const computeSectionSubtotal = (section: any): number => {
  if (!section || typeof section !== "object") return 0;

  // Use the Subtotal if it exists (from backend)
  if (typeof section.Subtotal === "number") {
    return Number.parseFloat(section.Subtotal.toFixed(1));
  }

  // Otherwise calculate from individual scores
  const values = Object.entries(section)
    .filter(([k, v]) => k !== "Subtotal" && typeof v === "number" && !Number.isNaN(v))
    .map(([, v]) => v as number);

  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Number.parseFloat(sum.toFixed(1));
};

// Get section max score
const getSectionMax = (sectionName: string): number => {
  return SECTION_MAX_SCORES[sectionName] || 0;
};

const computeRawTotal = (scores: EvaluationScores): number => {
  const subs = [
    computeSectionSubtotal(scores.Introduction),
    computeSectionSubtotal(scores.PitchContent),
    computeSectionSubtotal(scores.QandAHandling),
    computeSectionSubtotal(scores.BusinessInvestability),
  ];
  return Number.parseFloat(subs.reduce((s, n) => s + n, 0).toFixed(1));
};

const getPerformanceLabel = (p: number) =>
  p >= 85
    ? "Excellent"
    : p >= 70
      ? "Good"
      : p >= 50
        ? "Fair"
        : "Needs Improvement";

// Pie Chart Component with consistent direction
const PieChart = ({
  score,
  maxScore = 5,
  label,
  color,
  size = 100,
}: {
  score: number;
  maxScore?: number;
  label: string;
  color?: string;
  size?: number;
}) => {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((score / maxScore) * 100, 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
          <span className="text-xl font-bold text-card-foreground">
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground mt-2 text-center">
        {label}
      </span>
    </div>
  );
};

// Score Breakdown Component
const ScoreBreakdownChart = ({ scores }: { scores: EvaluationScores }) => {
  const sectionData = [
    {
      label: "Introduction",
      score: computeSectionSubtotal(scores.Introduction),
      maxScore: getSectionMax("Introduction"),
      color: "var(--color-chart-1)",
    },
    {
      label: "Pitch Content",
      score: computeSectionSubtotal(scores.PitchContent),
      maxScore: getSectionMax("Pitch Content"),
      color: "var(--color-chart-2)",
    },
    {
      label: "Q&A Handling",
      score: computeSectionSubtotal(scores.QandAHandling),
      maxScore: getSectionMax("Q&A Handling"),
      color: "var(--color-chart-3)",
    },
    {
      label: "Business & Investability",
      score: computeSectionSubtotal(scores.BusinessInvestability),
      maxScore: getSectionMax("Business Investability"),
      color: "var(--color-chart-4)",
    },
  ];

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Score Breakdown
      </h3>
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
  );
};

// Score Card Component for individual sections
const ScoreCard = ({
  title,
  data,
  sectionName,
  color,
}: {
  title: string;
  data: Record<string, number>;
  sectionName: string;
  color: string;
}) => {
  if (!data || typeof data !== "object") return null;

  const subtotal = computeSectionSubtotal(data);
  const sectionMax = getSectionMax(sectionName);
  const criteriaCount = Object.keys(data).filter(k => k !== "Subtotal").length;

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <PieChart
          score={subtotal}
          maxScore={sectionMax}
          label="Score"
          color={color}
          size={80}
        />
      </div>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          if (key !== "Subtotal" && typeof value === "number") {
            const criterionMax = getCriterionMax(sectionName, key);
            return (
              <div key={key} className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-card-foreground">
                    {(value as number).toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {criterionMax}
                  </span>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <span className="font-semibold text-card-foreground">Subtotal</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">{subtotal.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">/ {sectionMax}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {criteriaCount} criteria
      </div>
    </div>
  );
};

export default function EvaluationPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  // Extract and clean pitchId
  let pitchId = decodeURIComponent(params?.pitchId as string);
  if (pitchId.startsWith("pitchId=")) {
    pitchId = pitchId.replace("pitchId=", "");
  }

  // Tab state
  const [activeTab, setActiveTab] = useState<"evaluation" | "analysis">("evaluation");

  // Evaluation state
  const [evaluation, setEvaluation] = useState<PitchEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Improvement state
  const [improvement, setImprovement] = useState<PitchImprovement | null>(null);
  const [improvementLoading, setImprovementLoading] = useState(false);
  const [improvementError, setImprovementError] = useState<string | null>(null);
  const [generatingImprovement, setGeneratingImprovement] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch evaluation on page load
  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!pitchId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pitch-eval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pitchId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch evaluation");
        }

        if (data.evaluation) {
          setEvaluation(data.evaluation);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [pitchId]);

  // Generate or regenerate evaluation
  const generateEvaluation = async () => {
    if (!pitchId) return;

    try {
      setGenerating(true);
      setError(null);

      const response = await fetch("/api/pitch-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate evaluation");
      }

      setEvaluation(data.evaluation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate evaluation"
      );
    } finally {
      setGenerating(false);
    }
  };

  // Fetch improvement analysis
  const fetchImprovement = async () => {
    if (!pitchId) return;

    try {
      setImprovementLoading(true);
      setImprovementError(null);

      const response = await fetch("/api/pitch-improvements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch improvement analysis");
      }

      if (data.improvement) {
        setImprovement(data.improvement);
      }
    } catch (err) {
      setImprovementError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setImprovementLoading(false);
    }
  };

  // Generate improvement analysis
  const generateImprovement = async () => {
    if (!pitchId) return;

    try {
      setGeneratingImprovement(true);
      setImprovementError(null);

      const response = await fetch("/api/pitch-improvements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate improvement analysis");
      }

      setImprovement(data.improvement);
    } catch (err) {
      setImprovementError(
        err instanceof Error ? err.message : "Failed to generate improvement analysis"
      );
    } finally {
      setGeneratingImprovement(false);
    }
  };

  // Fetch improvement when switching to analysis tab
  useEffect(() => {
    if (activeTab === "analysis" && !improvement && !improvementLoading && evaluation) {
      fetchImprovement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, evaluation]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading evaluation...</p>
        </div>
      </div>
    );
  }

  const rawTotal = evaluation ? computeRawTotal(evaluation.scores) : 0;
  //const performanceLabel = evaluation ? getPerformanceLabel(totalScore) : ""

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Pitch Evaluation
          </h1>
          <p className="text-muted-foreground mt-2">
            Detailed analysis of your pitch performance
          </p>
        </div>

        {/* Tab Toggle */}
        {evaluation && (
          <div className="mb-6 bg-card rounded-lg border shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab("evaluation")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === "evaluation"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Evaluation
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === "analysis"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Analysis & Improvements
            </button>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-destructive">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
          <>
            {generating ? (
              <AIGenerationLoader type="evaluation" />
            ) : (
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
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    No Evaluation Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Generate an evaluation for this pitch to see detailed scores and
                    feedback.
                  </p>
                  <button
                    onClick={generateEvaluation}
                    disabled={generating}
                    className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Generate Evaluation
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Evaluation Results */}
        {evaluation && activeTab === "evaluation" && (
          <div className="space-y-6">
            {/* Overall Score Card with Pie Chart */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Overall Score
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Based on comprehensive analysis of all sections (each
                    criterion scored out of 5)
                  </p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                      <span className="text-muted-foreground">
                        Introduction
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                      <span className="text-muted-foreground">
                        Pitch Content
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                      <span className="text-muted-foreground">
                        Q&A Handling
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                      <span className="text-muted-foreground">Business</span>
                    </div>
                  </div>

                </div>
                <div className="flex items-center gap-8">
                  <PieChart
                    score={rawTotal}
                    maxScore={100}
                    label="Total Score"
                    color="var(--color-primary)"
                    size={120}
                  />
                  <div className="text-center">
                    <div className="mt-3 inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {getPerformanceLabel(rawTotal)}
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
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (0-100%)
                </span>
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-chart-2 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${clamp(evaluation.scores.BusinessInvestabilityConfidence, 0, 100)}%`,
                      }}
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
                sectionName="Introduction"
                color="var(--color-chart-1)"
              />
              <ScoreCard
                title="Pitch Content"
                data={evaluation.scores.PitchContent}
                sectionName="Pitch Content"
                color="var(--color-chart-2)"
              />
              <ScoreCard
                title="Q&A Handling"
                data={evaluation.scores.QandAHandling}
                sectionName="Q&A Handling"
                color="var(--color-chart-3)"
              />
              <ScoreCard
                title="Business Investability"
                data={evaluation.scores.BusinessInvestability}
                sectionName="Business Investability"
                color="var(--color-chart-4)"
              />
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Summary
              </h3>
              <p className="text-card-foreground/80 leading-relaxed">
                {evaluation.summary}
              </p>
            </div>

            {/* Metadata */}
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground">
                Evaluation generated on{" "}
                {new Date(evaluation.createdAt).toLocaleDateString()} at{" "}
                {new Date(evaluation.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* Improvement Analysis View */}
        {evaluation && activeTab === "analysis" && (
          <div className="space-y-6">
            {improvementError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-destructive">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-destructive">{improvementError}</p>
                </div>
              </div>
            )}

            {(improvementLoading || generatingImprovement) && (
              <AIGenerationLoader type="improvement" />
            )}

            {!improvement && !improvementLoading && !improvementError && !generatingImprovement && (
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
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    No Improvement Analysis Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Generate an improvement analysis to see detailed feedback and suggestions.
                  </p>
                  <button
                    onClick={generateImprovement}
                    disabled={generatingImprovement}
                    className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Generate Improvement Analysis
                  </button>
                </div>
              </div>
            )}

            {improvement && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Pitch Improvement Analysis
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Detailed feedback on each criterion with actionable improvement suggestions
                  </p>
                </div>

                {/* Section-wise Improvements */}
                {Object.entries(improvement.section_wise_improvements).map(([sectionName, sectionData]) => {
                  const sectionColor =
                    sectionName === "Introduction" ? "var(--color-chart-1)" :
                      sectionName === "Pitch Content" ? "var(--color-chart-2)" :
                        sectionName === "Q&A Handling" ? "var(--color-chart-3)" :
                          "var(--color-chart-4)";

                  return (
                    <div key={sectionName} className="bg-card rounded-lg border shadow-sm p-6">
                      {/* Section Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-1 h-8 rounded-full"
                          style={{ backgroundColor: sectionColor }}
                        ></div>
                        <h3 className="text-lg font-semibold text-card-foreground">
                          {sectionName}
                        </h3>
                      </div>

                      {/* Criteria Feedback */}
                      <div className="space-y-4 mb-6">
                        {Object.entries(sectionData.criteria_feedback).map(([criterionName, feedback]) => (
                          <div key={criterionName} className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-card-foreground">
                                {criterionName}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-card-foreground">
                                  {feedback.score_received.toFixed(1)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  / {feedback.max_score}
                                </span>
                                {feedback.marks_lost > 0 && (
                                  <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                                    -{feedback.marks_lost.toFixed(1)} marks lost
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-muted rounded-full h-2 mb-3">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(feedback.score_received / feedback.max_score) * 100}%`,
                                  backgroundColor: sectionColor,
                                }}
                              ></div>
                            </div>

                            {/* Reason */}
                            <div className="mb-3">
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                Why marks were lost:
                              </p>
                              <p className="text-sm text-card-foreground/80">
                                {feedback.reason}
                              </p>
                            </div>

                            {/* How to Improve */}
                            <div className="bg-primary/5 border border-primary/10 rounded-md p-3">
                              <p className="text-sm font-medium text-primary mb-1">
                                💡 How to improve:
                              </p>
                              <p className="text-sm text-card-foreground/80">
                                {feedback.how_to_improve}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Section Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                        {/* Strengths */}
                        <div className="bg-mint-deep/10 border border-mint-deep/20 rounded-lg p-4">
                          <h5 className="font-medium text-mint-deep mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Strengths
                          </h5>
                          <ul className="space-y-1">
                            {sectionData.summary.strengths.map((strength, idx) => (
                              <li key={idx} className="text-sm text-card-foreground/80">
                                • {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Gaps */}
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <h5 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Gaps
                          </h5>
                          <ul className="space-y-1">
                            {sectionData.summary.gaps.map((gap, idx) => (
                              <li key={idx} className="text-sm text-card-foreground/80">
                                • {gap}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Improvements */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                            </svg>
                            Key Actions
                          </h5>
                          <ul className="space-y-1">
                            {sectionData.summary.improvements.map((improvement, idx) => (
                              <li key={idx} className="text-sm text-card-foreground/80">
                                • {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Metadata */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">
                    Analysis generated on{" "}
                    {new Date(improvement.createdAt).toLocaleDateString()} at{" "}
                    {new Date(improvement.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
