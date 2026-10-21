import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepository from "./users.respository";

// Input types
interface RegisterUserInput {
    email: string;
    password: string;
}

interface LoginUserInput {
    email: string;
    password: string;
}

function getJwtSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET not found");
    }

    return secret;
}

function createAccessToken(user: { id: string; email: string }): string {
    return jwt.sign(
        { email: user.email },
        getJwtSecret(),
        {
            subject: user.id,
            expiresIn: "15m",
        }
    );
}

export async function registerUser(input: RegisterUserInput) {
    const email = input.email.trim().toLowerCase();

    if (Buffer.byteLength(input.password, "utf8") > 72) {
        throw Object.assign(
            new Error("Password must not exceed 72 UTF-8 bytes"),
            { statusCode: 400 }
        );
    }

    const password_hash = await bcrypt.hash(input.password, 12);

    const user = await userRepository.createUser({
        email,
        password_hash
    });

    // console.log(user.id);

    const accessToken = createAccessToken({
        id: user.id,
        email: user.email,
    });

    return {
        user,
        accessToken,
        tokenType: "Bearer",
        expiresIn: 900,
    };
}


export async function loginUser(input: LoginUserInput) {
    const email = input.email.trim().toLowerCase();

    const user = await userRepository.findUserByEmail(email);

    if (
        !user ||
        !(await bcrypt.compare(input.password, user.password_hash))
    ) {
        throw Object.assign(
            new Error("Invalid email or password"),
            { statusCode: 401 }
        );
    }

    const accessToken = createAccessToken({
        id: user.id,
        email: user.email,
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            createdAt: user.created_at,
        },
        accessToken,
        tokenType: "Bearer",
        expiresIn: 900,
    };
}

export async function getCurrentUser(userId: string) {
    const user = await userRepository.getUserDetails(userId);

    if (!user) {
        throw Object.assign(
            new Error("User not found"),
            { statusCode: 404 }
        );
    }

    return user;
}