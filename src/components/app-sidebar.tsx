"use client"

import * as React from "react"
import {
  LifeBuoy,
  Send,
  LayoutDashboard,
  Mic,
  History,
  FileText,
  Sparkles,
  Star,
  Zap,
  Crown,
  MessageSquare,
  HelpCircle,
  Handshake,
  Trophy
} from "lucide-react"
import Link from "next/link";
import Image from "next/image";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ModeToggle } from "@/components/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton" 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { title } from "process";

const getUserFromSession = (session: Session) => ({
  name: session?.user?.fullName || "User",
  email: session?.user?.email || "user@email.com",
  avatar: session?.user?.image,
  plan: session?.user?.userPlan || "userplan",
  role: session?.user?.role || "founder",
});

//  SKELETON COMPONENT
function SidebarSkeleton() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Navigation items skeleton */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
        
        {/* Secondary navigation skeleton */}
        <div className="mt-auto space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </SidebarContent>

      {/* Plan section skeleton */}
      <SidebarFooter>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border">
            <Skeleton className="h-4 w-4 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </SidebarFooter>

      {/* User section skeleton */}
      <SidebarFooter>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session,status } = useSession();

  //  LOADING sidebar skeleton
  if (status === "loading" || !session) {
    return <SidebarSkeleton />;
  }
  

  const user = getUserFromSession(session!);

  const founderSidebar = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,

      },
      {
        title: "Pitch Evaluation",
        url: "/my-pitches",
        icon: History,
      },
      {
        title: "Start pitch",
        url: "/start-a-pitch",
        icon: Mic,
      },
      {
        title: "Generate pitch",
        url: "/generate-pitch",
        icon: FileText,
      },
      {
        title: "My Pitches",
        url: "/generated-pitches",
        icon: MessageSquare
      },
      {
        title:"Competitions",
        url:"/competitions",
        icon:Trophy
      },
      // {
      //   title: "Venture Partners",
      //   url: "/investors",
      //   icon: Handshake
      // }

    ],
    navSecondary: [
      {
        title: "User guide",
        url: "/how-to-use",
        icon: HelpCircle,
      },
      {
        title: "Support",
        url: "/support",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "/feedback",
        icon: Send,
      },
    ],

  };

  const vcSidebar = {
    navMain: [{
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Browse pitches",
      url: "/my-pitches",
      icon: History,
    }],
    navSecondary: [
      {
        title: "Feedback",
        url: "/feedback",
        icon: Send,
      }
    ]
  }

  // Plan configuration with colors and icons
  const getPlanConfig = (plan: string) => {
    const planConfigs = {
      free: {
        icon: <Sparkles className="h-4 w-4" />,
        containerClass: "bg-gradient-to-r from-blue-50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-700 dark:text-blue-300",
        badgeClass: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800",
        badgeText: "Free",
      },
      standard: {
        icon: <Star className="h-4 w-4" />,
        containerClass: "bg-gradient-to-r from-purple-50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800",
        iconClass: "text-purple-600 dark:text-purple-400",
        textClass: "text-purple-700 dark:text-purple-300",
        badgeClass: "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800",
        badgeText: "Standard",
      },
      pro: {
        icon: <Zap className="h-4 w-4" />,
        containerClass: "bg-gradient-to-r from-amber-50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800",
        iconClass: "text-amber-600 dark:text-amber-400",
        textClass: "text-amber-700 dark:text-amber-300",
        badgeClass: "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800",
        badgeText: "Pro",
      },
      enterprise: {
        icon: <Crown className="h-4 w-4" />,
        containerClass: "bg-gradient-to-r from-amber-50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800",
        iconClass: "text-amber-600 dark:text-amber-400",
        textClass: "text-amber-700 dark:text-amber-300",
        badgeClass: "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800",
        badgeText: "Enterprise",
      }
    };

    const normalizedPlan = plan.toLowerCase();
    return planConfigs[normalizedPlan as keyof typeof planConfigs] || planConfigs.free;
  };

  const planConfig = getPlanConfig(user.plan);



  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>

              <div className="flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center gap-3 flex-1">

                  <div className="relative h-10 w-10 ">
                    <Image
                      src="/logo.png"
                      alt="PitchDesk Logo"
                      width={40}
                      height={40}
                      className="dark:invert rounded-full"
                    />
                  </div>


                  <div className="text-left">
                    <span className="text-2xl font-bold truncate">PitchDesk</span>
                  </div>
                </Link>


                <div className="flex justify-center">
                  <ModeToggle />
                </div>
              </div>
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {user.role === "founder" ? (
          <>
            <NavMain items={founderSidebar.navMain} />
            <NavSecondary items={founderSidebar.navSecondary} className="mt-auto" />
          </>
        ) : (
          <>
            <NavMain items={vcSidebar.navMain} />
            <NavSecondary items={vcSidebar.navSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>

      {/* Plan Section - Dark Mode Compatible */}
      <SidebarFooter>
        <div className="flex flex-col gap-3">
          {user.role === 'founder' ? (
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${planConfig.containerClass}`}>
              <div className="flex items-center gap-2">
                <div className={planConfig.iconClass}>
                  {planConfig.icon}
                </div>
                <div>
                  <p className={`text-sm font-medium ${planConfig.textClass}`}>
                    {user.plan[0].toUpperCase() + user.plan.slice(1)} Plan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.plan.toLowerCase() === 'free' ? 'Basic features' :
                      user.plan.toLowerCase() === 'standard' ? 'Enhanced features' :
                        user.plan.toLowerCase() === 'pro' ? 'Advanced features' :
                          user.plan.toLowerCase() === 'enterprise' ? 'Maximum features' :
                            ''}
                  </p>
                </div>
              </div>
            </div>) : (
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800`}>
              <div className="flex items-center gap-2">
                <div className="text-blue-600 dark:text-blue-400">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium text-blue-700 dark:text-blue-300`}>
                    Verified VC
                  </p>
                  <p className="text-xs text-muted-foreground">
                    exclusive access
                  </p>
                </div>
              </div>
            </div>
          )}


        </div>
      </SidebarFooter>

      {/* User Section */}
      <SidebarFooter>
        <div className="flex flex-col gap-2">
          <NavUser user={user} />
        </div>
      </SidebarFooter>
    </Sidebar >
  );
}
