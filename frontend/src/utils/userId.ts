const STORAGE_KEY = 'festival_player_number';
const API_BASE = 'http://localhost:3001/api';

/**
 * localStorageが利用可能かチェック
 */
export const isLocalStorageAvailable = (): boolean => {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
};

/**
 * プレイヤーの連番IDを取得またはサーバーに新規登録して取得
 */
export const getOrCreatePlayerNumber = async (): Promise<number> => {
    // ローカルストレージにIDがあればそれを返す
    if (isLocalStorageAvailable()) {
        const savedId = localStorage.getItem(STORAGE_KEY);
        if (savedId) {
            const num = parseInt(savedId, 10);
            if (!isNaN(num)) return num;
        }
    }

    // なければバックエンドの登録APIを叩いて新規に連番を発行してもらう
    try {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            throw new Error('Failed to register user on server');
        }

        const data = await res.json();
        const playerId = data.playerId; // サーバー側で発行された連番 (1, 2, 3...)

        if (playerId && isLocalStorageAvailable()) {
            localStorage.setItem(STORAGE_KEY, playerId.toString());
        }

        return playerId ?? 1;
    } catch (error) {
        console.warn('サーバーとの通信に失敗しました。一時的なIDを使用します。', error);
        return 1;
    }
};