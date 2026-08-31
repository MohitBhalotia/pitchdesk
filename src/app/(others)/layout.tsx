import React from "react";
import { OthersLayoutShell } from "@/components/others-layout-shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OthersLayoutShell>{children}</OthersLayoutShell>;
}
