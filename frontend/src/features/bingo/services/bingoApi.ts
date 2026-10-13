import type { BingoNumber } from "../types/bingo";

// バックエンドのAPIベースURL（のちに調整)
const API_BASE = 'http://localhost:3001/api';

export const bingoApi = {
    // 呼ばれた番号一覧取得
    async getCalledNumbers(): Promise<BingoNumber[]> {
        const res = await fetch(`${API_BASE}/bingo/numbers`);
        if (!res.ok) throw new Error('Failed to fetch bingo numbers');
        return res.json();
    },

    // 番号を追加する(テスト・運営用)
    async callNumber(number: number): Promise<BingoNumber> {
        const res = await fetch(`${API_BASE}/bingo/numbers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number }),
        });
        if (!res.ok) throw new Error('Failed to call number');
        return res.json();
    },
};
