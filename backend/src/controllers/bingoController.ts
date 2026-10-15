import { Request, Response } from 'express';
import { BingoService } from '../services/bingoService.js';

/**
 * 呼び出し済みのビンゴ番号一覧を取得する API
 * GET /api/bingo/numbers (例)
 */
export const getCalledNumbers = (_req: Request, res: Response) => {
    try {
        // サービス層から抽選済み番号一覧を取得
        const numbers = BingoService.getCalledNumbers();
        return res.json(numbers);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch bingo numbers' });
    }
};

/**
 * 新しいビンゴ番号を1つ追加（呼び出し）する API
 * POST /api/bingo/numbers (例)
 */
export const callNumber = (req: Request, res: Response) => {
    const { number } = req.body;
    const num = parseInt(number, 10);

    // リクエストパラメータのバリデーション (1〜75の範囲外または数値以外を判定)
    if (isNaN(num) || num < 1 || num > 100) {
        return res
            .status(400)
            .json({ error: '1から100までの有効な番号を指定してください' });
    }

    try {
        // サービス層で番号の登録処理を実行
        const savedRecord = BingoService.callNumber(num);
        return res.status(201).json(savedRecord);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to call number' });
    }
};

/**
 * 指定した番号を削除（取り消し）する API
 * DELETE /api/bingo/numbers/:number
 */
export const deleteNumber = (req: Request, res: Response) => {
    // URLのパスパラメータから番号を取得し数値に変換
    const num = parseInt(req.params.number, 10);

    // リクエストパラメータのバリデーション
    if (isNaN(num) || num < 1 || num > 75) {
        return res.status(400).json({ error: '無効な番号です' });
    }

    try {
        // サービス層で該当番号の削除処理を実行
        BingoService.deleteNumber(num);
        return res.status(204).send(); // 成功時はレスポンスボディなし（204 No Content）で返す
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete bingo number' });
    }
};
