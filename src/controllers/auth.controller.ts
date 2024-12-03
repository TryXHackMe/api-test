import prisma from '../prisma/prismaClient';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import response from '../utils/response';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const registerUser = async(req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    role ? role : 'customer';
    console.log(`name ${name}, email ${email}, password ${password}`)
    
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
        
        const cekToken = await prisma.refreshToken.findFirst({
            where : { user_id: user.id }
        })

        if (cekToken) {
            await prisma.refreshToken.update({
                where: { id: cekToken.id },
                data: { token: refToken}
            })
        } else {

            await prisma.refreshToken.create({
                data: {
                    token: refToken, user_id: user.id
                }
            })
        }


        const data = { accessToken: accToken, refreshToken: refToken }
        return response(res, data, 'Berhasil login', 200)
    } catch(error) {
        console.error(error)
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const refreshAccToken = async(req: Request, res: Response) => {

    const refToken = req.headers.authorization?.split(' ')[1]
    if(!refToken) return response(res, 'Bad Request', 'Refresh token tidak disediakan', 400)

    try {
        const decode = jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload & { userId: number }
        const cekToken = await prisma.refreshToken.findFirst({
            where: { token: refToken }
        })

        if(!cekToken) return response(res, 'Unauthorized', 'token tidak valid', 401)
        
        const user = await prisma.user.findUnique({
            where: { id: decode.userId }
        })

        if(user) {
            const newToken = jwt.sign({userId: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m'})
            return response(res, newToken, 'Berhasil membuat token baru', 200)
        } else {
            return response(res, 'Not Found', 'user tidak ditemukan', 404)
        }

    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}