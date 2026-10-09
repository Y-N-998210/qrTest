import { Request, Response } from 'express';
import { StampService } from '../services/stampService.js';

/**
 * リクエストヘッダーから 'x-user-id' を抽出し、整形・バリデーションを行うヘルパー関数
 */
const extractUserId = (req: Request): string | null => {
    const userId = req.headers['x-user-id'];
    // 未設定、文字列以外、または空文字（スペースのみ含む）の場合は null を返す
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return null;
    }
    return userId.trim(); // 前後の不要な空白を削除して返す
};

/**
 * 獲得済みスタンプ一覧を取得する API ハンドラー
 * GET /api/events/unlocked
 */
export const getUnlocked = (req: Request, res: Response) => {
    const userId = extractUserId(req);
    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    // サービス層から対象ユーザーの獲得済みスタンプID一覧を取得
    const unlockedIds = StampService.getUnlockedStamps(userId);
    return res.json(unlockedIds);
};

/**
 * スタンプを獲得（登録）する API ハンドラー
 * POST /api/events/unlock
 */
export const unlock = (req: Request, res: Response) => {
    const userId = extractUserId(req);
    const { eventId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    // eventId のバリデーション（必須・文字列チェック・正規表現による文字種チェック）
    if (
        !eventId ||
        typeof eventId !== 'string' ||
        !/^[a-zA-Z0-9_-]+$/.test(eventId)
    ) {
        return res.status(400).json({
            error: 'eventIdの形式が不正です(半角英数字、ハイフン、アンダースコアのみ使用可能）',
        });
    }

    // スタンプ獲得処理を実行し、新規獲得かどうか（isNew）を受け取る
    const { isNew } = StampService.unlockStamp(userId, eventId);
    return res.json({ success: true, isNew });
};

/**
 * 全ユーザーの合計獲得ポイント（スタンプ総数など）を取得する API ハンドラー
 * GET /api/events/total-points
 */
export const getTotalPoints = (_req: Request, res: Response) => {
    // リクエスト情報を使用しないため引数名を `_req` としています
    const totalPoints = StampService.getTotalPoints();
    return res.json({ totalPoints });
};

/**
 * 対象ユーザーの獲得済みスタンプをすべてリセット（一括削除）する API ハンドラー
 * DELETE /api/events/unlocked
 */
export const resetUserStamps = (req: Request, res: Response) => {
    const userId = extractUserId(req);
    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    // 該当ユーザーの全スタンプレコードを削除
    StampService.resetUserStamps(userId);
    return res.json({ success: true });
};

/**
 * 対象ユーザーの特定のスタンプを1つだけ削除する API ハンドラー
 * DELETE /api/events/unlocked/:id
 */
export const deleteUserStamp = (req: Request, res: Response) => {
    const userId = extractUserId(req);
    // URLパラメータ（:id）から対象のスタンプIDを取得
    const { id } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    // URL パラメータ（id）の型安全バリデーション
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: '無効なeventIdです' });
    }

    // サービス層を呼び出し、DBから該当ユーザーの指定されたスタンプを削除
    StampService.deleteUserStamp(userId, id);
    // 204 No Content（成功・レスポンスボディなし）を返す
    return res.status(204).send();
};

/**
 * 全イベント（スポット）マスター一覧を取得する API ハンドラー
 * GET /api/events
 */
export const getAllEvents = (_req: Request, res: Response) => {
    const events = StampService.getAllEvents();
    return res.json(events);
};