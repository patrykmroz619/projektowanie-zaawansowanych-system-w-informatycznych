"use client";

import { useState } from "react";
import Link from "next/link";
import type { Comment } from "@/lib/types";
import { addComment, ApiError } from "@/lib/api";
import { mapApiCommentToComment } from "@/lib/mappers";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from "lucide-react";

interface CommentsSectionProps {
  postId: string;
  articleId: number;
  initialComments: Comment[];
}

export function CommentsSection({
  postId,
  articleId,
  initialComments,
}: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      setError("Komentarz musi zawierać co najmniej 5 znaków.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const apiComment = await addComment(articleId, content.trim());
      const newComment = mapApiCommentToComment(apiComment, articleId);
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Błąd podczas dodawania komentarza.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="comments-heading"
      className="mt-12 pt-10 border-t border-border"
    >
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2
          id="comments-heading"
          className="text-xl font-bold font-serif text-foreground"
        >
          {comments.length}{" "}
          {comments.length === 1 ? "Komentarz" : "Komentarze"}
        </h2>
      </div>

      {comments.length > 0 ? (
        <ol className="space-y-5 mb-10">
          {comments.map((comment) => {
            const date = new Date(comment.createdAt);
            const formatted = date.toLocaleDateString("pl-PL", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <li
                key={comment.id}
                className="flex gap-3 bg-card border border-border rounded-lg p-4"
              >
                <div className="shrink-0 h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-foreground">
                      {comment.author}
                    </span>
                    <time
                      dateTime={comment.createdAt}
                      className="text-xs text-muted-foreground"
                    >
                      {formatted}
                    </time>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="mb-10 py-8 text-center rounded-lg border border-dashed border-border">
          <MessageSquare
            className="h-8 w-8 mx-auto text-muted-foreground mb-2"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            Brak komentarzy. Bądź pierwszy, który podzieli się swoimi myślami!
          </p>
        </div>
      )}

      {user ? (
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6">
          <h3 className="text-base font-semibold text-foreground mb-5">
            Zostaw komentarz
          </h3>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="comment-content"
                className="block text-sm font-medium text-foreground"
              >
                Komentarz <span className="text-destructive">*</span>
              </label>
              <textarea
                id="comment-content"
                rows={4}
                placeholder="Podziel się swoimi myślami..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed ${
                  error ? "border-destructive" : "border-input"
                }`}
                aria-describedby={error ? "comment-error" : undefined}
              />
              {error && (
                <p
                  id="comment-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Publikowanie..." : "Opublikuj Komentarz"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-accent font-medium hover:underline">
              Zaloguj się
            </Link>
            , aby dodać komentarz.
          </p>
        </div>
      )}
    </section>
  );
}
