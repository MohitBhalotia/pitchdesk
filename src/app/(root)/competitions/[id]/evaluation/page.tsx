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
  ArrowLeft,
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
    <div className="bg-card rounded-lg border p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-card-foreground truncate flex-1 pr-2">{title}</h3>
        <PieChart
          score={score}
          maxScore={maxScore}
          label=""
          color={color}
          size={50}
        />
      </div>
      <div className="text-center">
        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">{score}</span>
        <span className="text-xs sm:text-sm text-muted-foreground ml-1">/ {maxScore}</span>
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
                Competition Pitch
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                Review your competition pitch submission and evaluation
              </p>
            </div>
            <div className="flex items-center gap-2 w-fit">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
              <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap">
                Competition Pitch
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Button
            onClick={() => router.push(`/competitions/${competitionId}`)}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Back to Competition
          </Button>
          <Button
            onClick={() => router.push(`/competitions/${competitionId}/leaderboard`)}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            View Leaderboard
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3  sm:h-4 sm:w-4" />
            <Input
              placeholder="Search conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 text-xs sm:text-sm h-9 sm:h-10"
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
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-2">
                      <CardTitle className="text-base sm:text-lg lg:text-xl flex-1 break-words">
                        {pitch.title}
                      </CardTitle>
                      {isEvaluating && (
                        <Badge variant="outline" className="w-fit text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Evaluating...
                        </Badge>
                      )}
                    </div>

                    <CardDescription className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        {new Date(pitch.startTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        {formatDuration(pitch.duration || 0)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {pitch.conversationHistory?.length || 0} messages
                      </Badge>
                      {searchTerm && (
                        <Badge variant="secondary" className="text-xs">
                          {filteredMessages.length} matches
                        </Badge>
                      )}
                    </CardDescription>
                  </div>

                  <div className="flex">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePitchExpansion}
                      className="flex items-center gap-1 text-xs sm:text-sm"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 h-3 sm:h-4 sm:w-4" /> Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 h-3 sm:h-4 sm:w-4" /> Expand
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 p-4 sm:p-6">
                  <div className="border-t pt-4">
                    <ScrollArea className="h-[250px] sm:h-[300px] lg:h-[400px] pr-2 sm:pr-4">
                      <div className="space-y-3 sm:space-y-4">
                        {(searchTerm ? filteredMessages : pitch.conversationHistory || []).map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-full sm:max-w-[85%] lg:max-w-lg rounded-xl p-3 sm:p-4 ${msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                                }`}
                            >
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div
                                  className={`rounded-full p-1 flex-shrink-0 ${msg.role === "user"
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
                                  className={`text-xs ${msg.role === "user"
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
                              <p className="text-xs sm:text-sm break-words leading-relaxed">
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
                <CardHeader className="pb-3 bg-primary/5 p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 h-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <span>Pitch Evaluation</span>
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Competition scoring based on 6 key dimensions
                      </CardDescription>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                      <div className="text-center sm:text-left">
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          {evaluation.scores.TotalScore}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">Total Score</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleEvaluationExpansion}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        {isEvaluationExpanded ? (
                          <>
                            <ChevronUp className="h-3 h-3 sm:h-4 sm:w-4" /> Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 h-3 sm:h-4 sm:w-4" /> Expand
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isEvaluationExpanded && (
                  <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 p-4 sm:p-6">
                    {/* Overall Score */}
                    <div className="bg-card rounded-lg border p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                        <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                          <h3 className="text-base sm:text-lg font-semibold mb-2">Overall Performance</h3>
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            Total Score: {evaluation.scores.TotalScore}/100
                          </p>
                          <div className="mt-2 sm:mt-3">
                            <Badge variant="secondary" className="text-xs sm:text-sm">
                              {getPerformanceLabel(evaluation.scores.TotalScore)}
                            </Badge>
                          </div>
                        </div>
                        <PieChart
                          score={evaluation.scores.TotalScore}
                          maxScore={100}
                          label="Total Score"
                          color="var(--color-primary)"
                          size={80}
                        />
                      </div>
                    </div>

                    {/* Score Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                    <div className="bg-card rounded-lg border p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Business Investability Confidence
                      </h3>
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <div className="flex-1 w-full">
                          <div className="w-full bg-muted rounded-full h-3 sm:h-4">
                            <div
                              className="bg-chart-2 h-3 sm:h-4 rounded-full transition-all duration-500"
                              style={{
                                width: `${evaluation.scores.BusinessInvestabilityConfidence}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-chart-2 whitespace-nowrap">
                          {evaluation.scores.BusinessInvestabilityConfidence}%
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-card rounded-lg border p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Summary</h3>
                      <p className="text-card-foreground/80 leading-relaxed text-xs sm:text-sm">
                        {evaluation.summary}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="bg-muted rounded-lg p-3 sm:p-4">
                      <div className="text-xs sm:text-sm text-muted-foreground">
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