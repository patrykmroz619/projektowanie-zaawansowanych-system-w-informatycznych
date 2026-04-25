"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Post } from "@/lib/types";
import { CATEGORIES, Category } from "@/lib/types";
import { updatePost, deletePost } from "@/lib/store";
import { CategoryBadge } from "@/components/category-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X, Check, AlertTriangle, ArrowLeft } from "lucide-react";

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  const router = useRouter();

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editCategory, setEditCategory] = useState<Category>(post.category);
  const [editContent, setEditContent] = useState(post.content);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Delete confirm state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function openEdit() {
    setEditTitle(post.title);
    setEditCategory(post.category);
    setEditContent(post.content);
    setEditErrors({});
    setEditOpen(true);
  }

  function validateEdit() {
    const errs: Record<string, string> = {};
    if (!editTitle.trim()) errs.title = "Title is required.";
    if (!editContent.trim()) errs.content = "Content is required.";
    return errs;
  }

  function handleSave() {
    const errs = validateEdit();
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }
    setSaving(true);
    const excerpt =
      editContent.trim().slice(0, 180) +
      (editContent.trim().length > 180 ? "..." : "");
    updatePost(post.id, {
      title: editTitle.trim(),
      category: editCategory,
      content: editContent.trim(),
      excerpt,
    });
    // Force a page reload to reflect changes
    router.refresh();
    setEditOpen(false);
    setSaving(false);
  }

  function handleDelete() {
    setDeleting(true);
    deletePost(post.id);
    router.push("/");
  }

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={openEdit} className="gap-1.5">
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

      {/* ---- Edit Modal ---- */}
      {editOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            {/* Header */}
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
              {/* Title */}
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

              {/* Category */}
              <div className="space-y-1.5">
                <label
                  htmlFor="edit-category"
                  className="block text-sm font-semibold text-foreground"
                >
                  Kategoria
                </label>
                <div className="relative">
                  <select
                    id="edit-category"
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value as Category)
                    }
                    className="w-full h-10 pl-3 pr-8 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
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

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[100px] gap-1.5"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Zapisywanie..." : "Zapisz Zmiany"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Delete Confirm Modal ---- */}
      {deleteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setDeleteOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
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
                  Nie można cofnąć tej akcji. Czy na pewno chcesz usunąć ten post?
                </p>
              </div>
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
