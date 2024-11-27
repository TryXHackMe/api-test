import { Request, Response } from 'express';
import prisma from '../prisma/prismaClient';
import bcrypt from 'bcrypt';
import response from '../utils/response'
import { User } from '../interfaces/user.interface';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role }:User  = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    response(res, newUser, 'Data berhasil di tambahkan', 200);
  } catch (error) {
    console.error(error);
    response(res,'Internal Server Error', 'Terjadi kesahalan pada sisi server', 500)
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    response(res, users, 'Berhasil mengambil semua data', 200)
  } catch (error) {
    console.error(error);
    response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if(!id) return response(res, 'Bad Request', 'tambahkan nomer id', 400)
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if(!user) return response(res, 'Not Found', 'User tidak ditemukan', 404);
      response(res, user, 'Berhasil mendapatkan user', 200);
    } catch(error) {
      console.error(error);
      response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}

export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, password } = req.body;
  if(!name || !email || !password || !id) return response(res, 'Bad Request', 'id name email dan password tidak boleh kosong', 400);
  try {
    const old = await prisma.user.findUnique({
      where: { id : id}
    });
    if(!old) return response(res, 'Not Found', 'User tidak ditemukan', 404)
    const hashedPass = await bcrypt.hash(password, 12);

    const newData = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        name,
        email,
        password: hashedPass
      }
    });

    const data = {
      oldData: old,
      newData: newData
    }
    response(res, data, 'Berhasil Ubah data', 200)
  } catch(error) {
    console.error(error);
    response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
  }
  
}

export const deleteUser = async(req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  if(!id) return response(res, 'Bad Request', 'Masukan path id', 400)
    try {
      const cek = await prisma.user.findUnique({
        where: { id : id}
      })
      if(!cek) return response(res, 'Not Found', 'id yang kamu cari tidak ditemukan', 404)
      
      const del = await prisma.user.delete({
        where: { id : id}
      })
      response(res, del, 'Berhasil Menghapus data', 201)
    } catch(error) {
      console.error(error)
      return response(res, 'Internal Server Error', 'Terjadi kesalahan pada server', 500)
    }
}
