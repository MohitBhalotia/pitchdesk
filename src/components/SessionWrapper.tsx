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
      <Snowfall color="orange" snowflakeCount={100} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      <Snowfall color="green" snowflakeCount={100} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      <Snowfall snowflakeCount={100} wind={[-0.5, 0.5]} style={{position: 'fixed'}} />
      {children}
    </SessionProvider>
  );
}
