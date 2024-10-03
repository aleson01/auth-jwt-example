import express, { Request, Response } from 'express';
import { authMiddleware } from './middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authMiddleware, (req: Request, res:Response) => {
    res.json({ message: 'Seu perfil', user: req.user });
});

export default router;