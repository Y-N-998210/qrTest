import { http, HttpResponse } from 'msw';
import type { EventItem } from '../features/stamp/types/event';

// テスト用データ
const mockEvents: EventItem[] = [
    {
        id: 'spot-01',
        title: 'オープニングステージ',
        organization: '帝祭実行委員会',
        schedule: '10:00 - 11:00',
        description: '学園祭の始まりを告げるオープニングステージ！',
        category: 'ステージ',
    },
    {
        id: 'spot-02',
        title: '自作ゲーム体験コーナー',
        organization: '情報処理研究会',
        schedule: '10:00 - 16:30',
        description: '部員が制作したC++やPythonのゲームが遊べます。',
        category: '展示',
    },
];

// メモリ上で解放済みIDを保持（リセットや解放動作のテスト用）
let unlockedIds: string[] = [];

// 通信ルール
export const handlers = [
    // 全イベント取得
    http.get('/api/events', () => {
        return HttpResponse.json(mockEvents);
    }),

    // 獲得済みイベントID一覧取得
    http.get('/api/events/unlocked', () => {
        return HttpResponse.json(unlockedIds);
    }),

    // イベント新規解放
    http.post('/api/events/unlock', async ({ request }) => {
        const body = (await request.json()) as { eventId: string };
        const isNew = !unlockedIds.includes(body.eventId);
        if (isNew) {
            unlockedIds.push(body.eventId);
        }
        return HttpResponse.json({ success: true, isNew });
    }),

    // 全リセット
    http.delete('/api/events/unlocked', () => {
        unlockedIds = [];
        return new HttpResponse(null, { status: 204 });
    }),
];