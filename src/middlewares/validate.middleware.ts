import { Request, Response, NextFunction } from 'express'
import response from '../utils/response';

export const userValidate = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    if(!name || !email || !password || !role) {
        return response(res, 'Bad Request', 'field name email dan password tidak boleh kosong', 401);
    }

    if(typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return response(res, 'Bad Request', 'field name email dan password harus string', 400)
    }

    next();
}

export const userUpdateValidate = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const id = parseInt(req.params.id);

    if(!name || !email || !password || !id) {
        return response(res, 'Bad Request', 'field name email password harus di isi dan juga masukan path id', 401);
    }

    if(typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return response(res, 'Bad Request', 'field name email dan password harus berupa string', 400)
    }
    next();
}

export const loginValidate = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return response(res, 'Bad Request', 'field email dan password harus diisi', 400)
    }

    if(typeof email !== 'string' || typeof password !== 'string') {
        return response(res, 'Bad Request', 'Field name dan password harus berupa string', 400)
    }
    next();
}

export const cProductValidate = (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, stock } = req.body;
    if(!name || !description || !price || !stock) {
        return response(res, 'Bad Request', 'Field name description price dan stock harus diisi', 400)
    }

    if(typeof name !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof stock !== 'number') {
        return response(res, 'Bad Request', 'Field name dan description harus berupa string; dan field stock dan price harus berupa number', 400)
    }

    next();
}

export const uProductValidate = (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, stock } = req.body;
    const id = parseInt(req.params.id);

    if(!name || !description || !price || !stock || !id) {
        return response(res, 'Bad Request', 'Field name description price dan stock harus diisi; dan harus ada path id', 400)
    }
    
    if(typeof name !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof stock !== 'number') {
        return response(res, 'Bad Request', 'Field name dan description harus berupa string; dan field stock dan price harus berupa number ', 400)
    }
}