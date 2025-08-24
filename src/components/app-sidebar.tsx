"use client"

import * as React from "react"
import {
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  LayoutDashboard,
  Mic,
  History,
  FileText,
} from "lucide-react"
import Link from "next/link";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ModeToggle } from "@/components/theme-toggle"
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

const getUserFromSession = (session: Session) => ({
  name: session?.user?.fullName || "User",
  email: session?.user?.email || "user@email.com",
  avatar: session?.user?.image,
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = getUserFromSession(session!);

  const data = {
    user,
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
      },
      {
        title: "My pitches",
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
      
    ],
    navSecondary: [
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
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex justify-between items-center">
              <Link href="/dashboard">
               
                <div className="flex-1 text-left text-2xl leading-tight">
                  <span className="truncate font-bold">PitchDesk</span>
                </div>
              </Link>
                <div className="flex justify-center ">
                  <ModeToggle />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2">
          <NavUser user={data.user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
