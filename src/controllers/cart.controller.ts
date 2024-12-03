import { Request, Response } from "express";
import response from "../utils/response";
import prisma from "../prisma/prismaClient";
import jwt, { JwtPayload} from 'jsonwebtoken';
import { updateCartDTO, createCartDTO } from "../interfaces/cart.interface";
import { ADDRGETNETWORKPARAMS } from "dns";

export const createCart = async(req: Request, res: Response) => {
    const { product_id, quantity } : createCartDTO = req.body;
    const userId = req.body.user.userId;

    if(!product_id || !quantity ) {
        return response(res, 'Bad Request', 'product_id, dan quantity tidak ada', 400)
    }

    try {
        const createData = await prisma.carts.create({
            data: { quantity, product_id, user_id: userId }
        })
        return response(res, createData, 'Berhasil membuat data', 201)
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const getCarts = async(req: Request, res: Response) => {
    const { userId, role } = req.body.user

    try {
        const getData = await prisma.carts.findMany({
            where: role !== 'admin' ? {user_id : userId} : {}
        })
        return response(res, getData, 'Berhasil mengambil data', 201)
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const updateCart = async(req: Request, res: Response) => {
    const { product_id, quantity, is_active } : updateCartDTO = req.body;
    const id = parseInt(req.params.id)

    if(!product_id || !quantity) {
        return response(res, 'Bad Request', 'quantity dan product_id tidak ada', 400)
    }

    try {
        const oldData = await prisma.carts.findUnique({
            where: { id }
        })

        const updateData = await prisma.carts.update({
            data: {
                product_id,
                quantity
            },
            where: { id }
        })

        const data = { oldData, updateData }
        return response(res, data, 'Berhasil Update Data', 201)
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const deleteCart = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const userId = req.body.user.userId
    const role = req.body.user.role

    try {
        const check = await prisma.carts.findUnique({
            where : { id }
        })

        if(!check) {
            return response(res, 'Not Found', 'Data yang anda minta tidak ditemukan', 404)
        }

        if(check.user_id !== userId || role !== 'admin') {
            return response(res, 'Unauthorized', 'Kamu tidak memilik izin', 401)
        } else {
            const deleteData = await prisma.carts.delete({
                where: { id }
            })
            return response(res, 'success', 'Berhasil menghapus data', 201)
        }
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}