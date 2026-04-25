"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { addComment } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, User } from "lucide-react";

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentsSection({
  postId,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!author.trim()) errs.author = "Name is required.";
    if (!content.trim()) errs.content = "Comment cannot be empty.";
    else if (content.trim().length < 5)
      errs.content = "Comment must be at least 5 characters.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const newComment = addComment({
      postId,
      author: author.trim(),
      content: content.trim(),
    });
    setComments((prev) => [...prev, newComment]);
    setAuthor("");
    setContent("");
    setSubmitting(false);
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-12 pt-10 border-t border-border">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2
          id="comments-heading"
          className="text-xl font-bold font-serif text-foreground"
        >
          {comments.length} {comments.length === 1 ? "Komentarz" : "Komentarze"}
        </h2>
      </div>

      {/* Comment List */}
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
                {/* Avatar */}
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

      {/* Add Comment Form */}
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Zostaw komentarz
        </h3>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="comment-author"
              className="block text-sm font-medium text-foreground"
            >
              Twoje Imię <span className="text-destructive">*</span>
            </label>
            <Input
              id="comment-author"
              type="text"
              placeholder="np. Jan Kowalski"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={errors.author ? "border-destructive" : ""}
              aria-describedby={errors.author ? "comment-author-error" : undefined}
            />
            {errors.author && (
              <p
                id="comment-author-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.author}
              </p>
            )}
          </div>

          {/* Comment */}
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
                errors.content ? "border-destructive" : "border-input"
              }`}
              aria-describedby={errors.content ? "comment-content-error" : undefined}
            />
            {errors.content && (
              <p
                id="comment-content-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.content}
              </p>
            )}
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Publikowanie..." : "Opublikuj Komentarz"}
          </Button>
        </form>
      </div>
    </section>
  );
}
