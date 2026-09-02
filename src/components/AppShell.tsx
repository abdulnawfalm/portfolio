"use client";

import Cursor from "./Cursor";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      {children}
    </>
  );
}