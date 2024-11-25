import { Request, Response } from "express";
import prisma from '../prisma/prismaClient';
import response from '../utils/response';
import { createProductDTO, updateProductDTO } from "../interfaces/product.interface";
import { get } from "http";

export const createProduct = async(req: Request, res: Response) => {
    const { name, description, price, stock }: createProductDTO = req.body;
    const userId = req.user?.userId
    if(!userId) {
        return response(res, 'Bad Request', 'User_id tidak ditemukan', 400)
    }
     try {
        const createProduct = await prisma.product.create({
            data: { name, description, price, stock, user_id: userId }
        })
        response(res, createProduct, 'berhasil membuat product', 200)
     } catch(error) {
        console.error(error);
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
     }
}

export const getProductById = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const userId = req.user?.userId

    if(!id) {
        return response(res, 'Bad Request', 'Tambahkan path id', 400)
    }

    if(!userId) {
        return response(res, 'Bad Request', 'User_id tidak ditemukan atau kamu belum login', 400)
    }

    try {
        
        const getProduct = await prisma.product.findUnique({
            where: {
                id: id
            }
        })
        
        if(!getProduct) {
            return response(res, 'Not Found', 'Produk tidak ditemukan', 404)
        }
        
        if(userId !== getProduct.user_id) {
            return response(res, 'Unauthorized', 'Kamu tidak memiliki izin untuk melihat produk ini', 401)
        }
    } catch(error) {
        console.error(error)
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}