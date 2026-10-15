import { Request, Response } from 'express';
import { UserService } from '../services/userService.js';

export const registerUser = (_req: Request, res: Response) => {
    try {
        const playerId = UserService.registerNewUser();
        return res.json({ playerId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to register user' });
    }
};