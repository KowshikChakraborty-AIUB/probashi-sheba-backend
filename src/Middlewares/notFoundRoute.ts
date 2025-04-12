import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({ error: 'Route not found' });
};

export default notFound;