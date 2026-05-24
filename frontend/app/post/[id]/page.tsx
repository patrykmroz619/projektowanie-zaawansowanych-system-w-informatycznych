"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { fetchArticle } from "@/lib/api";
import { mapArticleToPost, mapApiCommentToComment } from "@/lib/mappers";
import type { Post, Comment } from "@/lib/types";
import type { ApiArticle } from "@/lib/api-types";
import { CategoryBadge } from "@/components/category-badge";
import { PostActions } from "@/components/post-actions";
import { CommentsSection } from "@/components/comments-section";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const [article, setArticle] = useState<ApiArticle | null | undefined>(undefined);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      setArticle(null);
      return;
    }
    fetchArticle(numericId)
      .then((a) => {
        setArticle(a);
        setPost(mapArticleToPost(a));
        setComments((a.comments ?? []).map((c) => mapApiCommentToComment(c, a.id)));
      })
      .catch(() => setArticle(null));
  }, [id]);

  if (article === null) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold font-serif text-foreground mb-3">
          Nie znaleziono posta
        </h1>
        <p className="text-muted-foreground mb-6">
          Post, którego szukasz, nie istnieje lub został usunięty.
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

  if (article === undefined || !post) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
          <div className="space-y-2 mt-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const date = new Date(post.createdAt);
  const updatedDate = new Date(post.updatedAt);
  const formattedDate = date.toLocaleDateString("pl-PL", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const wasEdited = post.createdAt !== post.updatedAt;

  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Wróć do listy postów
        </Link>
      </div>

      <header className="mb-8 pb-8 border-b border-border">
        <div className="mb-4">
          <CategoryBadge category={post.category} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground text-balance leading-tight mb-5">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden="true" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </span>
            {wasEdited && (
              <span className="italic text-xs">
                (edited{" "}
                {updatedDate.toLocaleDateString("pl-PL", {
                  month: "short",
                  day: "numeric",
                })}
                )
              </span>
            )}
          </div>

          <PostActions post={post} articleId={article.id} />
        </div>
      </header>

      <div className="prose-like space-y-5 text-foreground">
        {paragraphs.map((para, idx) => (
          <p
            key={idx}
            className="text-[1.0625rem] leading-[1.75] text-foreground/90"
          >
            {para}
          </p>
        ))}
      </div>

      <CommentsSection
        postId={id}
        articleId={article.id}
        initialComments={comments}
      />
    </article>
  );
}
