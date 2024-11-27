import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import response from '../utils/response';

export const verifyToken = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split('')[1];

    if(!token) return response(res, 'Bad Request', 'access token dibutuhkan tambahkan di header authorization', 400)
    
    if(!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET tidak di definisikan di file .env')
    }

    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload & { userId: number; role: string };
        req.user = decode;
        next()
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi Kesalahan Pada server', 500)
    }
}

export const checkRole = (...allowedRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role

        if(!userRole) {
            return response(res, 'Unauthorized', 'silahkan login terlebih dahulu', 401)
        }

        if(!allowedRole.includes(userRole)) {
            return response(res, 'Unauthorized', 'kamu tidak memiliki izin untuk mengakses ini', 401)
        }

        next()
    }
}
