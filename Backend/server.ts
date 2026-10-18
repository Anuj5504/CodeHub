import "dotenv/config";
import app from "./app";
import { pool } from "./config/db/postgres";
import { redis } from "./config/db/redis";

async function startServer() {
    try {
        await pool.query("SELECT 1");
        await redis.connect();

        const port = Number(process.env.PORT ?? 3000);

        app.listen(port, () => {
            console.log(`API listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start API", error);

        await pool.end().catch(() => { });
        redis.disconnect();

        process.exitCode = 1;
    }
}

void startServer();

