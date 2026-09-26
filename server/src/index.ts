import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 設定（開発環境からのリクエストのみ許可）
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    }),
);

app.use(express.json());

// ヘッダーからの user_id 抽出 & 簡易バリデーション
const getUserId = (req: express.Request): string | null => {
    const userId = req.headers['x-user-id'];
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return null;
    }
    return userId.trim();
};

// 1. 獲得済みスタンプ一覧取得 (GET /api/events/unlocked)
app.get('/api/events/unlocked', (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    // SQLiteに送るSQLクエリを準備
    // ※ 「?」はプレースホルダーと呼ばれ、SQLインジェクション対策（セキュリティ対策）のために使用
    const stmt = db.prepare(
        'SELECT event_id FROM user_stamps WHERE user_id = ?',
    );

    // クエリを実行し、該当する全データを配列として取得（? 部分に userId を流し込む）
    const rows = stmt.all(userId) as { event_id: string }[];

    // データベースからの取得結果（オブジェクトの配列）を、ID文字列だけの配列に変換
    // 変換前: [{ event_id: 'stamp-1' }, { event_id: 'stamp-2' }]
    // 変換後: ['stamp-1', 'stamp-2']
    const unlockedIds = rows.map((row) => row.event_id);

    // クライアントに返却
    res.json(unlockedIds);
});

// 2. スタンプの新規獲得 (POST /api/events/unlock)
app.post('/api/events/unlock', (req, res) => {
    const userId = getUserId(req);
    const { eventId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    // eventId のバリデーション（英数字とハイフンのみ許可）
    if (
        !eventId ||
        typeof eventId !== 'string' ||
        !/^[a-zA-Z0-9_-]+$/.test(eventId)
    ) {
        return res.status(400).json({ error: 'eventIdの形式が不正です(半角英数字、ハイフン、アンダースコアのみ使用可能）' });
    }

    // 重複チェック
    const checkStmt = db.prepare(
        'SELECT 1 FROM user_stamps WHERE user_id = ? AND event_id = ?',
    );
    const exists = checkStmt.get(userId, eventId);

    if (exists) {
        return res.json({ success: true, isNew: false });
    }

    // 新規レコード挿入
    const insertStmt = db.prepare(
        'INSERT INTO user_stamps (user_id, event_id) VALUES (?, ?)',
    );
    insertStmt.run(userId, eventId);

    res.json({ success: true, isNew: true });
});

// 3. 全体達成率（累計スタンプ数）取得 (GET /api/stats/total-points)
app.get('/api/stats/total-points', (_req, res) => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM user_stamps');
    const result = stmt.get() as { count: number };

    res.json({ totalPoints: result.count });
});

// 4. ユーザーの獲得スタンプ全リセット (DELETE /api/events/unlocked)
app.delete('/api/events/unlocked', (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    const stmt = db.prepare('DELETE FROM user_stamps WHERE user_id = ?');
    // クエリを実行し、該当するデータをデータベースから実際に削除
    stmt.run(userId);

    // 200 OK で { "success": true } を返す
    res.json({ success: true});
});

// 4-2. 特定スタンプの削除 (DELETE /api/events/unlocked/:id)
app.delete('/api/events/unlocked/:id', (req, res) => {
    const userId = getUserId(req);
    // URLパラメータ（/api/events/unlocked/123 の "123" の部分）を取得し、eventId という変数名にリネーム
    const { id: eventId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'x-user-idヘッダーが必要です' });
    }

    const stmt = db.prepare(
        'DELETE FROM user_stamps WHERE user_id = ? AND event_id = ?',
    );
    // SQL実行
    stmt.run(userId, eventId);

    // 成功メッセージなし（204 No Content）でレスポンスを返す
    res.json({ success: true });
});

// 指定したポート番号（PORT）でサーバーの起動（リクエストの待ち受け）を開始
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
