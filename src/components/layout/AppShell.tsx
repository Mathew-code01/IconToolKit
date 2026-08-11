// src/components/layout/AppShell.tsx

import type { ReactNode } from "react";

import Header from "../navigation/Header";
import Footer from "./Footer";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="
        flex min-h-screen
        flex-col
        bg-[var(--background)]
        text-[var(--text)]
        transition-colors duration-200
      "
    >
      {/* Global navigation */}
      <Header />

      {/* Main application content */}
      <main
        id="main-content"
        className="
          flex min-w-0
          flex-1
          flex-col
        "
      >
        {children}
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}