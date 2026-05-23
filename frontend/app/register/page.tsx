"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, BookOpen, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PASSWORD_RULES = [
  { label: "Minimum 8 znaków", test: (p: string) => p.length >= 8 },
  { label: "Jedna wielka litera", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Jedna cyfra", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordValid = PASSWORD_RULES.every((r) => r.test(password));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordValid) {
      setError("Please make sure your password meets all requirements.");
      return;
    }

    setLoading(true);
    
    // registration logic here
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand mark */}
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">
            Stwórz konto
          </h1>
        </div>

        {/* Form card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="jan.kowalski@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username">Nazwa użytkownika</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="jan.kowalski"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/\s/g, ""))
                }
                required
                disabled={loading}
                minLength={3}
                maxLength={30}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  required
                  disabled={loading}
                  className="pr-10"
                  aria-describedby="password-requirements"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              {(passwordFocused || password.length > 0) && (
                <ul
                  id="password-requirements"
                  className="mt-2 space-y-1"
                  aria-label="Password requirements"
                >
                  {PASSWORD_RULES.map((rule) => {
                    const met = rule.test(password);
                    return (
                      <li
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs transition-colors ${
                          met ? "text-[oklch(0.58_0.18_145)]" : "text-muted-foreground"
                        }`}
                      >
                        {met ? (
                          <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        )}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-md px-3 py-2"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email || !username || username.length < 3 || !password}
            >
              {loading ? "Tworzenie konta..." : "Utwórz konto"}
            </Button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
         Już masz konto?{" "}
          <Link
            href="/login"
            className="text-accent font-medium hover:underline underline-offset-4"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}
