import { pool } from "../../db/postgres";
import type {
    Project,
    CreateProjectInput
} from "./projects.types";


export async function CreateProject(input: CreateProjectInput): Promise<Project> {

    const result = await pool.query<Project>(
        `INSERT INTO Project (owner_id,name)
        VALUES ($1,$2)
        RETURNING *
        `,
        [input.ownerId, input.name]
    );

    return result.rows[0];
}

export async function getProjectsByOwnerId(owner_id: string): Promise<Project[]> {

    const result = await pool.query<Project>(
        `SELECT *
        FROM Project
        WHERE owner_id = $1`,
        [owner_id]
    );

    return result.rows;
}