"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchArticles, fetchTags } from "@/lib/api";
import { mapArticleToPost } from "@/lib/mappers";
import type { ApiTag } from "@/lib/api-types";
import type { Post } from "@/lib/types";
import { CategoryBadge } from "@/components/category-badge";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [tags, setTags] = useState<ApiTag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags()
      .then(setTags)
      .catch(() => {});
  }, []);

  const loadArticles = useCallback(() => {
    setLoading(true);
    fetchArticles({
      title: searchQuery.trim() || undefined,
      tags: selectedTag !== "All" ? selectedTag : undefined,
      limit: 100,
    })
      .then((res) => setPosts(res.data.map(mapArticleToPost)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedTag]);

  useEffect(() => {
    const timer = setTimeout(loadArticles, 300);
    return () => clearTimeout(timer);
  }, [loadArticles]);

  return (
    <>
      <section className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-serif mb-4 text-balance">
          Witamy na naszym blogu!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Odkryj inspirujące artykuły na tematy związane z technologią, stylem życia, edukacją, podróżami i zdrowiem.
        </p>
      </section>

      <div className="mb-8 space-y-4">
        <div className="relative max-w-lg mx-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Szukaj postów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11"
          />
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-1">
              Filtr:
            </span>
            <Button
              variant={selectedTag === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("All")}
            >
              Wszystkie
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTag === tag.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag.name)}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <>Ładowanie postów...</>
          ) : posts.length === 0 ? (
            <>Nie znaleziono postów. Spróbuj dostosować filtry.</>
          ) : (
            <>
              Znaleziono {posts.length}{" "}
              {posts.length === 1 ? "post" : "postów"}
            </>
          )}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border p-6 space-y-3">
              <div className="h-4 w-16 bg-muted rounded-full" />
              <div className="h-5 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="space-y-2 mt-4">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        posts.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const date = new Date(post.createdAt);
              const formattedDate = date.toLocaleDateString("pl-PL", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <Card
                  key={post.id}
                  className="flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="mb-2">
                      <CategoryBadge category={post.category} />
                    </div>
                    <CardTitle className="text-xl font-serif leading-tight text-balance">
                      <Link
                        href={`/post/${post.id}`}
                        className="hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs mt-2">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <time dateTime={post.createdAt}>{formattedDate}</time>
                      <span className="mx-1.5">·</span>
                      <span>{post.author}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/post/${post.id}`}
                      className="text-sm font-medium text-accent hover:underline focus:outline-none focus:underline"
                    >
                      Czytaj więcej →
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )
      )}
    </>
  );
}
