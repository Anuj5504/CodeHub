export interface User {
    id: string;
    email: string;
    password_hash: string;
    is_active: 0 | 1;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUser {
    email: string;
    password_hash: string;
}