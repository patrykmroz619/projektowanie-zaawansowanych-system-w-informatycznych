"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types";
import { updateArticle, deleteArticle, fetchTags, ApiError } from "@/lib/api";
import type { ApiTag } from "@/lib/api-types";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X, Check, AlertTriangle } from "lucide-react";

interface PostActionsProps {
  post: Post;
  articleId: number;
}

export function PostActions({ post, articleId }: PostActionsProps) {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editTagIds, setEditTagIds] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<ApiTag[]>([]);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openEdit() {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditErrors({});
    setSaveError(null);
    setEditOpen(true);
    fetchTags().then((tags) => {
      setAvailableTags(tags);
      const currentTagName = post.category;
      const matched = tags.find((t) => t.name === currentTagName);
      setEditTagIds(matched ? [matched.id] : []);
    });
  }

  function validateEdit() {
    const errs: Record<string, string> = {};
    if (!editTitle.trim()) errs.title = "Tytuł jest wymagany.";
    if (!editContent.trim()) errs.content = "Treść jest wymagana.";
    return errs;
  }

  async function handleSave() {
    const errs = validateEdit();
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await updateArticle(articleId, {
        title: editTitle.trim(),
        content: editContent.trim(),
        tagIds: editTagIds,
      });
      setEditOpen(false);
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Błąd zapisu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteArticle(articleId);
      router.push("/");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Błąd usuwania.");
      setDeleting(false);
    }
  }

  function toggleTag(id: number) {
    setEditTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={openEdit}
          className="gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edytuj
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/40 hover:border-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Usuń
        </Button>
      </div>

      {editOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
            aria-hidden="true"
          />

          <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="edit-modal-title"
                className="text-xl font-bold font-serif text-foreground"
              >
                Edytuj Post
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close edit dialog"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-semibold text-foreground"
                >
                  Tytuł <span className="text-destructive">*</span>
                </label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={editErrors.title ? "border-destructive" : ""}
                />
                {editErrors.title && (
                  <p className="text-xs text-destructive">{editErrors.title}</p>
                )}
              </div>

              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <span className="block text-sm font-semibold text-foreground">
                    Tagi
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center gap-1.5 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={editTagIds.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                          className="h-4 w-4 rounded border-input"
                        />
                        {tag.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="edit-content"
                  className="block text-sm font-semibold text-foreground"
                >
                  Treść <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="edit-content"
                  rows={12}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={`w-full resize-none rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed ${
                    editErrors.content ? "border-destructive" : "border-input"
                  }`}
                />
                {editErrors.content && (
                  <p className="text-xs text-destructive">
                    {editErrors.content}
                  </p>
                )}
              </div>

              {saveError && (
                <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-md px-3 py-2">
                  {saveError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[100px] gap-1.5"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Zapisywanie..." : "Zapisz Zmiany"}
                </Button>
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Anuluj
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setDeleteOpen(false)}
            aria-hidden="true"
          />

          <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle
                  className="h-6 w-6 text-destructive"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2
                  id="delete-modal-title"
                  className="text-lg font-bold text-foreground"
                >
                  Usunąć post?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nie można cofnąć tej akcji. Czy na pewno chcesz usunąć ten
                  post?
                </p>
              </div>
              {deleteError && (
                <p className="text-sm text-destructive">{deleteError}</p>
              )}
              <div className="flex gap-3 w-full">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                >
                  Anuluj
                </Button>
                <Button
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Usuwanie..." : "Usuń"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
