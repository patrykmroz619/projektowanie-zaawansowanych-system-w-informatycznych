import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../entities/Comment";
import { Article } from "../entities/Article";
import { User } from "../entities/User";

const commentRepository = () => AppDataSource.getRepository(Comment);
const articleRepository = () => AppDataSource.getRepository(Article);
const userRepository = () => AppDataSource.getRepository(User);

export const getByArticle = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const articleId = parseInt(req.params.id as string);

        const article = await articleRepository().findOneBy({ id: articleId });
        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }

        const comments = await commentRepository().find({
            where: { article: { id: articleId } },
            relations: ["user"],
            order: { createdAt: "DESC" },
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Get comments error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const articleId = parseInt(req.params.id as string);
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ message: "Content is required" });
            return;
        }

        const article = await articleRepository().findOneBy({ id: articleId });
        if (!article) {
            res.status(404).json({ message: "Article not found" });
            return;
        }

        const user = await userRepository().findOneBy({ id: req.userId });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        const comment = commentRepository().create({
            content,
            article,
            user,
        });

        await commentRepository().save(comment);

        res.status(201).json(comment);
    } catch (error) {
        console.error("Create comment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
