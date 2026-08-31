"use client";

import React from "react";
import { useSession } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  return (
    <div className={`${status === "authenticated" ? "" : "mt-20"} sm:px-10`}>
      {children}
    </div>
  );
}
