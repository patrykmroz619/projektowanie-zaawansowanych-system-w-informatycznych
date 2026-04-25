"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenSquare, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
        >
          <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-semibold text-lg tracking-tight">
            Blog
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/"
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              pathname === "/"
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Posty
          </Link>
          <Link
            href="/create"
            className={cn(
              "ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
              pathname === "/create"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground hover:bg-secondary hover:border-accent"
            )}
          >
            <PenSquare className="h-4 w-4" aria-hidden="true" />
            <span>Nowy post</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
