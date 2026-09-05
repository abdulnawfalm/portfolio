"use client";

import { useEffect, useState } from "react";
import Cursor from "./Cursor";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  return (
    <>
      {fine && <Cursor />}
      {children}
    </>
  );
}