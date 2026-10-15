import db from '../config/db.js';

export interface BingoNumberRecord {
    id: number;
    number: number;
    called_at: string;
}

export const BingoService = {
    /**
     * これまでに呼ばれた番号の一覧を取得する
     */
    getCalledNumbers(): BingoNumberRecord[] {
        const stmt = db.prepare(
            'SELECT id, number, called_at FROM bingo_numbers ORDER BY called_at ASC',
        );
        return stmt.all() as BingoNumberRecord[];
    },

    /**
     * 新しい番号を呼ぶ（登録する）
     */
    callNumber(number: number): BingoNumberRecord {
        const insertStmt = db.prepare(
            'INSERT OR IGNORE INTO bingo_numbers (number) VALUES (?)',
        );
        insertStmt.run(number);

        const selectStmt = db.prepare(
            'SELECT id, number, called_at FROM bingo_numbers WHERE number = ?',
        );
        return selectStmt.get(number) as BingoNumberRecord;
    },

    /**
     * 指定した番号を削除（取り消し）する
     */
    deleteNumber(number: number): void {
        const stmt = db.prepare('DELETE FROM bingo_numbers WHERE number = ?');
        stmt.run(number);
    },
};
