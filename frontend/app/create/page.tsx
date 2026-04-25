"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { savePost } from "@/lib/store";
import { CATEGORIES, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, PenSquare } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Tech");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Tytuł jest wymagany.";
    else if (title.length > 120) newErrors.title = "Tytuł musi zawierać maksymalnie 120 znaków.";
    if (!content.trim()) newErrors.content = "Treść jest wymagana.";
    else if (content.trim().length < 30) newErrors.content = "Treść musi zawierać co najmniej 30 znaków.";
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const excerpt =
      content.trim().slice(0, 180) + (content.trim().length > 180 ? "..." : "");

    savePost({
      title: title.trim(),
      category,
      content: content.trim(),
      excerpt,
      author: "You",
    });

    router.push("/");
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Wróć do postów
        </Link>
      </div>

      {/* Page heading */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
          <PenSquare className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">
            Nowy post
          </h1>
          <p className="text-sm text-muted-foreground">
            Udostępnij swoje pomysły.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6 bg-card border border-border rounded-xl p-6 sm:p-8">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-foreground"
            >
              Tytuł <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Wprowadź tytuł posta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
              aria-describedby={errors.title ? "title-error" : undefined}
              maxLength={120}
            />
            <div className="flex justify-between items-center">
              {errors.title ? (
                <p id="title-error" className="text-xs text-destructive" role="alert">
                  {errors.title}
                </p>
              ) : (
                <span />
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {title.length}/120
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-foreground"
            >
              Kategoria <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full h-10 pl-3 pr-8 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-foreground"
            >
              Treść <span className="text-destructive">*</span>
            </label>
            <textarea
              id="content"
              rows={14}
              placeholder="Napisz treść swojego posta..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 leading-relaxed ${
                errors.content
                  ? "border-destructive focus:ring-destructive"
                  : "border-input"
              }`}
              aria-describedby={errors.content ? "content-error" : undefined}
            />
            {errors.content && (
              <p id="content-error" className="text-xs text-destructive" role="alert">
                {errors.content}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="min-w-[120px]"
            >
              {submitting ? "Publikowanie..." : "Opublikuj post"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/">Anuluj</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
