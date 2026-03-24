import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/User";

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            res.status(403).json({
                message: "Forbidden: insufficient permissions",
            });
            return;
        }
        next();
    };
};
