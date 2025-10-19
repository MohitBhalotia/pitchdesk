import Header1 from "@/components/mvpblocks/header-1";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header1 />
      {children}
    </>
  );
}
