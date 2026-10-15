import type { EventItem, IEventRepository } from '../types/event';
import { getOrCreatePlayerNumber } from '../../../utils/userId';

/**
 *
 * @todo // 環境変数（import.meta.env.VITE_USE_API など）を使って、自動で LocalStorage と ApiEventRepository を切り替える設計にする
 */

export class ApiEventRepository implements IEventRepository {
    private baseUrl: string;

    constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl;
    }

    /**
     * 共通リクエストヘッダーを取得 (x-user-id を自動付与)
     */
    private async getHeaders(): Promise<HeadersInit> {
        const playerId = await getOrCreatePlayerNumber();
        return {
            'Content-Type': 'application/json',
            'x-user-id': playerId.toString(),
        };
    }

    /**
     * 獲得済みイベントID一覧を取得 (GET /api/events/unlocked)
     */
    async getUnlockedEventIds(): Promise<string[]> {
        try {
            const response = await fetch(`${this.baseUrl}/events/unlocked`, {
                method: 'GET',
                headers: await this.getHeaders(),
            });
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch unlocked events: ${response.statusText}`,
                );
            }
            return await response.json();
        } catch (error) {
            console.error(
                'ApiEventRepository.getUnlockedEventIds Error:',
                error,
            );
            return [];
        }
    }

    /**
     * イベントを新規解放 (POST /api/events/unlock)
     */
    async unlockEvent(eventId: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/events/unlock`, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify({ eventId }),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to unlock event: ${response.statusText}`,
                );
            }

            const data = await response.json();
            // レスポンス例: { success: true, isNew: true }
            return data.isNew ?? true;
        } catch (error) {
            console.error('ApiEventRepository.unlockEvent Error:', error);
            return false;
        }
    }

    /**
     * DB(SQLite)から全イベント情報(マスターデータ)を取得 (GET /api/events)
     */
    async getAllEvents(): Promise<EventItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}/events`, {
                method: 'GET',
                headers: await this.getHeaders(),
            });
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch all events: ${response.statusText}`,
                );
            }
            return await response.json();
        } catch (error) {
            console.error('ApiEventRepository.getAllEvents Error:', error);
            return [];
        }
    }

    /**
     * スタンプ状態のリセット (DELETE /api/events/unlocked)
     */
    async resetEvents(): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/events/unlocked`, {
                method: 'DELETE',
                headers: await this.getHeaders(),
            });
        } catch (error) {
            console.error('ApiEventRepository.resetEvents Error:', error);
        }
    }

    /**
     * 特定スタンプの削除 (DELETE /api/events/unlocked/:id)
     */
    async removeEvent(eventId: string): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/events/unlocked/${eventId}`, {
                method: 'DELETE',
                headers: await this.getHeaders(),
            });
        } catch (error) {
            console.error('ApiEventRepository.removeEvent Error:', error);
        }
    }
}
