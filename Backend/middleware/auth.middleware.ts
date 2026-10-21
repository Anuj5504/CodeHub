import { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";


function getJwtSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET not found");
    }

    return secret;
}

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            error: { message: "Authentication required" },
        });
        return;
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
        res.status(401).json({
            error: { message: "Authentication required" },
        });
        return;
    }

    try {
        const payload = jwt.verify(token, getJwtSecret());

        if (
            typeof payload === "string" ||
            !payload.sub ||
            typeof payload.email !== "string"
        ) {
            res.status(401).json({
                error: { message: "Invalid access token" },
            });
            return;
        }

        req.user = {
            id: payload.sub,
            email: payload.email,
        };

        next();
    } catch {
        res.status(401).json({
            error: { message: "Invalid or expired access token" },
        });
    }
}