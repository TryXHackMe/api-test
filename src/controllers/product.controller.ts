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

        response(res, getProduct, 'Berhasil mengambil product', 200)
    } catch(error) {
        console.error(error)
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const getAllProductSeller = async(req: Request, res: Response) => {
    const userId = req.user?.userId
    if(!userId) {
        return response(res, 'Unauthorized', 'silahkan cek role anda dan coba lagi', 401)
    }

    try {
        const getAllProduct = await prisma.product.findMany({
            where: {
                user_id : userId
            }
        })

        if(!getAllProduct) {
            return response(res, 'Not Found', 'silahkan buat produk terlebih dahulu', 404)
        }

        response(res, getAllProduct, 'Berhasil mengambil semua product', 200)
    } catch(error) {
        console.error(error)
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const getAllProduct = async(req: Request, res:Response) => {
    const userId = req.user?.userId;

    if(!userId) {
        return response(res, 'Unauthorized', 'silahkan login terlebih dahulu', 401)
    }

    try {
        const getAllProducts = await prisma.product.findMany()
        response(res, getAllProducts, 'Berhasil mengambil semua product', 200)
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const updateProduct = async(req:Request, res: Response) => {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { name, description, price, stock }: updateProductDTO = req.body;
    const id = parseInt(req.params.id);

    if(!userId) {
        return response(res, 'Unauthorized', 'silahkan login terlebih dahulu', 401)
    }

    try {
        const oldData = await prisma.product.findUnique({
            where: { id : id }
        })

        if(!oldData) {
            return response(res, 'Not Found', 'produk yang anda cari tidak ditemukan', 404)
        }
    
        if(userId !== oldData?.user_id || role !== 'admin') {
            return response(res, 'Unauthorized', 'anda tidak memiliki izin untuk mengedit produk tersebut', 401)
        }

        const updateData = await prisma.product.update({
            data: {
                name,
                description,
                price,
                stock,
            }, 
            where: {
                id: id
            }
        })

        const data = {
            oldData, updateData
        }

        response(res, data, 'Berhasil update produk', 200)
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const deleteProduct = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const role = req.user?.role;
    const userId = req.user?.userId;
    
    if(!id) {
        return response(res, 'Bad Request', 'tambahkan path id', 400)
    }

    try {
        const cek = await prisma.product.findUnique({
            where: {
                id: id
            }
        })

        if(!cek) return response(res, 'Not Found', 'produk tidak ditemukan', 404);

        if(userId !== cek?.user_id || role !== 'admin') {
            return response(res, 'Unauthorized', 'Kamu tidak memiliki izin untuk menghapus produk ini', 401)
        }

        const deleteData = await prisma.product.findUnique({
            where: { id: id}
        })

        return response(res, deleteData, 'Berhasil menghapus data', 201);
    } catch(error) {
        console.error(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}