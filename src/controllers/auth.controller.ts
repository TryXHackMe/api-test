import prisma from '../prisma/prismaClient';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import response from '../utils/response';
import jwt from 'jsonwebtoken';

export const registerUser = async(req: Request, res: Response) => {
    const { name, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
    
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })
        response(res, newUser, 'Berhasil menambahkan user', 200)
    } catch(error) {
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const loginUser = async(req: Request, res: Response) => {
    const { email, password } = req.body
    
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!user) return response(res, 'Unauthorized', 'Email atau Password salah', 404)
        
        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid) return response(res, 'Unauthorized', 'Email atau Password salah', 401)

        if(!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            throw new Error('Token secret tidak di definisikan di file .env')
        }

        const accToken = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const refToken = jwt.sign({ userId: user.id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

        await prisma.refreshToken.create({
            data: {
                token: refToken, user_id: user.id
            }
        })

        const data = { accessToken: accToken, refreshToken: refToken }
        return response(res, data, 'Berhasil login', 200)
    } catch(error) {
        console.error(error)
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}