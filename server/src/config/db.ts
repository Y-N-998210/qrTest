import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 環境で __dirname を再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データベースファイルの作成 / 接続
const dbPath = path.join(__dirname, '../../db.sqlite');
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
`);

export default db;
