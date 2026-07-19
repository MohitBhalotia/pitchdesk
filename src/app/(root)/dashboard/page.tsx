"use client";
import { useSession } from "next-auth/react";
import {
  Users,
  FileText,
  BarChart3,
  Play,
  ArrowUpRight,
  Crown,
  X,
  Star,
  Check,
  Clock,
  SearchCheck,
  TrendingUp,
  Sparkles,
  Mic,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import NumberFlow from "@number-flow/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ScorePoint {
  date: string;
  score: number;
}

interface RecentPitch {
  _id: string;
  title?: string;
  createdAt: string;
  duration?: number;
}

const getPerformanceLabel = (score: number) =>
  score >= 85
    ? "Excellent"
    : score >= 70
      ? "Good"
      : score >= 50
        ? "Fair"
        : "Needs Improvement";

const planBadge: Record<string, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-secondary text-secondary-foreground" },
  hobby: { label: "Hobby", className: "bg-secondary text-secondary-foreground" },
  mini: { label: "Mini", className: "bg-primary/10 text-primary" },
  standard: { label: "Standard", className: "bg-primary/10 text-primary" },
  pro: { label: "Pro", className: "bg-accent text-accent-foreground" },
  enterprise: { label: "Enterprise", className: "bg-accent text-accent-foreground" },
};

// Upgrade Modal Component
const UpgradeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    "Direct access to 500+ VC network",
    "Personalized introductions",
    "Pitch deck review by investors",
    "Priority scheduling with partners",
    "Deal flow analytics dashboard",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground rounded-xl max-w-md w-full p-6 shadow-xl border border-border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-accent-foreground" />
              <h2 className="text-xl font-bold">Upgrade to Enterprise</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Unlock exclusive VC networking features
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-accent/60 border border-accent rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-accent-foreground" />
            <div>
              <p className="font-semibold text-accent-foreground">
                Exclusive Feature
              </p>
              <p className="text-sm text-accent-foreground/80">
                Connect directly with real venture capitalists
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground/80">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = "/payment";
            }}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

// VC Dashboard Component
const VCDashboard = ({ userStats, session, router }) => {
  const stats = [
    {
      title: "AI Judge Bots",
      value: userStats?.totalBots ?? 0,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Active Programs",
      value: userStats?.activePrograms ?? 0,
      icon: <Play className="h-5 w-5" />,
    },
    {
      title: "Pitches Reviewed",
      value: userStats?.totalApplications ?? 0,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Pending Review",
      value: userStats?.pendingReview ?? 0,
      icon: <Clock className="h-5 w-5" />,
    },
  ];

  const quickActions = [
    {
      title: "Create AI Judge Bot",
      description: "Build a custom AI evaluator for your programs",
      icon: <Users className="h-5 w-5 text-primary" />,
      onClick: () => router.push("/vc/bots/create"),
    },
    {
      title: "Launch Investment Program",
      description: "Start accepting applications from founders",
      icon: <Play className="h-5 w-5 text-primary" />,
      onClick: () => router.push("/vc/incubations/create"),
    },
    {
      title: "Review Pitch Submissions",
      description: "Evaluate applications and communicate with founders",
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      onClick: () => router.push("/vc/pitches"),
    },
    {
      title: "Manage Programs",
      description: "View and edit your investment programs",
      icon: <FileText className="h-5 w-5 text-primary" />,
      onClick: () => router.push("/vc/incubations"),
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 py-5">
      {/* Welcome Banner for VC */}
      <div className="bg-card rounded-xl border border-border p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {session?.user?.fullName}!
          </h1>
          <p className="text-muted-foreground">
            Ready to discover the next unicorn? Your{" "}
            <span className="font-semibold text-primary">
              Venture Capital
            </span>{" "}
            dashboard is here to help you find great deals.
          </p>
        </div>
        <div className="px-5 py-2 bg-primary/10 text-primary rounded-lg font-semibold text-sm w-fit">
          VC Partner
        </div>
      </div>

      {/* Stats Grid for VC */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-4 lg:p-6 flex items-center gap-3 lg:gap-4 hover:border-primary/30 transition-colors"
          >
            <div className="p-2 lg:p-3 rounded-lg bg-primary/10 text-primary">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs lg:text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-lg lg:text-2xl font-bold">
                <NumberFlow value={stat.value} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions for VC */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
              onClick={action.onClick}
            >
              <div className="p-2 rounded-lg bg-muted">{action.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {action.description}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Score trend chart, empty-state aware
const ScoreTrendChart = ({ scoreHistory }: { scoreHistory: ScorePoint[] }) => {
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === "dark" ? "#8b93a1" : "#6b7280";

  if (!scoreHistory || scoreHistory.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center gap-2 h-[280px]">
        <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
        <p className="font-medium">No scores yet</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Practice your first pitch to start tracking your progress here.
        </p>
      </div>
    );
  }

  const data = scoreHistory.map((point, i) => ({
    session: `#${i + 1}`,
    score: Math.round(point.score),
    date: new Date(point.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Score Trend</h3>
          <p className="text-xs text-muted-foreground">
            Total score across your last {data.length} evaluated pitches
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
          <XAxis dataKey="date" stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} />
          <YAxis
            domain={[0, 100]}
            stroke={axisColor}
            fontSize={12}
            tick={{ fill: axisColor }}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "0.8rem",
            }}
            labelStyle={{ color: "hsl(var(--popover-foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#scoreFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Motivational / upsell strip driven by the latest evaluated score
const MotivationCard = ({
  scoreHistory,
  planName,
  router,
}: {
  scoreHistory: ScorePoint[];
  planName?: string;
  router: ReturnType<typeof useRouter>;
}) => {
  const badge = planBadge[planName ?? ""] ?? planBadge.free;
  const isTopPlan = planName === "enterprise";

  if (!scoreHistory || scoreHistory.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 lg:p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Get your first score</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Run a pitch practice session and we&apos;ll evaluate you across
          delivery, content, and investability.
        </p>
        <button
          onClick={() => router.push("/start-a-pitch")}
          className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Mic className="h-4 w-4" />
          Start Pitch Practice
        </button>
      </div>
    );
  }

  const latest = Math.round(scoreHistory[scoreHistory.length - 1].score);
  const label = getPerformanceLabel(latest);
  const pointsToExcellent = Math.max(0, 85 - latest);

  return (
    <div className="rounded-xl border border-border bg-card p-5 lg:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Your latest performance</h3>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">
          <NumberFlow value={latest} />
        </span>
        <span className="text-sm text-muted-foreground">/ 100 &middot; {label}</span>
      </div>

      <p className="text-sm text-muted-foreground">
        {pointsToExcellent > 0
          ? `You're ${pointsToExcellent} points from Excellent — practice again to close the gap.`
          : "You're pitching at an excellent level — keep it up."}
      </p>

      {!isTopPlan && (
        <button
          onClick={() => router.push("/payment")}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          <Crown className="h-4 w-4" />
          Upgrade for deeper feedback
        </button>
      )}
    </div>
  );
};

// Recent pitch sessions, fetched independently so it doesn't block the main dashboard skeleton
const RecentActivity = ({ router }: { router: ReturnType<typeof useRouter> }) => {
  const [pitches, setPitches] = useState<RecentPitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    axios
      .get("/api/my-pitches")
      .then((res) => {
        if (!cancelled) setPitches((res.data || []).slice(0, 5));
      })
      .catch(() => {
        // Non-critical widget — fail silently, section just stays empty.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
        <Link
          href="/my-pitches"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : pitches.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No pitch sessions yet — your practice history will show up here.
        </p>
      ) : (
        <div className="space-y-1">
          {pitches.map((pitch) => (
            <button
              key={pitch._id}
              onClick={() => router.push(`/evaluation/${pitch._id}`)}
              className="w-full flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Mic className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {pitch.title || "Untitled pitch session"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(pitch.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  {pitch.duration ? ` · ${Math.round(pitch.duration / 60)} min` : ""}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

//founder dashboard
const FounderDashboard = ({ userStats, session, router, setShowUpgradeModal }) => {
  const stats = [
    {
      title: "Total Pitches Practiced",
      value: userStats?.totalPitches ?? 0,
      icon: <Play className="h-5 w-5" />,
    },
    {
      title: "Total Pitches Evaluated",
      value: userStats?.totalPitchEvaluated ?? 0,
      icon: <SearchCheck className="h-5 w-5" />,
    },
    {
      title: "Pitch Documents Generated",
      value: userStats?.totalPitchGenerated ?? 0,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Remaining Minutes",
      value: Math.max(0, userStats?.remainingTime ?? 0),
      icon: <Clock className="h-5 w-5" />,
    },
  ];

  const quickActions = [
    {
      title: "Start Pitch Practice Session",
      description: "Practice your pitch with our AI VC agents",
      icon: <Play className="h-5 w-5 text-primary" />,
      onClick: () => router.push("/start-a-pitch"),
    },
    {
      title: "Generate New Pitch Document",
      description: "Create a professional pitch script",
      icon: <FileText className="h-5 w-5 text-primary" />,
      onClick: () => router.push("/generate-pitch"),
    },
    {
      title: "View Session Analytics",
      description: "Analyze your pitch performance and improvements",
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      onClick: () => router.push("/my-pitches"),
    },
    {
      title: "Connect with Real VCs",
      description: "Network with actual venture capitalists",
      icon: <Users className="h-5 w-5 text-primary" />,
      onClick: () => {
        if (userStats?.planName !== "enterprise") {
          setShowUpgradeModal(true);
          return;
        }
        router.push("/connect-vcs");
      },
      premium: true,
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 py-5">
      {/* Welcome Banner */}
      <div className="bg-card rounded-xl border border-border p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {session?.user?.fullName}!
          </h1>
          <p className="text-muted-foreground">
            Ready to perfect your pitch? Your{" "}
            <span className="font-semibold text-primary capitalize">
              {userStats?.planName}
            </span>{" "}
            plan gives you access to powerful AI coaching.
          </p>
        </div>
        {userStats?.planName !== "enterprise" && (
          <button
            onClick={() => router.push("/payment")}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors w-fit"
          >
            Upgrade Plan
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-4 lg:p-6 flex items-center gap-3 lg:gap-4 hover:border-primary/30 transition-colors"
          >
            <div className="p-2 lg:p-3 rounded-lg bg-primary/10 text-primary">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs lg:text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-lg lg:text-2xl font-bold">
                <NumberFlow value={stat.value} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Score trend + motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ScoreTrendChart scoreHistory={userStats?.scoreHistory ?? []} />
        </div>
        <MotivationCard
          scoreHistory={userStats?.scoreHistory ?? []}
          planName={userStats?.planName}
          router={router}
        />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
                onClick={action.onClick}
              >
                <div className="p-2 rounded-lg bg-muted">{action.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    {action.premium && (
                      <Crown className="h-3.5 w-3.5 text-accent-foreground" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Activity</h2>
          <RecentActivity router={router} />
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userStats, setUserStats] = useState<any>({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isOverallLoading = isLoading || status === "loading";

  // Fetch user plan ,no of pitch used and limit etc
  useEffect(() => {
    if (status === "loading" || !session?.user?._id) return; // wait until session is loaded

    if (session?.user?.role === 'vc') {
      // Fetch VC stats
      const fetchVCStats = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get("/api/vc/stats");
          setUserStats(response.data);
        } catch (err) {
          toast.error("Error fetching VC stats.");
          console.error("Error fetching VC stats:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVCStats();
      return;
    }

    const fetchUserPlan = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/users/stats", {
          params: { userId: session.user._id },
        });
        setUserStats(response.data);

        console.log(response.data);
      } catch (err) {
        toast.error("Error fetching user stats.");
        console.error("Error fetching user stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlan();
  }, [session?.user?._id, session?.user?.role, status]); // re-run when user id becomes available




  // Full Skeleton Loading State
  if (isOverallLoading) {
    return (
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 py-6">
        {/* Welcome Banner Skeleton */}
        <div className="w-full bg-card rounded-xl border border-border p-8 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-4 lg:p-6 animate-pulse"
            >
              <div className="flex items-center gap-3 lg:gap-4 w-full">
                <div className="p-2 lg:p-4 rounded-lg bg-muted h-12 w-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="w-full">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 animate-pulse"
              >
                <div className="p-2 rounded-lg bg-muted h-10 w-10"></div>
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-5 w-5 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Early return for unauthenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="">
      {session?.user?.role === 'vc' ? (
        <VCDashboard
          userStats={userStats}
          session={session}
          router={router}
        />
      ) : (
        <FounderDashboard
          userStats={userStats}
          session={session}
          router={router}
          setShowUpgradeModal={setShowUpgradeModal}
        />
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
