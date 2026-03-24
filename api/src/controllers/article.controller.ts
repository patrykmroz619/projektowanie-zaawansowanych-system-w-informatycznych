import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Article } from "../entities/Article";
import { Tag } from "../entities/Tag";
import { User } from "../entities/User";
import { In } from "typeorm";

const articleRepository = () => AppDataSource.getRepository(Article);
const tagRepository = () => AppDataSource.getRepository(Tag);
const userRepository = () => AppDataSource.getRepository(User);

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
    const sort = (req.query.sort as string)?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const title = req.query.title as string | undefined;
    const tags = req.query.tags as string | undefined;

    const qb = articleRepository()
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.tags", "tag")
      .leftJoinAndSelect("article.author", "author");

    if (title) {
      qb.andWhere("article.title LIKE :title", {
        title: `%${title}%`,
      });
    }

    if (tags) {
      const tagNames = tags.split(",").map((t) => t.trim());
      qb.andWhere("tag.name IN (:...tagNames)", { tagNames });
    }

    qb.orderBy("article.createdAt", sort);

    const total = await qb.getCount();

    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    res.status(200).json({ data, total, page, limit });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const article = await articleRepository().findOne({
      where: { id },
      relations: ["tags", "author", "comments", "comments.user"],
    });

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    res.status(200).json(article);
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, tagIds } = req.body;

    if (!title || !content) {
      res.status(400).json({
        message: "Title and content are required",
      });
      return;
    }

    const author = await userRepository().findOneBy({ id: req.userId });
    if (!author) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const article = articleRepository().create({ title, content, author });

    if (tagIds && tagIds.length > 0) {
      article.tags = await tagRepository().findBy({ id: In(tagIds) });
    }

    await articleRepository().save(article);

    res.status(201).json(article);
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const article = await articleRepository().findOne({
      where: { id },
      relations: ["tags"],
    });

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    const { title, content, tagIds } = req.body;

    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;

    if (tagIds !== undefined) {
      article.tags = tagIds.length > 0 ? await tagRepository().findBy({ id: In(tagIds) }) : [];
    }

    await articleRepository().save(article);

    res.status(200).json(article);
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const article = await articleRepository().findOneBy({ id });

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    await articleRepository().remove(article);

    res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
