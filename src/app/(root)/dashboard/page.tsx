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
  SearchCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";


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
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upgrade to Enterprise
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Unlock exclusive VC networking features
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                Exclusive Feature
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Connect directly with real venture capitalists
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = "/payment";
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg"
          >
            Upgrade Now
          </button>
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
  }, [session?.user?._id, status]); // re-run when user id becomes available

  const stats = [
    {
      title: "Total Pitches Practiced",
      value: userStats?.totalPitches,
      icon: <Play className="h-6 w-6" />,
      
    },
    {
      title: "Total Pitches Evaluated",
      value: userStats?.totalPitchEvaluated,
      icon: <SearchCheck className="h-6 w-6" />,
      
    },

    {
      title: "Pitch Documents Generated",
      value: userStats?.totalPitchGenerated,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Remaining Minutes",
      value: `${userStats?.remainingTime}/${userStats?.totalTime}`,
      icon: <Clock className="h-6 w-6" />,
     
    },
    // {
    //   title: "Remaining Sessions",
    //   // value: user.sessionsLimit - user.sessionsUsed,
    //   value: `${userStats?.remainingPitches}/${userStats?.totalPitches}`,
    //   icon: <Zap className="h-6 w-6" />,
    //   // trend: `${user.sessionsUsed}/${user.sessionsLimit} used`,
    //   // trendUp: false
    // },
  ];

  const quickActions = [
    {
      title: "Start Pitch Practice Session",
      description: "Practice your pitch with our AI VC agents",
      icon: <Play className="h-6 w-6 text-teal-400" />,
      onClick: () => router.push("/start-a-pitch"),
    },
    {
      title: "Generate New Pitch Document",
      description: "Create a professional pitch deck template",
      icon: <FileText className="h-6 w-6 text-blue-400" />,
      onClick: () => router.push("/generate-pitch"),
    },
    {
      title: "View Session Analytics",
      description: "Analyze your pitch performance and improvements",
      icon: <BarChart3 className="h-6 w-6 text-violet-400" />,
      onClick: () => router.push("/my-pitches"),
    },
    {
      title: "Connect with Real VCs",
      description: "Network with actual venture capitalists",
      icon: <Users className="h-6 w-6 text-pink-400" />,
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


  // Full Skeleton Loading State
  if (isOverallLoading) {
    return (
      <div className="flex flex-col gap-8 items-center mx-auto px-2 py-6">
        {/* Welcome Banner Skeleton */}
        <div className="max-w-7xl mx-auto w-full bg-white/70 dark:bg-card/80 rounded-3xl shadow-xl border border-border/30 p-8 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-xl flex items-center py-4 lg:py-8 shadow bg-white/80 dark:bg-card/90 p-4 lg:p-6 flex-col gap-1 border border-border/20 animate-pulse"
            >
              <div className="flex items-center gap-3 lg:gap-4 mb-1 w-full">
                <div className="p-2 lg:p-4 rounded-lg bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="w-full max-w-7xl mx-auto mt-8">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/20 bg-white/70 dark:bg-card/90 shadow p-4 flex items-center gap-3 animate-pulse"
              >
                <div className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 h-10 w-10"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-8 items-center mx-auto px-2 py-5">
        {/* Welcome Banner */}
        <div className="backdrop-blur-lg max-w-7xl mx-auto bg-white/70 dark:bg-card/80 rounded-3xl shadow-xl border border-border/30 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent tracking-tight mb-2 p-1">
              Welcome back, {session?.user?.fullName}!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Ready to perfect your pitch? Your{" "}
              <span className="font-semibold text-teal-500">
                {userStats?.planName}
              </span>{" "}
              plan gives you access to powerful AI coaching.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {userStats?.planName !== "enterprise" && (
              <button
                onClick={() => router.push("/payment")}
                className="px-7 py-2 bg-gradient-to-r from-teal-500 to-violet-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-teal-500/30 transition-all"
              >
                Upgrade Plan
              </button>
            )}
            {/* <ProfileDropdown user={user} /> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <div
              className="rounded-xl flex items-center py-4 lg:py-8 shadow bg-white/80 dark:bg-card/90 p-4 lg:p-6 flex-col gap-1 border border-border/20 hover:shadow-lg transition-shadow"
              key={index}
            >
              <div className="flex items-center gap-3 lg:gap-4 mb-1">
                <div className="p-2 lg:p-4 rounded-lg bg-primary text-primary-foreground">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs lg:text-base font-medium text-foreground">
                    {stat.title}
                  </p>
                  <p className="text-sm lg:text-xl font-bold text-teal-600 dark:text-teal-300">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-7xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground text-left">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`rounded-xl border border-border/20 bg-white/70 dark:bg-card/90 shadow p-4 flex items-center gap-3 hover:shadow-lg transition-shadow group cursor-pointer"}`}
                onClick={action.onClick}
              >
                <div
                  className={`p-2 rounded-lg ${action.premium ? "bg-gradient-to-r from-violet-100 to-teal-100 dark:from-violet-900 dark:to-teal-900" : "bg-muted/40 dark:bg-muted/10"}`}
                >
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">{action.title}</h3>
                    {action.premium && (
                      <Crown className="h-4 w-4 text-violet-400" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-teal-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
