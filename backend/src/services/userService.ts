import db from '../config/db.js';

export const UserService = {
    /**
     * 新しいプレイヤーを登録し、自動発番された連番ID（1, 2, 3...）を返す
     * ※もしブラウザ側で前回のIDを保持している場合はそれを再利用することも可能ですが、
     *   まずはシンプルにアクセス毎（または初回登録時）に連番を発行する形にします。
     */
    registerNewUser(): number {
        const insertStmt = db.prepare('INSERT INTO app_users DEFAULT VALUES');
        const result = insertStmt.run();
        return Number(result.lastInsertRowid); // 発番されたID（1, 2, 3...）を返却
    },

    /**
     * 既存のIDが存在するか確認・取得する（ブラウザ側で保持しているIDを送ってもらう場合など）
     */
    getUserById(id: number): boolean {
        const stmt = db.prepare('SELECT 1 FROM app_users WHERE id = ?');
        return !!stmt.get(id);
    }
};