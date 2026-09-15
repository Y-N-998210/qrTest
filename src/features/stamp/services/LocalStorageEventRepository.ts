import { EventItem, IEventRepository } from '../types/event';

const STORAGE_KEY = 'teisai2026_unlocked_events';

export class LocalStorageEventRepository implements IEventRepository {
    async getUnlockedEventIds(): Promise<string[]> {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    async unlockEvent(eventId: string): Promise<boolean> {
        const current = await this.getUnlockedEventIds();
        if (current.includes(eventId)) {
            return false; // すでに獲得済み
        }
        const updated = [...current, eventId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true; // 新規獲得成功
    }

    /**
     * 
     * @todo // ※ DB連携に切り替える際は、ApiEventRepository.ts を作成し、fetch('/api/events') などで書き換える
     */

    async getAllEvents(): Promise<EventItem[]> {
        // 将来的にマスターデータ(JSONやDBのデータといったシステム全体の基本・基準となるデータ)から取得するか、
        // 固定定義(プログラムのコード内に直接書かれているデータ)を返す。
        return MASTER_EVENTS;
    }
}

// イベントマスターデータの例
export const MASTER_EVENTS: EventItem[] = [
    { id: 'spot-01', title: 'メインステージ', description: 'オープニングイベントが開催される場所です。' },
    { id: 'spot-02', title: '情報処理研究会 展示室', description: '部員が作成したゲーム体験コーナー。' },
    { id: 'spot-03', title: '模擬店エリア', description: '美味しい焼きそばやドリンクが楽しめます。' },
];

