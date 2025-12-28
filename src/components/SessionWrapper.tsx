"use client";

import { SessionProvider } from "next-auth/react";
import Snowfall from "react-snowfall";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Snowfall snowflakeCount={200} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      {children}
    </SessionProvider>
  );
}
