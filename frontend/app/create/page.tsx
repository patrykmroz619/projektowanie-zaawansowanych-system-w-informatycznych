"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createArticle, fetchTags, createTag, ApiError } from "@/lib/api";
import type { ApiTag } from "@/lib/api-types";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, PenSquare, Plus } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<ApiTag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagError, setNewTagError] = useState<string | null>(null);
  const [creatingTag, setCreatingTag] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTags()
      .then(setAvailableTags)
      .catch(() => {});
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold font-serif text-foreground mb-3">
          Brak dostępu
        </h1>
        <p className="text-muted-foreground mb-6">
          Tylko administratorzy mogą tworzyć nowe posty.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Wróć do listy postów
        </Link>
      </div>
    );
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Tytuł jest wymagany.";
    else if (title.length > 120)
      newErrors.title = "Tytuł musi zawierać maksymalnie 120 znaków.";
    if (!content.trim()) newErrors.content = "Treść jest wymagana.";
    else if (content.trim().length < 30)
      newErrors.content = "Treść musi zawierać co najmniej 30 znaków.";
    return newErrors;
  }

  function toggleTag(id: number) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleCreateTag() {
    const name = newTagName.trim();
    if (!name) {
      setNewTagError("Nazwa tagu jest wymagana.");
      return;
    }
    setNewTagError(null);
    setCreatingTag(true);
    try {
      const tag = await createTag(name);
      setAvailableTags((prev) => [...prev, tag]);
      setTagIds((prev) => [...prev, tag.id]);
      setNewTagName("");
    } catch (err) {
      setNewTagError(
        err instanceof ApiError ? err.message : "Nie udało się utworzyć tagu."
      );
    } finally {
      setCreatingTag(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      await createArticle({
        title: title.trim(),
        content: content.trim(),
        tagIds,
      });
      router.push("/");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Wystąpił błąd. Spróbuj ponownie."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Wróć do postów
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
          <PenSquare className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">
            Nowy post
          </h1>
          <p className="text-sm text-muted-foreground">Udostępnij swoje pomysły.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6 bg-card border border-border rounded-xl p-6 sm:p-8">
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
              className={
                errors.title
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              aria-describedby={errors.title ? "title-error" : undefined}
              maxLength={120}
            />
            <div className="flex justify-between items-center">
              {errors.title ? (
                <p
                  id="title-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
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

          <div className="space-y-3">
            <span className="block text-sm font-semibold text-foreground">
              Tagi
            </span>
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {availableTags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-1.5 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={tagIds.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                      className="h-4 w-4 rounded border-input"
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Nowy tag..."
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  setNewTagError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
                className={`max-w-[200px] ${newTagError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={creatingTag}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={creatingTag}
                onClick={handleCreateTag}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {creatingTag ? "Dodawanie..." : "Dodaj tag"}
              </Button>
            </div>
            {newTagError && (
              <p className="text-xs text-destructive" role="alert">
                {newTagError}
              </p>
            )}
          </div>

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
              <p
                id="content-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.content}
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-md px-3 py-2">
              {submitError}
            </p>
          )}

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
