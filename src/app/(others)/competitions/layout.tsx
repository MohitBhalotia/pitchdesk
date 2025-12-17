import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mt-20 px-10">{children}</div>;
}
