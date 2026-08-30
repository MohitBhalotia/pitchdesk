"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Header1 from "./mvpblocks/header-1";
import Footer from "./Footer";
import { AuthenticatedAppShell } from "./authenticated-app-shell";

const workspaceAwareRoutes = ["/competitions", "/incubations"];

export function OthersLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { status } = useSession();
  const isWorkspaceRoute = workspaceAwareRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (status === "authenticated" && isWorkspaceRoute) {
    return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
  }

  return (
    <>
      <Header1 />
      {children}
      <Footer />
    </>
  );
}
