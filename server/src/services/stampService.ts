import db from '../config/db.js';

/**
 * スタンプに関するデータベース操作（CRUD）をまとめたサービスオブジェクト
 */
export const StampService = {
    /**
     * 指定したユーザーの獲得済みスタンプID一覧を取得する
     * @param userId ユーザーID
     * @returns 獲得済みスタンプIDの配列（例: ['stamp_1', 'stamp_2']）
     */
    getUnlockedStamps(userId: string): string[] {
        const stmt = db.prepare(
            'SELECT event_id FROM user_stamps WHERE user_id = ?',
        );
        const rows = stmt.all(userId) as { event_id: string }[];
        // オブジェクトの配列 [{ event_id: 'a' }, { event_id: 'b' }] から文字列だけの配列 ['a', 'b'] に変換（map処理）して返却
        return rows.map((row) => row.event_id);
    },

    /**
     * スタンプを獲得（登録）する（重複チェック付き）
     * @param userId ユーザーID
     * @param eventId スタンプID
     * @returns 新規獲得かどうかを表すオブジェクト { isNew: boolean }
     */
    unlockStamp(userId: string, eventId: string): { isNew: boolean } {
        // 重複チェック
        const checkStmt = db.prepare(
            'SELECT 1 FROM user_stamps WHERE user_id = ? AND event_id = ?',
        );
        // ヒットした最初の1件(なければundefined)を取得
        const exists = checkStmt.get(userId, eventId);

        // 獲得済みの場合は処理終了
        if (exists) {
            return { isNew: false };
        }

        // 未獲得の場合は新規レコード挿入
        const insertStmt = db.prepare(
            'INSERT INTO user_stamps (user_id, event_id) VALUES (?, ?)',
        );
        insertStmt.run(userId, eventId);
        return { isNew: true };
    },

    /**
     * 全ユーザーが獲得したスタンプの総数を取得する
     * @returns 累計獲得数（数値）
     */
    getTotalPoints(): number {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM user_stamps');
        const result = stmt.get() as { count: number };
        return result.count;
    },

    /**
     * 指定したユーザーのスタンプ獲得情報を全件削除（リセット）する
     * @param userId ユーザーID
     */
    resetUserStamps(userId: string): void {
        const stmt = db.prepare('DELETE FROM user_stamps WHERE user_id = ?');
        stmt.run(userId);
    },

    /**
     * 指定したユーザーの特定のスタンプを1つだけ削除する
     * @param userId ユーザーID
     * @param eventId スタンプID
     */
    deleteUserStamp(userId: string, eventId: string): void {
        const stmt = db.prepare(
            'DELETE FROM user_stamps WHERE user_id = ? AND event_id = ?',
        );
        stmt.run(userId, eventId);
    },

    /**
     * 全イベントマスターデータの取得
     * @returns 全イベント情報の配列
     */
    getAllEvents(): { id: string; title: string; description: string }[] {
        const stmt = db.prepare('SELECT id, title, description FROM events');
        return stmt.all() as {
            id: string;
            title: string;
            description: string;
        }[];
    },
};
