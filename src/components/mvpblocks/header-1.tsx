"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ModeToggle } from "../theme-toggle";
import Image from "next/image";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Features",
    href: "/features",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "AI Powered VC's",
        href: "#",
        description: "Talk with different Real Persona VC's",
      },
      {
        name: "Personalised Pitches",
        href: "$",
        description: "Get Your Perfect Pitch",
      },
      {
        name: "Pitch Analysis",
        href: "#",
        description: "Detailed Report of Your Pitch",
      },
      {
        name: "Pitch Improvement",
        href: "#",
        description: "Improve Your Existing Pitch",
      },
    ],
  },
  { name: "CrowdFunding", href: "/pricing" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Meet the VCs", href: "/meet-the-vcs" },
];
export default function Header1() {
  const { data: session, status } = useSession();
  const authLoading = status === "loading";
  const user = session?.user;
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled
          ? theme === "dark"
            ? "bg-black/80 backdrop-blur shadow-lg"
            : "bg-white/80 backdrop-blur shadow-lg"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full  ">

              <Image
                src="/logo.png"
                alt="PitchDesk Logo"
                width={40}
                height={40}
                className="dark:invert rounded-full"
              />

            </div>
            <span className=" text-xl font-bold ">
              PitchDesk
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasDropdown && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 font-medium text-foreground hover:text-primary transition"
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.ul
                          className={`absolute top-full left-0 mt-2 w-80 rounded-xl border border-border bg-background shadow-xl z-40 ${item.name === "Solutions"
                              ? "w-[600px] grid grid-cols-2 gap-6 p-6"
                              : "p-2"
                            }`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.dropdownItems?.map((dropdown) => (
                            <li key={dropdown.name}>
                              <Link
                                href={dropdown.href}
                                className="block px-4 py-2 text-sm hover:bg-muted rounded-lg"
                              >
                                {dropdown.name}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side (Auth + Theme) */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <div className="hidden lg:flex">
              {authLoading || user ? (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {!authLoading ? (
                        <div className="flex items-center gap-2 hover:bg-muted p-2 rounded-lg">
                          <Avatar className="h-8 w-8 rounded-lg ">
                            {/* <AvatarImage src={user.avatar} alt={user.fullName} /> */}
                            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                              {user?.fullName?.[0]?.toUpperCase() ||
                                user?.email?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          {user && user?.fullName}
                          <ChevronsUpDown className="ml-auto size-4" />
                        </div>
                      ) : (
                        <Skeleton className="h-8 w-40 rounded-lg" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                      side="bottom"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            {/* <AvatarImage src={user.avatar} alt={user.fullName} /> */}
                            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                              {user?.fullName?.[0]?.toUpperCase() ||
                                user?.email?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                              {user && user?.fullName}
                            </span>
                            <span className="truncate text-xs">
                              {user && user?.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Link
                            href="/upgrade"
                            className="flex items-center gap-2"
                          >
                            <Sparkles />
                            Upgrade
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard />
                          Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell />
                          Notifications
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="hidden lg:block font-medium hover:text-primary transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup/step1"
                    className="inline-flex items-center space-x-2 rounded-full px-6 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--primary), #1e40af)",
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden rounded-lg hover:bg-muted transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="lg:hidden mx-4  mt-2 rounded-xl border border-border bg-background shadow-xl backdrop-blur p-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-2 h-[300px] overflow-auto">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-2 py-2 rounded-lg font-medium hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown &&
                    item.dropdownItems?.map((dropdown) => (
                      <ul key={dropdown.name} className="ml-4 mt-1 space-y-1">
                        <li>
                          <Link
                            href={dropdown.href}
                            className="block px-5 py-1 text-sm text-foreground hover:bg-muted rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdown.name}
                          </Link>
                        </li>
                      </ul>
                    ))}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="bg-primary text-white rounded-lg">
                      {user?.fullName?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {user.fullName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="block w-full rounded-lg py-2 text-center font-medium hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full rounded-lg bg-gradient-to-r from-primary to-blue-800 py-2 text-center font-medium text-white hover:shadow-lg transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
