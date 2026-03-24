import { UserRole } from "../entities/User";

declare module "express-serve-static-core" {
    interface Request {
        userId?: number;
        userRole?: UserRole;
    }
}
