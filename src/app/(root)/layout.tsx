import React from "react";
import { AuthenticatedAppShell } from "../../components/authenticated-app-shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
