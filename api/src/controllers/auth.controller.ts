import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepository = () => AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            res.status(400).json({
                message: "Email, username and password are required",
            });
            return;
        }

        const existingUser = await userRepository().findOneBy({ email });
        if (existingUser) {
            res.status(409).json({ message: "Email already in use" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository().create({
            email,
            username,
            password: hashedPassword,
        });

        await userRepository().save(user);

        res.status(201).json({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
            return;
        }

        const user = await userRepository()
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.email = :email", { email })
            .getOne();

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
