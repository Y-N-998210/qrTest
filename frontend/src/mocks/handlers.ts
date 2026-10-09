import { http, HttpResponse } from 'msw';
import type { EventItem } from '../features/stamp/types/event';

// テスト用データ（企画を3つ追加して計5件に変更）
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
    {
        id: 'spot-03',
        title: '本格手打ちそば屋台',
        organization: 'そば打ち同好会',
        schedule: '11:00 - 15:00',
        description: '毎朝手打ちしているこだわりのおいしいお蕎麦です！',
        category: '模擬店',
    },
    {
        id: 'spot-04',
        title: 'ロボットコンテスト実演展示',
        organization: 'ロボティクス部',
        schedule: '10:30 - 16:00',
        description: '大会出場ロボットの自律走行と障害物回避デモを行います。',
        category: '展示',
    },
    {
        id: 'spot-05',
        title: '軽音部スペシャルライブ',
        organization: '軽音楽部',
        schedule: '13:00 - 16:00',
        description:
            '野外ステージで人気のバンド曲を熱唱！熱いライブをお届けします。',
        category: 'ステージ',
    },
];

// メモリ上で user_id ごとの解放済みIDを保持
const userUnlockedMap: Record<string, string[]> = {};

// ヘッダーから user_id を取得するヘルパー関数
const getUserId = (request: Request): string => {
    return request.headers.get('x-user-id') || 'anonymous-default-user';
};

// 通信ルール
export const handlers = [
    // 全イベント取得
    http.get('/api/events', () => {
        return HttpResponse.json(mockEvents);
    }),

    // 獲得済みイベントID一覧取得
    http.get('/api/events/unlocked', ({ request }) => {
        const userId = getUserId(request);
        const unlockedIds = userUnlockedMap[userId] || [];
        return HttpResponse.json(unlockedIds);
    }),

    // イベント新規解放
    http.post('/api/events/unlock', async ({ request }) => {
        const userId = getUserId(request);
        const body = (await request.json()) as { eventId: string };

        if (!userUnlockedMap[userId]) {
            userUnlockedMap[userId] = [];
        }

        const isNew = !userUnlockedMap[userId].includes(body.eventId);
        if (isNew) {
            userUnlockedMap[userId].push(body.eventId);
        }

        return HttpResponse.json({ success: true, isNew });
    }),

    // 全ユーザーの獲得 pt 累計
    http.get('/api/stats/total-points', () => {
        const totalPoints = Object.values(userUnlockedMap).reduce(
            (acc, ids) => acc + ids.length,
            0,
        );
        return HttpResponse.json({ totalPoints });
    }),

    // 指定ユーザーのスタンプ全リセット
    http.delete('/api/events/unlocked', ({ request }) => {
        const userId = getUserId(request);
        userUnlockedMap[userId] = [];
        return new HttpResponse(null, { status: 204 });
    }),

    // 特定スタンプの削除
    http.delete('/api/events/unlocked/:id', ({ request, params }) => {
        const userId = getUserId(request);
        const eventId = params.id as string;

        if (userUnlockedMap[userId]) {
            userUnlockedMap[userId] = userUnlockedMap[userId].filter(
                (id) => id !== eventId,
            );
        }
        return new HttpResponse(null, { status: 204 });
    }),
];
