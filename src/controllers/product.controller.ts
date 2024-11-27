import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import response from "../utils/response";
import { createProductDTO, updateProductDTO } from "../interfaces/product.interface";

// Create product
export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, stock }: createProductDTO = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return response(res, 'Bad Request', 'User_id tidak ditemukan', 400);
    }

    try {
        const product = await prisma.product.create({
            data: { name, description, price, stock, user_id: userId }
        });
        response(res, product, 'Berhasil membuat produk', 201);
    } catch (error) {
        console.error(error);
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500);
    }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!id) {
        return response(res, 'Bad Request', 'ID produk tidak disediakan', 400);
    }

    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return response(res, 'Not Found', 'Produk tidak ditemukan', 404);
        }

        const isOwnerOrAdmin = userId === product.user_id || role === 'admin';
        if (!isOwnerOrAdmin) {
            return response(res, 'Unauthorized', 'Kamu tidak memiliki izin untuk melihat produk ini', 401);
        }

        response(res, product, 'Berhasil mengambil produk', 200);
    } catch (error) {
        console.error(error);
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500);
    }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) {
        return response(res, 'Unauthorized', 'Silakan login terlebih dahulu', 401);
    }

    try {
        const products = await prisma.product.findMany({
            where: role !== 'admin' ? { user_id: userId } : {}
        });

        if (products.length === 0) {
            return response(res, 'Not Found', 'Produk tidak ditemukan', 404);
        }

        response(res, products, 'Berhasil mengambil semua produk', 200);
    } catch (error) {
        console.error(error);
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500);
    }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, description, price, stock }: updateProductDTO = req.body;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) {
        return response(res, 'Unauthorized', 'Silakan login terlebih dahulu', 401);
    }

    try {
        const oldProduct = await prisma.product.findUnique({ where: { id } });
        if (!oldProduct) {
            return response(res, 'Not Found', 'Produk tidak ditemukan', 404);
        }

        if (userId !== oldProduct.user_id && role !== 'admin') {
            return response(res, 'Unauthorized', 'Tidak memiliki izin untuk mengedit produk ini', 401);
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { name, description, price, stock }
        });

        response(res, updatedProduct, 'Berhasil mengupdate produk', 200);
    } catch (error) {
        console.error(error);
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500);
    }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!id) {
        return response(res, 'Bad Request', 'ID produk tidak disediakan', 400);
    }

    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return response(res, 'Not Found', 'Produk tidak ditemukan', 404);
        }

        if (userId !== product.user_id && role !== 'admin') {
            return response(res, 'Unauthorized', 'Tidak memiliki izin untuk menghapus produk ini', 401);
        }

        await prisma.product.delete({ where: { id } });
        response(res, null, 'Berhasil menghapus produk', 200);
    } catch (error) {
        console.error(error);
        response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500);
    }
};
