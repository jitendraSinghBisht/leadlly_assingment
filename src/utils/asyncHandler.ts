import { Request, Response, NextFunction } from 'express';

const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error: any) => next(error));
    };
};

export default asyncHandler