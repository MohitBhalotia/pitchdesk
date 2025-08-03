"use client"
import { useState, useEffect } from "react";
import { TrendingUp, Users, FileText, BarChart3, Play, Clock, Trophy, Zap, ArrowUpRight, Crown, Sparkles, User, Settings, CreditCard, Lock, Building2, MessageSquare, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  premium?: boolean;
}

interface ActivityItem {
  id: string;
  type: 'pitch' | 'feedback' | 'document' | 'call';
  title: string;
  timestamp: string;
  status?: 'completed' | 'scheduled' | 'in-progress';
}

const StatCard = ({ title, value, icon, trend, trendUp }: StatCardProps) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? 'text-teal-400' : 'text-red-400'}`}>
            <TrendingUp className={`h-3 w-3 ${!trendUp ? 'rotate-180' : ''}`} />
            {trend}
          </div>
        )}
      </div>
      <div className="text-muted-foreground/60">
        {icon}
      </div>
    </div>
  </div>
);

const ActionCard = ({ title, description, icon, onClick, disabled, premium }: ActionCardProps) => (
  <div
    className={`action-card group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={!disabled ? onClick : undefined}
  >
    <div className="flex items-start gap-4 relative z-10">
      <div className={`p-3 rounded-lg ${premium ? 'bg-gradient-to-r from-violet-500/20 to-teal-500/20' : 'bg-muted/50'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          {premium && <Crown className="h-4 w-4 text-violet-400" />}
        </div>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
      <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-teal-400 transition-colors" />
    </div>
  </div>
);

const ActivityFeed = ({ activities }: { activities: ActivityItem[] }) => (
  <div className="glass-card p-6">
    <h3 className="font-semibold mb-4 flex items-center gap-2">
      <Clock className="h-5 w-5 text-teal-400" />
      Latest Activity
    </h3>
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className={`p-2 rounded-full ${
            activity.type === 'pitch' ? 'bg-teal-500/20 text-teal-400' :
            activity.type === 'feedback' ? 'bg-violet-500/20 text-violet-400' :
            activity.type === 'document' ? 'bg-blue-500/20 text-blue-400' :
            'bg-pink-500/20 text-pink-400'
          }`}>
            {activity.type === 'pitch' && <Play className="h-4 w-4" />}
            {activity.type === 'feedback' && <Sparkles className="h-4 w-4" />}
            {activity.type === 'document' && <FileText className="h-4 w-4" />}
            {activity.type === 'call' && <Users className="h-4 w-4" />}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
          {activity.status && (
            <span className={`px-2 py-1 rounded-full text-xs ${
              activity.status === 'completed' ? 'bg-teal-500/20 text-teal-400' :
              activity.status === 'scheduled' ? 'bg-violet-500/20 text-violet-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {activity.status}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

const ProfileDropdown = ({ user }: { user: { name: string; email: string; avatar: string; tier: string } }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 p-2 rounded-full hover:bg-card/50 transition-colors group">
          <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-teal-500/50 transition-all">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-teal-500 to-violet-500 text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.tier} Plan</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 glass-card border-border/50" align="end" sideOffset={8}>
        {/* User Info Header */}
        <div className="px-4 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-violet-500 text-white font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.tier === "Premium" ? "bg-gradient-to-r from-violet-500/20 to-teal-500/20 text-violet-400" :
                  user.tier === "Pro" ? "bg-blue-500/20 text-blue-400" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {user.tier} Plan
                </span>
                {user.tier === "Premium" && <Crown className="h-3 w-3 text-violet-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="py-2">
          {user.tier !== "Premium" && (
            <>
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-violet-500/10">
                <Crown className="h-4 w-4 text-violet-400" />
                <div>
                  <p className="font-medium">Upgrade Plan</p>
                  <p className="text-xs text-muted-foreground">Unlock premium features</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
            </>
          )}

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Payment History</p>
              <p className="text-xs text-muted-foreground">View billing and invoices</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-xs text-muted-foreground">Update security settings</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Startup Information</p>
              <p className="text-xs text-muted-foreground">Update company details</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/50" />

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Support & Feedback</p>
              <p className="text-xs text-muted-foreground">Get help or share ideas</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Account Settings</p>
              <p className="text-xs text-muted-foreground">Manage preferences</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/50" />

          <DropdownMenuItem
            className="flex items-center gap-3 px-4 py-3 cursor-pointer text-red-400 hover:bg-red-500/10"
            onClick={() => {
              if (typeof window !== 'undefined') {
                import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/login' }));
              }
            }}
          >
            <LogOut className="h-4 w-4" />
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-xs text-red-400/70">End your session</p>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AITipsPanel = () => {
  const tips = [
    "Focus on your problem statement in the first 30 seconds",
    "Use concrete numbers and metrics to support your claims",
    "Practice your elevator pitch until it's under 60 seconds",
    "Show, don't tell - use visuals and demos when possible",
    "Address potential investor concerns proactively"
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="glass-card p-6 neon-border">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-400" />
        AI Tips & Suggestions
      </h3>
      <div className="relative min-h-[60px] flex items-center">
        <p className="text-muted-foreground italic">
          "{tips[currentTip]}"
        </p>
      </div>
      <div className="flex gap-1 mt-4">
        {tips.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index === currentTip ? 'bg-violet-400' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Index() {
  const [user] = useState({
    name: "Naresh",
    email: "naresh@startup.com",
    avatar: "/placeholder.svg",
    tier: "Free" as "Free" | "Pro" | "Premium",
    sessionsUsed: 3,
    sessionsLimit: 10
  });

  const stats = [
    {
      title: "Total Pitches Practiced",
      value: 24,
      icon: <Play className="h-6 w-6" />,
      trend: "+12% this month",
      trendUp: true
    },
    {
      title: "AI Feedback Sessions",
      value: 18,
      icon: <Sparkles className="h-6 w-6" />,
      trend: "+8% this month",
      trendUp: true
    },
    {
      title: "Pitch Documents Generated",
      value: 7,
      icon: <FileText className="h-6 w-6" />,
      trend: "+3 this week",
      trendUp: true
    },
    {
      title: "Average Success Score",
      value: "8.2/10",
      icon: <Trophy className="h-6 w-6" />,
      trend: "+0.5 improvement",
      trendUp: true
    },
    {
      title: "Remaining Sessions",
      value: user.sessionsLimit - user.sessionsUsed,
      icon: <Zap className="h-6 w-6" />,
      trend: `${user.sessionsUsed}/${user.sessionsLimit} used`,
      trendUp: false
    }
  ];

  const quickActions = [
    {
      title: "Start Pitch Practice Session",
      description: "Practice your pitch with our AI VC agents",
      icon: <Play className="h-6 w-6 text-teal-400" />,
      onClick: () => console.log("Start pitch practice"),
      disabled: user.sessionsUsed >= user.sessionsLimit && user.tier === "Free"
    },
    {
      title: "Generate New Pitch Document",
      description: "Create a professional pitch deck template",
      icon: <FileText className="h-6 w-6 text-blue-400" />,
      onClick: () => console.log("Generate document")
    },
    {
      title: "View Session Analytics",
      description: "Analyze your pitch performance and improvements",
      icon: <BarChart3 className="h-6 w-6 text-violet-400" />,
      onClick: () => console.log("View analytics")
    },
    {
      title: "Connect with Real VCs",
      description: "Network with actual venture capitalists",
      icon: <Users className="h-6 w-6 text-pink-400" />,
      onClick: () => console.log("Connect with VCs"),
      disabled: user.tier === "Free",
      premium: true
    }
  ];

  const recentActivities: ActivityItem[] = [
    {
      id: "1",
      type: "pitch",
      title: "Completed pitch practice session",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      id: "2",
      type: "feedback",
      title: "Received AI feedback on Series A pitch",
      timestamp: "5 hours ago",
      status: "completed"
    },
    {
      id: "3",
      type: "document",
      title: "Generated pitch deck template",
      timestamp: "1 day ago",
      status: "completed"
    },
    {
      id: "4",
      type: "call",
      title: "Scheduled call with Sarah Chen (VC)",
      timestamp: "2 days ago",
      status: "scheduled"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold gradient-text">
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Ready to perfect your pitch? Your {user.tier} plan gives you access to powerful AI coaching.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user.tier !== "Premium" && (
                <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all hidden sm:block">
                  Upgrade Plan
                </button>
              )}
              <ProfileDropdown user={user} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <ActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed activities={recentActivities} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Usage Widget */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-400" />
                Session Usage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>This month</span>
                  <span>{user.sessionsUsed}/{user.sessionsLimit}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-violet-500 h-2 rounded-full transition-all"
                    style={{ width: `${(user.sessionsUsed / user.sessionsLimit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.tier === "Free" ? "Upgrade to Pro for unlimited sessions" : "Unlimited sessions available"}
                </p>
              </div>
            </div>

            {/* AI Tips */}
            <AITipsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
