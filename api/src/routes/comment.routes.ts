import { Router } from "express";
import { getByArticle, create } from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:id/comments", getByArticle);
router.post("/:id/comments", authMiddleware, create);

export default router;
