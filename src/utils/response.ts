import { Response } from 'express';

const response = (res: Response, data:any, message:string, code:number) => {
    res.status(code).json({
        status: code,
        data,
        message,
    });
};

export default response;