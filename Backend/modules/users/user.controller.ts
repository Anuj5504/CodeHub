
import type { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";

export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await userService.registerUser(req.body);

        res.status(201).json({
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await userService.loginUser(req.body);

        res.status(200).json({
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getCurrentUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                error: { message: "Authentication required" },
            });
            return;
        }

        const user = await userService.getCurrentUser(req.user.id);

        res.status(200).json({
            data: user,
        });
    } catch (error) {
        next(error);
    }
}
