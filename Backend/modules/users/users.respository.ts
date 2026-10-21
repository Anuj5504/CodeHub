import { pool } from "../../db/postgres";
import {
    User,
    CreateUser
} from "./users.types";


export async function createUser(user: CreateUser): Promise<User> {
    const is_active = 1;
    const result = await pool.query<User>(
        `INSERT INTO users (email,password_hash,is_active)
        VALUES ($1,$2,$3)
        RETURNING id, email, created_at`,
        [user.email, user.password_hash, is_active]
    );

    return result.rows[0];
}

export async function getUserDetails(id: string): Promise<User> {
    const result = await pool.query<User>(
        `SELECT *
        FROM users 
        WHERE id=$1`,
        [id]
    );

    return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<User> {
    const result = await pool.query<User>(
        `SELECT *
        FROM users 
        WHERE email=$1`,
        [email]
    );

    return result.rows[0];
}