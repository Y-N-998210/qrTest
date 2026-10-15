import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 環境で __dirname を再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データベースファイルの作成 / 接続
const dbPath = path.join(__dirname, '../../data/db.sqlite');
const db = new Database(dbPath);

// WALモードの有効化（パフォーマンス向上と同時実行エラー防止）
db.pragma('journal_mode = WAL');

// テーブルの初期化
db.exec(`
    CREATE TABLE IF NOT EXISTS user_stamps (
        user_id TEXT NOT NULL,
        event_id TEXT NOT NULL,
        unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bingo_numbers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number INTEGER NOT NULL UNIQUE,
            called_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
`);

// 初回起動時の初期データ設定(マスターデータ)（存在しない場合のみ挿入）
const initEvents = [
    {
        id: 'spot-01',
        title: '吹奏楽部 体育館ライブ',
        description: '迫力ある演奏を楽しめる定期演奏会です。',
    },
    {
        id: 'spot-02',
        title: '美術部 ワークショップ',
        description: 'オリジナルキーホルダーが作れる体験型展示。',
    },
    {
        id: 'spot-03',
        title: '軽音部 野外ステージ',
        description: 'バンド演奏で盛り上がる特設ライブ会場。',
    },
    {
        id: 'spot-04',
        title: '茶道部 お茶会会場',
        description: '和室で本格的な抹茶と和菓子を味わえます。',
    },
    {
        id: 'spot-05',
        title: '本部 案内所・救護室',
        description: 'パンフレット配布や落とし物の問い合わせ窓口です。',
    },
];

// INSERT OR IGNORE: 既に同じ id が存在する場合は追加をスキップするSQL（重複エラー防止）
const insertEvent = db.prepare(
    'INSERT OR IGNORE INTO events (id, title, description) VALUES (?, ?, ?)',
);

// db.transaction: 複数の書き込みを「1つのトランザクション」にまとめる処理
// 理由: 1件ずつ個別に書き込むよりも実行速度が格段に早くなり、途中で落ちた場合の一貫性も保たれる
const insertMany = db.transaction((events) => {
    for (const event of events) {
        insertEvent.run(event.id, event.title, event.description);
    }
});

// 初期データ配列をトランザクション関数に渡して一括実行
insertMany(initEvents);

export default db;
