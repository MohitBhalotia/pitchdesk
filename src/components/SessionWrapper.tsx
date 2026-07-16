"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
// import Snowfall from "react-snowfall";

export default function SessionWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const isMobile = useIsMobile();
  return (
    <SessionProvider session={session}>
      {/* <Snowfall color="orange" snowflakeCount={isMobile ? 100 : 50} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      <Snowfall color="green" snowflakeCount={isMobile ? 100 : 50} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      <Snowfall snowflakeCount={isMobile ? 100 : 50} wind={[-0.5, 0.5]} style={{position: 'fixed'}} /> */}
      {children}

    </SessionProvider>
  );
}
