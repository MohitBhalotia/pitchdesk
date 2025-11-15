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
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  Users,
  Search,
  ArrowLeft,
  Clock,
  User,
  Award,
  Star,
  Calendar,
  Mail,
  BarChart3,
} from "lucide-react";

interface LeaderboardEntry {
  _id: string;
  rank: number;
  totalScore: number;
  userId: string;
  teamName: string;
  teamLeaderName: string;
  teamLeaderEmail: string;
  submissionTime: string;
  evaluationDate: string;
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

const LeaderboardRow = ({ entry, isTop25 }: { entry: LeaderboardEntry; isTop25: boolean }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 bg-card border-border`}>
      {/* Left Section - Rank and Team Info */}
      <div className="flex items-center gap-4 flex-1">
        {/* Rank */}
        <div className="flex items-center gap-3 w-20">
          <div className="flex items-center justify-center w-8 h-8 rounded-full">
            {getRankIcon(entry.rank)}
          </div>
          <Badge variant="outline" className={getRankBadgeColor(entry.rank)}>
            #{entry.rank}
          </Badge>
        </div>

        {/* Team Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate text-lg">
              {entry.teamName}
            </h3>

          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{entry.teamLeaderName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{entry.teamLeaderEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Score and Time */}
      <div className="flex items-center gap-6">
        {/* Submission Time */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(entry.submissionTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(entry.submissionTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>

        {/* Total Score */}
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">
            {entry.totalScore}
          </div>
          <div className="text-xs text-muted-foreground">Total Score</div>
        </div>
      </div>
    </div>
  );
};

export default function TournamentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalRegisteredTeams, setTotalRegisteredTeams] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const competitionId = params?.id as string;

  useEffect(() => {
    // In your leaderboard page component
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/competitions/leaderboard?competitionId=${competitionId}`);

        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const { rankedLeaderboard, totalRegisteredTeams } = await response.json();
        setLeaderboard(rankedLeaderboard);
        setTotalRegisteredTeams(totalRegisteredTeams);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaderboard([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (competitionId) {
      fetchLeaderboard();
    }
  }, [competitionId]);

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.teamLeaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.teamLeaderEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top25 = filteredLeaderboard.slice(0, 25);
  const rest = filteredLeaderboard.slice(25);

  const currentUserEntry = leaderboard.find(entry =>
    session?.user?.email === entry.teamLeaderEmail
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Competition Leaderboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Top 25 teams qualify for the next round
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Users className="h-5 w-5 mr-2" />
              Total teams registered : {leaderboard.length}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={() => router.push(`/competitions/${competitionId}`)}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Competition
          </Button>
          <Button
            onClick={() => router.push(`/competitions/${competitionId}/evaluation`)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View My Scores
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by team name, leader name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        {!isLoading && leaderboard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">#{currentUserEntry?.rank || 0}</div>
                    <div className="text-sm text-muted-foreground">Your rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Star className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">25</div>
                    <div className="text-sm text-muted-foreground">Qualify Next Round</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{leaderboard.length}</div>
                    <div className="text-sm text-muted-foreground">Teams with submitted pitches</div>
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
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground mb-4">⚡Rankings update in real-time as teams complete evaluations</p>            {/* Top 25 Section */}
            {top25.length > 0 && (
              <div>
                <Card className="border-green-200">
                  <CardContent className="p-0">
                    <div className="space-y-2 p-4">
                      {top25.map((entry) => (
                        <LeaderboardRow
                          key={entry._id}
                          entry={entry}
                          isTop25={true}
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
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 p-4">
                        {rest.map((entry) => (
                          <LeaderboardRow
                            key={entry._id}
                            entry={entry}
                            isTop25={false}
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