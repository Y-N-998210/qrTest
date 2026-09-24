# 帝祭2026 お楽しみ企画【Joy】 & イベント図鑑 (QR Stamp Rally)

帝京大学の学園祭（帝祭2026）向けに開発された、モジュール型「お楽しみ企画（Joy）」ポータルおよびQRコードスタンプラリー機能のフロントエンドアプリケーションです。
本番の学園祭公式Webサイトへの統合およびバックエンド（SQLite）連携を見越したアーキテクチャで設計されています。

---

## 📑 主な機能

### 1. お楽しみ企画 TOP (`JoyTopPage.tsx`)
* **全体/自己貢献度ダッシュボード**: 参加者の合計ポイントメーターおよび個人の貢献度表示
* **動的キャラクター（うってぃ）**: 貢献度に応じた表情・台詞の変化
* **知識ランクシステム**: ポイント獲得に応じたランクアップ（学生 ➔ 優秀な学生 ➔ 先生 ➔ 教授 ➔ 妖精）
* **モーダルダイアログ**: 「ヒント（使い方）」および「ストーリー（うってぃを救え！）」の初回自動表示/手動表示
* **企画ショートカットナビゲーション**:
  * 📷 **イベント QR リーダー**（`StampPage` へ遷移）
  * 🗺️ 学校探検！！ / 🗳️ イベント人気投票！ / 🖼️ 思い出投稿 / 📅 マイスケジュール / 🎰 ビンゴ番号表示

### 2. QRスキャン & イベント図鑑 (`StampPage.tsx`)
* **リアルタイムQRスキャン**: `@yudiel/react-qr-scanner` を使用したカメラ読み取り
* **スタンプ判別ロジック**: `festival-stamp:{spotId}` 形式のQRコードを認識してスタンプ獲得
* **イベント図鑑**: 獲得済みスタンプの一覧・未獲得企画のマスク表示
* **デバッグ機能**: ローカル検証用の獲得状態リセット・ダミー解放機能

---

## 🛠️ 技術スタック

* **Frontend**: React 18 / TypeScript / Vite / Tailwind CSS
* **QR Reader**: `@yudiel/react-qr-scanner`
* **Mocking / API**: MSW (Mock Service Worker)
* **Architecture**: Repository Pattern (`IEventRepository`)
* **Database (Future Integration)**: SQLite

---

## 🏗️ ディレクトリ構造

```text
src/
├── features/
│   ├── joy/
│   │   └── JoyTopPage.tsx          # お楽しみ企画 TOP コンポーネント
│   └── stamp/
│       ├── StampPage.tsx           # QRスキャン & 図鑑画面
│       ├── services/
│       │   ├── IEventRepository.ts # データアクセス抽象化インターフェース
│       │   ├── ApiEventRepository.ts # Web API連携用リポジトリ
│       │   └── LocalStorageEventRepository.ts # ローカル検証用リポジトリ
│       └── types/
│           └── event.ts            # イベント・スタンプ型定義
├── mocks/
│   ├── handlers.ts                 # MSW モックAPIハンドラー
│   └── browser.ts                  # MSW ブラウザワーカー設定
├── App.tsx                         # 状態ベースの画面遷移（joy-top / scan）
└── main.tsx                        # アプリケーションエントリーポイント (MSW起動)
```

## 🚀 開発環境のセットアップ

インストール
```bash
npm install
```

開発サーバー起動
```bash
npm run dev
```

ビルド&型チェック
```bash
npm run build
```

## 🛢️ データベース・バックエンド（SQLite）との連携計画
現在は開発・検証用に MSW (Mock Service Worker) による擬似API通信を行っています。
バックエンド開発完了時には、リポジトリパターンを採用しているため フロントエンドの画面コードを書き換えることなく本番DB環境へ移行可能です。

### データフロー
```text
[ React (JoyTopPage / StampPage) ]
               │
               ▼
   [ ApiEventRepository.ts ]
               │
               │ HTTP (fetch)
               ▼
[ バックエンド API (Node.js / Python / C++ 等) ]
               │
               │ SQLite Driver
               ▼
     [ SQLite (db.sqlite) ]
```

### 想定されるSQLiteテーブル構成
```sql
-- ユーザー獲得スタンプ記録
CREATE TABLE user_stamps (
user_id TEXT NOT NULL,
event_id TEXT NOT NULL,
unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (user_id, event_id)
);
```

## 🔗 今後の本番Webサイトへの統合手順
本アプリケーションは、将来的に学園祭公式Webサイト（メインHP）へモジュールとして組み込むことを想定して設計されています。

1. 画面コンポーネントの提供:
   - src/features/joy および src/features/stamp ディレクトリを公式Webサイトのリポジトリへ移植します。
2. ルーティングの接続:
   - 現在 App.tsx 内で管理している State ベースの遷移（joy-top / scan）を、公式Webサイト側のルーター（React Router 等）のルーティング定義（/joy, /joy/scan など）へ置き換えます。
3. API接続先の変更:
  - ApiEventRepository.ts の baseUrl に本番APIサーバーのURLを設定し、main.tsx の MSW 起動処理を無効化（または本番ビルドから除外）することで本番DBへの接続へ切り替えます。
