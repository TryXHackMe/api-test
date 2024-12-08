import prisma from "../prisma/prismaClient"
import { Request, Response } from "express"
import response from "../utils/response"

export const createOrder = async(req: Request, res: Response) => {
    const { items, status } = req.body;
    const userId = req.body.user.userId

    if(!items || items.length === 0) {
        return response(res, 'Bad Request', 'items diperlukan', 400)
    }

    try {
        const total = items.reduce((acc: number, item: { price: number; quantity: number}) => {
            return acc + item.price * item.quantity
        }, 0)

        const order = await prisma.order.create({
            data: {
                user_id: userId,
                total,
                status: status || 'pending',
                items : {
                    create: items.map((item: { product_id: number; price: number; quantity: number}) => ({
                        product_id: item.product_id,
                        price: item.price,
                        quantity: item.quantity
                    })),
                },
            },
            include: {
                items: true
            }
        })

        return response(res, order, 'Berhasil menambahkan order', 201)
    } catch(error) {
        console.error(error);
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const getOrder = async(req:Request, res:Response) => {
    const id = parseInt(req.params.id)
    if(!id) {
        return response(res, 'Bad Request', 'id harus di sertakan', 400);
    }

    try {
        const getData = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true
            }
        })

        return response(res, getData, 'Berhasil ambil data', 201)
    } catch(error) {
        console.log(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 201)
    }
}

export const deleteOrder = async(req: Request, res: Response) => {
    const orderId = parseInt(req.params.id)

    if(!orderId) {
        return response(res, 'Bad Request', 'id harus di sertakan', 400)
    }

    try {
        const deleteData = await prisma.order.delete({
            where: { id: orderId },
            include: {
                items: true
            }
        })

        return response(res, deleteData, 'Berhasil menghapus data', 200)
    } catch(error) {
        console.log(error)
        return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

module.exports = {
    createOrder,
    getOrder,
    deleteOrder
}