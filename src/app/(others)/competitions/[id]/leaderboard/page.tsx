"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  Crown,
  Medal,
  Users,
  Search,
  ArrowLeft,
  Clock,
  Award,
  Star,
  Calendar,
  BarChart3,
} from "lucide-react";

interface LeaderboardEntry {
  _id: string;
  rank: number;
  totalScore: number;
  userId: string;
  teamName: string;
  submissionTime: string;
  evaluationDate: string;
}

interface Competition {
  _id: string;
  leaderboardConfig?: {
    topQualifiers: number;
    isFinalRound: boolean;
    customMessage?: string;
  };
}


const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <Award className="h-4 w-4 text-muted-foreground" />;
  }
};

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 text-sm";
    case 2:
      return "bg-gray-400/20 text-gray-700 border-gray-400/30 text-sm";
    case 3:
      return "bg-amber-600/20 text-amber-700 border-amber-600/30 text-sm";
    default:
      return "bg-blue-500/20 text-blue-700 border-blue-500/30 text-sm";
  }
};

const LeaderboardRow = ({ entry, isTopTeam }: { entry: LeaderboardEntry; isTopTeam: boolean }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all duration-200 bg-card border-border`}>
      {/* Left Section - Rank and Team Info */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Rank */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full">
            {getRankIcon(entry.rank)}
          </div>
          <Badge variant="outline" className={getRankBadgeColor(entry.rank)}>
            #{entry.rank}
          </Badge>
        </div>

        {/* Team Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate text-sm sm:text-base lg:text-lg">
              {entry.teamName}
            </h3>
          </div>
        </div>
      </div>

      {/* Right Section - Score and Time */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-8 sm:pl-0">
        {/* Submission Time */}
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="whitespace-nowrap">{new Date(entry.submissionTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="whitespace-nowrap">{new Date(entry.submissionTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>

        {/* Total Score */}
        <div className="text-right flex-shrink-0">
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {entry.totalScore}
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">Total Score</div>
        </div>
      </div>
    </div>
  );
};

export default function TournamentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalRegisteredTeams, setTotalRegisteredTeams] = useState(0);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const competitionId = params?.id as string;

  // Get leaderboard config with defaults
  const topQualifiers = competition?.leaderboardConfig?.topQualifiers ?? 25;
  const isFinalRound = competition?.leaderboardConfig?.isFinalRound ?? false;
  const customMessage = competition?.leaderboardConfig?.customMessage;

  // Generate qualification message
  const getQualificationMessage = () => {
    if (customMessage) return customMessage;
    if (isFinalRound) return `Top ${topQualifiers} teams will be awarded`;
    return `Top ${topQualifiers} teams qualify for the next round`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch competition data
        const compResponse = await fetch(`/api/competitions?id=${competitionId}`);
        if (compResponse.ok) {
          const compData = await compResponse.json();
          setCompetition(compData);
        }

        // Fetch leaderboard data
        const leaderboardResponse = await fetch(`/api/competitions/leaderboard?competitionId=${competitionId}`);
        if (!leaderboardResponse.ok) throw new Error("Failed to fetch leaderboard");

        const { rankedLeaderboard, totalRegisteredTeams } = await leaderboardResponse.json();
        setLeaderboard(rankedLeaderboard);
        setTotalRegisteredTeams(totalRegisteredTeams);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLeaderboard([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (competitionId) {
      fetchData();
    }
  }, [competitionId]);

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topTeams = filteredLeaderboard.slice(0, topQualifiers);
  const rest = filteredLeaderboard.slice(topQualifiers);

  const currentUserEntry = leaderboard.find(entry =>
    session?.user?._id && entry.userId && String(session.user._id) === String(entry.userId)
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2 mb-1 sm:mb-2">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0" />
              <span className="truncate">Competition Leaderboard</span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
              {getQualificationMessage()}
            </p>
          </div>

          <div className="flex items-center">
            <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Users className="h-4 w-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Total teams : {leaderboard.length}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Button
            onClick={() => router.push(`/competitions/${competitionId}`)}
            variant="outline"
            className="text-xs sm:text-sm"
            size="sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Back to Competition
          </Button>
          <Button
            onClick={() => router.push(`/competitions/${competitionId}/evaluation`)}
            className="text-xs sm:text-sm"
            size="sm"
          >
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            View My Scores
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 text-xs sm:text-sm h-9 sm:h-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        {!isLoading && leaderboard.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">#{currentUserEntry?.rank || 0}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">Your rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">
                      Top {topQualifiers} teams {isFinalRound ? 'will be awarded' : 'qualify for the next round'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">{leaderboard.length}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Teams submitted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leaderboard Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? "No matching teams found" : "No submissions yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Be the first team to submit a pitch!"
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => router.push(`/competitions/${competitionId}`)}>
                    Submit Your Pitch
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">⚡Rankings update in real-time as teams complete evaluations</p>
            {/* Top Teams Section */}
            {topTeams.length > 0 && (
              <div>
                <Card className="border-green-200">
                  <CardContent className="p-0">
                    <div className="space-y-2 p-2 sm:p-4">
                      {topTeams.map((entry) => (
                        <LeaderboardRow
                          key={entry._id}
                          entry={entry}
                          isTopTeam={true}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Rest of the Leaderboard */}
            {rest.length > 0 && (
              <div>
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px] sm:h-[400px]">
                      <div className="space-y-2 p-2 sm:p-4">
                        {rest.map((entry) => (
                          <LeaderboardRow
                            key={entry._id}
                            entry={entry}
                            isTopTeam={false}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}