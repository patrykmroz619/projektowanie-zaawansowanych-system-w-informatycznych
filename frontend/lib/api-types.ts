export interface ApiTag {
  id: number;
  name: string;
}

export interface ApiUser {
  id: number;
  email: string;
  username: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface ApiComment {
  id: number;
  content: string;
  createdAt: string;
  user: ApiUser;
  article?: { id: number; title: string };
}

export interface ApiArticle {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: ApiUser;
  tags: ApiTag[];
  comments?: ApiComment[];
}

export interface ApiArticleList {
  data: ApiArticle[];
  total: number;
  page: number;
  limit: number;
}
