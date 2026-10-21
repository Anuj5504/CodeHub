import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./db/postgres";
import { redis } from "./config/redis";
import "dotenv/config";
import userRouter from "./modules/users/user.routes";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();


app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "cloud-hub-api" });
});

app.get("/api/ready", async (_req, res) => {
    try {
        await pool.query("SELECT 1");
        await redis.ping();

        res.json({
            status: "ready",
            postgres: "connected",
            redis: "connected"
        });
    } catch {
        res.status(503).json({
            status: "not_ready"
        });
    }
});

app.use("/api/users", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;