"use client";
import { useSession } from "next-auth/react";
import {
  Users,
  FileText,
  BarChart3,
  Play,
  Trophy,
  Zap,
  ArrowUpRight,
  Crown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Index() {
  const { data: session /*status*/ } = useSession();
  const router = useRouter();

  // Fallbacks for demo if session is not loaded
  const user = {
    name: session?.user?.fullName || "User",
    email: session?.user?.email || "user@email.com",
    avatar: session?.user?.image || "/placeholder.svg",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userStats, setUserStats] = useState<any>({});

  // Fetch user plan ,no of pitch used and limit etc
  useEffect(() => {
    if (!session?.user?._id) return; // wait until session is loaded

    const fetchUserPlan = async () => {
      try {
        const response = await axios.get("/api/users/stats", {
          params: { userId: session.user._id },
        });
        setUserStats(response.data);

        console.log(response.data);
      } catch (err) {
        toast.error("Error fetching user stats.");
        console.error("Error fetching user stats:", err);
      }
    };

    fetchUserPlan();
  }, [session?.user?._id]); // re-run when user id becomes available

  const stats = [
    {
      title: "Total Pitches Practiced",
      value: userStats?.usedPitches,
      icon: <Play className="h-6 w-6" />,
      // trend: "+12% this month",
      // trendUp: true
    },

    {
      title: "Pitch Documents Generated",
      value: 7,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Average Success Score",
      value: "8.2/10",
      icon: <Trophy className="h-6 w-6" />,
      // trend: "+0.5 improvement",
      // trendUp: true
    },
    {
      title: "Remaining Sessions",
      // value: user.sessionsLimit - user.sessionsUsed,
      value: `${userStats?.remainingPitches}/${userStats?.totalPitches}`,
      icon: <Zap className="h-6 w-6" />,
      // trend: `${user.sessionsUsed}/${user.sessionsLimit} used`,
      // trendUp: false
    },
  ];

  const quickActions = [
    {
      title: "Start Pitch Practice Session",
      description: "Practice your pitch with our AI VC agents",
      icon: <Play className="h-6 w-6 text-teal-400" />,
      onClick: () => router.push("/start-a-pitch"),
      disabled: userStats?.remainingPitches <= 0,
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
          toast.error(
            "This feature is only available for Enterprise users. Upgrade your plan to access it."
          );
          return;
        }
        router.push("/connect-vcs");
      },
      premium: true,
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col gap-8 items-center mx-auto px-2 py-6">
        {/* Welcome Banner */}
        <div className="backdrop-blur-lg max-w-7xl mx-auto bg-white/70 dark:bg-card/80 rounded-3xl shadow-xl border border-border/30 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent tracking-tight mb-2">
              Welcome back, {user.name}!
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
        <div className="flex gap-8 w-full justify-center">
          {stats.map((stat, index) => (
            <div
              className="rounded-xl flex items-center py-8 shadow bg-white/80 dark:bg-card/90 p-6 flex-col gap-1 border border-border/20 hover:shadow-lg transition-shadow"
              key={index}
            >
              <div className="flex items-center gap-4 mb-1">
                <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-300">
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
                className={`rounded-xl border border-border/20 bg-white/70 dark:bg-card/90 shadow p-4 flex items-center gap-3 hover:shadow-lg transition-shadow group ${action.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={!action.disabled ? action.onClick : undefined}
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
    </div>
  );
}
