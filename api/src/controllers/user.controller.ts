import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";

const userRepository = () => AppDataSource.getRepository(User);

export const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const { role } = req.body;

        if (!role) {
            res.status(400).json({ message: "Role is required" });
            return;
        }

        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({
                message: `Invalid role. Allowed values: ${Object.values(UserRole).join(", ")}`,
            });
            return;
        }

        if (id === req.userId) {
            res.status(400).json({ message: "Cannot change your own role" });
            return;
        }

        const user = await userRepository().findOneBy({ id });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.role = role;
        await userRepository().save(user);

        res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
