import { Request, Response } from "express";
import prisma from '../prisma/prismaClient';
import response from '../utils/response';

export const createProduct = async(req: Request, res: Response) => {
     try {
        const newData = prisma.product.create({
            data: {
                name, 
            }
        })
     }
}