import type { ApiArticle, ApiArticleList, ApiComment, ApiTag, ApiUser } from "./api-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "auth_token";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
      else if (body?.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// Articles

export interface FetchArticlesParams {
  title?: string;
  tags?: string;
  page?: number;
  limit?: number;
  sort?: "ASC" | "DESC";
}

export function fetchArticles(params: FetchArticlesParams = {}): Promise<ApiArticleList> {
  const query = new URLSearchParams();
  if (params.title) query.set("title", params.title);
  if (params.tags) query.set("tags", params.tags);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sort) query.set("sort", params.sort);
  const qs = query.toString();
  return apiFetch<ApiArticleList>(`/api/articles${qs ? `?${qs}` : ""}`);
}

export function fetchArticle(id: number): Promise<ApiArticle> {
  return apiFetch<ApiArticle>(`/api/articles/${id}`);
}

export function createArticle(body: {
  title: string;
  content: string;
  tagIds?: number[];
}): Promise<ApiArticle> {
  return apiFetch<ApiArticle>("/api/articles", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateArticle(
  id: number,
  body: { title?: string; content?: string; tagIds?: number[] }
): Promise<ApiArticle> {
  return apiFetch<ApiArticle>(`/api/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteArticle(id: number): Promise<void> {
  return apiFetch<void>(`/api/articles/${id}`, { method: "DELETE" });
}

// Tags

export function fetchTags(): Promise<ApiTag[]> {
  return apiFetch<ApiTag[]>("/api/tags");
}

export function createTag(name: string): Promise<ApiTag> {
  return apiFetch<ApiTag>("/api/tags", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// Comments

export function addComment(articleId: number, content: string): Promise<ApiComment> {
  return apiFetch<ApiComment>(`/api/articles/${articleId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

// Auth

export function login(email: string, password: string): Promise<{ token: string }> {
  return apiFetch<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  email: string,
  username: string,
  password: string
): Promise<ApiUser> {
  return apiFetch<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
}

// Users

export function getMe(): Promise<ApiUser> {
  return apiFetch<ApiUser>("/api/users/me");
}
