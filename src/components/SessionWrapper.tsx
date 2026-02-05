"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { SessionProvider } from "next-auth/react";
import Snowfall from "react-snowfall";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  return (
    <SessionProvider>
      {/* <Snowfall color="orange" snowflakeCount={isMobile ? 100 : 50} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      <Snowfall color="green" snowflakeCount={isMobile ? 100 : 50} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      <Snowfall snowflakeCount={isMobile ? 100 : 50} wind={[-0.5, 0.5]} style={{position: 'fixed'}} /> */}
      {children}
    </SessionProvider>
  );
}
