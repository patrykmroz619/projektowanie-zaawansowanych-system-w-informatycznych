import { Router } from "express";
import { getAll, create } from "../controllers/tag.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.get("/", getAll);
router.post("/", authMiddleware, authorizeRoles(UserRole.ADMIN), create);

export default router;
