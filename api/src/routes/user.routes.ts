import { Router } from "express";
import { updateRole } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.patch("/:id/role", authMiddleware, authorizeRoles(UserRole.ADMIN), updateRole);

export default router;
