"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export default function ForceDarkTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
