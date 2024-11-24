import { User } from '@prisma/client';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

interface UserPayload {
    id: number;
    role: string;
}

export const generateAccToken = (user: UserPayload): string => {
    if(!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined in .env file')
    }
    return jwt.sign({ id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET as Secret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    });
}

export const generateRefToken = (user: UserPayload): string => {
    if(!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined in .env file')
    }

    return jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET as Secret, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    });
}