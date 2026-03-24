import { Router } from "express";
import {
    getAll,
    getById,
    create,
    update,
    remove,
} from "../controllers/article.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authMiddleware, authorizeRoles(UserRole.ADMIN), create);
router.put("/:id", authMiddleware, authorizeRoles(UserRole.ADMIN), update);
router.delete("/:id", authMiddleware, authorizeRoles(UserRole.ADMIN), remove);

export default router;
