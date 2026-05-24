"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PenSquare, BookOpen, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
        >
          <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-semibold text-lg tracking-tight">Blog</span>
        </Link>

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

          {isAdmin && (
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
          )}

          {!isLoading && (
            <div className="ml-3 flex items-center gap-2">
              {user ? (
                <>
                  <span className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {user.username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Wyloguj</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      pathname === "/login"
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Zaloguj
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium border border-border text-foreground hover:bg-secondary hover:border-accent transition-colors"
                  >
                    Rejestracja
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
