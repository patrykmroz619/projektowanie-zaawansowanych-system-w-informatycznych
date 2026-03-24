import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Tag } from "../entities/Tag";

const tagRepository = () => AppDataSource.getRepository(Tag);

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tags = await tagRepository().find();
        res.status(200).json(tags);
    } catch (error) {
        console.error("Get tags error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ message: "Tag name is required" });
            return;
        }

        const existing = await tagRepository().findOneBy({ name });
        if (existing) {
            res.status(409).json({ message: "Tag already exists" });
            return;
        }

        const tag = tagRepository().create({ name });
        await tagRepository().save(tag);

        res.status(201).json(tag);
    } catch (error) {
        console.error("Create tag error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
