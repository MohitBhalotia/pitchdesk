"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "./ui/sonner";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
