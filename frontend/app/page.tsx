"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getPosts } from "@/lib/store";
import { CATEGORIES, Category } from "@/lib/types";
import { CategoryBadge } from "@/components/category-badge";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");

  const allPosts = getPosts();

  const filteredPosts = useMemo(() => {
    let filtered = allPosts;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allPosts, selectedCategory, searchQuery]);

  return (
    <>
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-serif mb-4 text-balance">
          Witamy na naszym blogu!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Odkryj inspirujące artykuły na tematy związane z technologią, stylem życia, edukacją, podróżami i zdrowiem.
        </p>
      </section>

      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
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

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1">
            Filtr:
          </span>
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
          >
            Wszystkie
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          {filteredPosts.length === 0 ? (
            <>Nie znaleziono postów. Spróbuj dostosować filtry.</>
          ) : (
            <>
              Znaleziono {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "postów"}
            </>
          )}
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
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
      )}
    </>
  );
}
