export interface Project {
    id: string;
    owner_id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateProjectInput {
    ownerId: string;
    name: string;
}