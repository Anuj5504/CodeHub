import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
    err: unknown,
    _req,
    res,
    _next
) => {
    if (res.headersSent) return;

    const error = err as {
        message?: string;
        statusCode?: number;
        code?: string;
    };

    // PostgreSQL unique-constraint violation.
    if (error.code === "23505") {
        res.status(409).json({
            error: { message: "Email is already registered" },
        });
        return;
    }

    const statusCode = error.statusCode;

    if (
        statusCode === 400 ||
        statusCode === 401 ||
        statusCode === 404
    ) {
        res.status(statusCode).json({
            error: { message: error.message },
        });
        return;
    }

    console.error(err);

    res.status(500).json({
        error: { message: "Internal server error" },
    });
};
