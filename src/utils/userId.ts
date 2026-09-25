const STORAGE_KEY = 'festival_user_id';

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
 * UUIDを生成する
 * randomUUIDが使えない環境ではgetRandomValues()にフォールバック
 */
const generateUserId = (): string => {
    // crypto.randomUUID() が利用可能なら使用
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID();
    }

    // randomUUIDが使えない環境ではgetRandomValues()を使用
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.getRandomValues === 'function'
    ) {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);

        // UUID v4
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        return [
            [...bytes.slice(0, 4)],
            [...bytes.slice(4, 6)],
            [...bytes.slice(6, 8)],
            [...bytes.slice(8, 10)],
            [...bytes.slice(10, 16)],
        ]
            .map((group) =>
                group
                    .map((byte) => byte.toString(16).padStart(2, '0'))
                    .join(''),
            )
            .join('-');
    }

    // crypto自体が利用できない場合の最終フォールバック
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
        .toString(36)
        .slice(2)}`;
};

/**
 * ユーザーIDを取得または新規生成
 */
export const getOrCreateUserId = (): string => {
    // localStorageが使える場合
    if (isLocalStorageAvailable()) {
        const existingUserId = localStorage.getItem(STORAGE_KEY);

        if (existingUserId) {
            return existingUserId;
        }

        const userId = generateUserId();

        try {
            localStorage.setItem(STORAGE_KEY, userId);
        } catch (error) {
            console.warn('Failed to save userId to localStorage:', error);
        }

        return userId;
    }

    // localStorageが使えない場合
    console.warn(
        'localStorage is not available. A temporary user ID will be used.',
    );

    return generateUserId();
};

/**
 * 手動でIDを設定（データ復元・他端末ID引き継ぎ用）
 */
export const setManualUserId = (newUserId: string): void => {
    if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEY, newUserId);
    } else {
        console.warn(
            'Cannot save user ID because localStorage is not available.',
        );
    }
};
