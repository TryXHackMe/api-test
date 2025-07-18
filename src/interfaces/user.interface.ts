export interface User {
    id?: number;
    name: string;
    email: string;
    role?: string;
    password: string;
    updatedAt?: Date;
    createdAt?: Date;
}