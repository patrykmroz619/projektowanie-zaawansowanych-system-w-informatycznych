import type { ApiArticle, ApiComment } from "./api-types";
import type { Comment, Post } from "./types";

export function mapArticleToPost(article: ApiArticle): Post {
  const content = article.content;
  const excerpt =
    content.length > 180 ? content.slice(0, 180) + "..." : content;

  return {
    id: String(article.id),
    title: article.title,
    category: article.tags[0]?.name ?? "Tech",
    content,
    excerpt,
    author: article.author.username,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

export function mapApiCommentToComment(
  c: ApiComment,
  articleId: number
): Comment {
  return {
    id: String(c.id),
    postId: String(articleId),
    author: c.user.username,
    content: c.content,
    createdAt: c.createdAt,
  };
}
