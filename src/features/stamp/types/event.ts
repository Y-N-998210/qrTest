// 図鑑に登録されるイベント要素
export interface EventItem {
    id: string;             // QRコードから取得する識別子（例："spot-01")
    title: string;          // 企画名
    description: string;    // 説明
    organization?: string;   // 企画団体名(例: "軽音部"、"ロボラボ"など)
    schedule?: string;      // 企画の開催時間 (例: "10:00 - 16:00", "13:00 - 14:30" など)
    category?: string;      // カテゴリ(例："団体企画"、"飲食店"、"ステージ"、学科解放)
    imageUrl?: string;      // 図鑑用写真
    unlockedAt?: string;    // 獲得日時(ISO文字列)
}

// データアクセスを抽象化するインターフェース(DB/LocalStorage切り替え用)
export interface IEventRepository {
    getUnlockedEventIds(): Promise<string[]>;
    unlockEvent(eventId: string): Promise<boolean>; // 新規獲得ならtrue
    getAllEvents(): Promise<EventItem[]>;
}