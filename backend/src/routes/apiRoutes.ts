import { Router } from 'express';
import {
    getUnlocked,
    unlock,
    getTotalPoints,
    resetUserStamps,
    deleteUserStamp,
    getAllEvents,
} from '../controllers/stampController.js';
import { getCalledNumbers, callNumber, deleteNumber } from '../controllers/bingoController.js';
import { registerUser } from '../controllers/userController.js';

const router = Router();

// エンドポイントをコントローラーにマッピング
router.get('/events', getAllEvents);
router.get('/events/unlocked', getUnlocked);
router.post('/events/unlock', unlock);
router.get('/stats/total-points', getTotalPoints);
router.delete('/events/unlocked', resetUserStamps);
router.delete('/events/unlocked/:id', deleteUserStamp);
// ビンゴ関連のエンドポイント
router.get('/bingo/numbers', getCalledNumbers);
router.post('/bingo/numbers', callNumber);
router.delete('/bingo/numbers/:number', deleteNumber);
// ユーザーID生成のエンドポイント
router.post('/users/register', registerUser);

export default router;
