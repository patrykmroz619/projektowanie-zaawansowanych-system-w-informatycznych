export type Category = "Tech" | "Lifestyle" | "Edukacja" | "Podróże" | "Zdrowie";

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  category: Category;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES: Category[] = [
  "Tech",
  "Lifestyle",
  "Edukacja",
  "Podróże",
  "Zdrowie",
];
