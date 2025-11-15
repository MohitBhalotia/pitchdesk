"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  User,
  Bot,
  BarChart3,
  Search,
  Trophy,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

interface Pitch {
  _id: string;
  title: string;
  duration: number;
  conversationHistory: Message[];
  startTime: string;
  updatedAt: string;
  competitionId?: string;
}

interface CompetitionScores {
  ProblemMarketOpportunity: number;
  SolutionInnovation: number;
  BusinessModelScalability: number;
  TeamExecutionCapability: number;
  TractionValidation: number;
  PitchQualityCommunication: number;
  TotalScore: number;
  BusinessInvestabilityConfidence: number;
}

interface CompetitionEvaluation {
  _id: string;
  userId: string;
  pitchId: string;
  competitionId: string;
  scores: CompetitionScores;
  summary: string;
  createdAt: string;
}

const MAX_SCORES = {
  ProblemMarketOpportunity: 20,
  SolutionInnovation: 20,
  BusinessModelScalability: 15,
  TeamExecutionCapability: 20,
  TractionValidation: 15,
  PitchQualityCommunication: 10,
  TotalScore: 100,
  BusinessInvestabilityConfidence: 100,
};

const PieChart = ({
  score,
  maxScore,
  label,
  color,
  size = 100,
}: {
  score: number;
  maxScore: number;
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
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
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
            {score}
          </span>
          <span className="text-xs text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground mt-2 text-center max-w-[80px]">
        {label}
      </span>
    </div>
  );
};

const ScoreCard = ({
  title,
  score,
  maxScore,
  color,
}: {
  title: string;
  score: number;
  maxScore: number;
  color: string;
}) => {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
        <PieChart
          score={score}
          maxScore={maxScore}
          label=""
          color={color}
          size={60}
        />
      </div>
      <div className="text-center">
        <span className="text-2xl font-bold text-primary">{score}</span>
        <span className="text-sm text-muted-foreground ml-1">/ {maxScore}</span>
      </div>
    </div>
  );
};

export default function TournamentPitchEvaluation() {
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [evaluation, setEvaluation] = useState<CompetitionEvaluation | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEvaluationExpanded, setIsEvaluationExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const competitionId = params?.id as string;

  useEffect(() => {
    const fetchTournamentPitchAndEvaluate = async () => {
      if (status === "loading") return;

      try {
        setIsLoading(true);
        
        // Fetch the tournament pitch
        const pitchResponse = await fetch(`/api/tournament-pitch?competitionId=${competitionId}`);
        if (!pitchResponse.ok) throw new Error("Failed to fetch tournament pitch");

        const pitchData = await pitchResponse.json();
        const pitchDataObj = pitchData.pitch;
        setPitch(pitchDataObj);

        // If pitch exists, automatically evaluate it
        if (pitchDataObj) {
          await evaluatePitch(pitchDataObj._id);
        }
      } catch (error) {
        console.error("Error fetching tournament pitch:", error);
        setPitch(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournamentPitchAndEvaluate();
  }, [session, status, competitionId]);

  const evaluatePitch = async (pitchId: string) => {
    try {
      setIsEvaluating(true);
      const response = await fetch('/api/tournament-pitch/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitchId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to evaluate pitch');
      }

      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setIsEvaluationExpanded(true);
      }
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const togglePitchExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleEvaluationExpansion = () => {
    setIsEvaluationExpanded(!isEvaluationExpanded);
  };

  const filteredMessages = pitch?.conversationHistory?.filter((msg) =>
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformanceLabel = (score: number) =>
    score >= 85 ? "Excellent" :
    score >= 70 ? "Good" :
    score >= 50 ? "Fair" : "Needs Improvement";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">
                  Please log in to view your competition pitch
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Competition Pitch
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Review your competition pitch submission and evaluation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <Badge variant="secondary" className="px-3 py-1">
              Competition Pitch
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversation content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {/* Pitch Loading Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            {/* Evaluation Loading Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !pitch ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  No competition pitch found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  You haven't submitted a pitch for this competition yet
                </p>
                <Button
                  onClick={() => router.push(`/competitions/${competitionId}`)}
                  className="mt-4"
                >
                  Go to Competition
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Pitch Card */}
            <Card key={pitch._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2 flex-wrap">
                        {pitch.title}
                        {isEvaluating && (
                          <Badge variant="outline" className="ml-2">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Evaluating...
                          </Badge>
                        )}
                      </CardTitle>
                    </div>

                    <CardDescription className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(pitch.startTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(pitch.duration || 0)}
                      </span>
                      <Badge variant="outline">
                        {pitch.conversationHistory?.length || 0} messages
                      </Badge>
                      {searchTerm && (
                        <Badge variant="secondary">
                          {filteredMessages.length} matches
                        </Badge>
                      )}
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePitchExpansion}
                      className="flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" /> Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" /> Expand
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
                      <div className="space-y-4">
                        {(searchTerm ? filteredMessages : pitch.conversationHistory || []).map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-full sm:max-w-lg rounded-xl p-3 sm:p-4 ${msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                                }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className={`rounded-full p-1 ${msg.role === "user"
                                    ? "bg-primary-foreground/20"
                                    : "bg-muted-foreground/20"
                                    }`}
                                >
                                  {msg.role === "user" ? (
                                    <User className="h-3 w-3" />
                                  ) : (
                                    <Bot className="h-3 w-3" />
                                  )}
                                </div>
                                <span className="text-xs font-medium capitalize">
                                  {msg.role}
                                </span>
                                <span
                                  className={`text-xs ml-4 ${msg.role === "user"
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                    }`}
                                >
                                  {new Date(
                                    msg.timestamp
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm break-words">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Evaluation Card */}
            {isEvaluating ? (
              <Card className="overflow-hidden border-primary/20">
                <CardHeader className="pb-3 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                    <CardTitle className="text-lg sm:text-xl">
                      Evaluating Pitch...
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Analyzing your pitch against competition criteria
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your pitch is being evaluated across 6 competition dimensions
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : evaluation ? (
              <Card className="overflow-hidden border-primary/20">
                <CardHeader className="pb-3 bg-primary/5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Pitch Evaluation
                      </CardTitle>
                      <CardDescription>
                        Competition scoring based on 6 key dimensions
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {evaluation.scores.TotalScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Score</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleEvaluationExpansion}
                        className="flex items-center gap-1"
                      >
                        {isEvaluationExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" /> Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" /> Expand
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isEvaluationExpanded && (
                  <CardContent className="pt-6 space-y-6">
                    {/* Overall Score */}
                    <div className="bg-card rounded-lg border p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
                          <p className="text-muted-foreground text-sm">
                            Total Score: {evaluation.scores.TotalScore}/100
                          </p>
                          <div className="mt-3">
                            <Badge variant="secondary">
                              {getPerformanceLabel(evaluation.scores.TotalScore)}
                            </Badge>
                          </div>
                        </div>
                        <PieChart
                          score={evaluation.scores.TotalScore}
                          maxScore={100}
                          label="Total Score"
                          color="var(--color-primary)"
                          size={100}
                        />
                      </div>
                    </div>

                    {/* Score Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <ScoreCard
                        title="Problem & Market"
                        score={evaluation.scores.ProblemMarketOpportunity}
                        maxScore={20}
                        color="var(--color-chart-1)"
                      />
                      <ScoreCard
                        title="Solution & Innovation"
                        score={evaluation.scores.SolutionInnovation}
                        maxScore={20}
                        color="var(--color-chart-2)"
                      />
                      <ScoreCard
                        title="Business Model"
                        score={evaluation.scores.BusinessModelScalability}
                        maxScore={15}
                        color="var(--color-chart-3)"
                      />
                      <ScoreCard
                        title="Team & Execution"
                        score={evaluation.scores.TeamExecutionCapability}
                        maxScore={20}
                        color="var(--color-chart-4)"
                      />
                      <ScoreCard
                        title="Traction & Validation"
                        score={evaluation.scores.TractionValidation}
                        maxScore={15}
                        color="var(--color-chart-5)"
                      />
                      <ScoreCard
                        title="Pitch Quality"
                        score={evaluation.scores.PitchQualityCommunication}
                        maxScore={10}
                        color="var(--color-chart-6)"
                      />
                    </div>

                    {/* Confidence Score */}
                    <div className="bg-card rounded-lg border p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Business Investability Confidence
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-4">
                            <div
                              className="bg-chart-2 h-4 rounded-full transition-all duration-500"
                              style={{
                                width: `${evaluation.scores.BusinessInvestabilityConfidence}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-chart-2">
                          {evaluation.scores.BusinessInvestabilityConfidence}%
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-card rounded-lg border p-6">
                      <h3 className="text-lg font-semibold mb-4">Summary</h3>
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
                  </CardContent>
                )}
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">
                      Evaluation not available
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      There was an issue evaluating your pitch
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}