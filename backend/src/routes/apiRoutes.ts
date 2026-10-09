import { Router } from 'express';
import {
    getUnlocked,
    unlock,
    getTotalPoints,
    resetUserStamps,
    deleteUserStamp,
    getAllEvents,
} from '../controllers/stampController.js';

const router = Router();

// エンドポイントをコントローラーにマッピング
router.get('/events', getAllEvents);
router.get('/events/unlocked', getUnlocked);
router.post('/events/unlock', unlock);
router.get('/stats/total-points', getTotalPoints);
router.delete('/events/unlocked', resetUserStamps);
router.delete('/events/unlocked/:id', deleteUserStamp);

export default router;
