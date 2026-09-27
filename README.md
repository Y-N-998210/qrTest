# 帝祭2026 お楽しみ企画【Joy】 & イベント図鑑 (QR Stamp Rally)

帝京大学の学園祭（帝祭2026）向けに開発された、モジュール型「お楽しみ企画（Joy）」ポータルおよびQRコードスタンプラリー機能のフルスタックWebアプリケーションです。
フロントエンド（React）とバックエンド（Express + SQLite）の疎通・永続化を実装済みです。

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
* **デバッグ機能**: ローカル検証用の獲得状態一括リセット・個別スタンプ削除機能

---

## 🛠️ 技術スタック

* **Frontend**: React 18 / TypeScript / Vite / Tailwind CSS
* **Backend**: Node.js / Express / TypeScript
* **Database**: SQLite3 (`better-sqlite3` / WALモード設定)
* **QR Reader**: `@yudiel/react-qr-scanner`
* **Architecture**: Repository Pattern (`IEventRepository`) / Layered Architecture (MVC)

---

## 🏗️ ディレクトリ構造

```text
.
├─ docs/                        # ドキュメント類 (仕様書等)
├─ public/                      # 静的アセット
├─ server/                      # バックエンド (Express + SQLite)
│  ├─ dist/                     # TypeScript ビルド成果物
│  └─ src/
│      ├─ config/               # DB接続設定 (db.ts)
│      ├─ controllers/          # コントローラー (stampController.ts)
│      ├─ routes/               # ルーティング (apiRoutes.ts)
│      ├─ services/             # ビジネスロジック・DB操作 (stampService.ts)
│      └─ types/                # サーバー側型定義
└─ src/                         # フロントエンド (React / Vite)
   ├─ features/
   │  ├─ joy/                   # Joy TOP モジュール
   │  └─ stamp/                 # スタンプラリー機能モジュール
   │      ├─ components/        # UI・スキャナーコンポーネント
   │      ├─ hooks/             # カスタムフック
   │      ├─ services/          # APIクライアント (ApiEventRepository.ts)
   │      └─ types/             # 型定義
   ├─ mocks/                    # MSW (Mock Service Worker) ※PoC時はオフ
   └─ utils/                    # 共通ユーティリティ (localStorage管理等)
```

## 🚀 開発環境のセットアップ

### 1.依存関係のインストール
```bash
npm install        # フロントエンド依存関係 (root)
cd server && npm i # サーバー依存関係
```

### 2.開発サーバの起動
バックエンドとフロントエンドを別ターミナルで起動
- バックエンド起動(Port3001)
  ```bash
  cd server && npm run dev
  ```

- フロントエンド起動
  ```bash
  npm run dev
  ```

### 3.ビルド
```bash
npm run build         # フロントエンドのビルド
cd server && npm run build # バックエンドのビルド
```

## 🛢️ バックエンド（Express + SQLite）構成
フロントエンドからのリクエストは ApiEventRepository.ts を通じて Express サーバーへ送信され、SQLite データベース（db.sqlite）へデータ保存・保持が行われます。

### データフロー
```text
[ Client (src/features/stamp) ]
  │  HTTP Fetch Request (Header: x-user-id)
  ▼
[ Express Router (server/src/routes/apiRoutes.ts) ]
  │  ルーティング処理
  ▼
[ Controller (server/src/controllers/stampController.ts) ]
  │  入力バリデーション
  ▼
[ Service (server/src/services/stampService.ts) ]
  │  ビジネスロジック・重複判定
  ▼
[ SQLite (db.sqlite) ]
```

### データベース設計(SQLite)
```sql
-- イベント（スタンプスポット）マスターテーブル
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT
);

-- ユーザー獲得実績テーブル
CREATE TABLE IF NOT EXISTS user_stamps (
    user_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);
```

### 実装済みエンドポイント一覧
1. **全イベントマスター一覧取得**: `GET /api/events`
2. **獲得済みスタンプID一覧取得**: `GET /api/events/unlocked` (Header: `x-user-id`)
3. **スタンプ解放（新規登録）**: `POST /api/events/unlock` (Header: `x-user-id`, Body: `{ "eventId": "spot-01" }`)
4. **累計獲得ポイント（全体統計）取得**: `GET /api/events/total-points`
5. **ユーザー獲得スタンプの一括リセット（デバッグ用）**: `DELETE /api/events/unlocked (Header: x-user-id)`
6. **特定スタンプの個別削除（デバッグ用）**: `DELETE /api/events/unlocked/:id `(Header: `x-user-id`)

## 🔗 今後の本番Webサイトへの統合手順
本アプリケーションは、将来的に学園祭公式Webサイト（メインHP）へモジュールとして組み込むことを想定して設計されています。

1. 画面コンポーネントの提供:
   - src/features/joy および src/features/stamp ディレクトリを公式Webサイトのリポジトリへ移植します。
2. ルーティングの接続:
   - 現在 App.tsx 内で管理している State ベースの遷移（joy-top / scan）を、公式Webサイト側のルーター（React Router 等）のルーティング定義（/joy, /joy/scan など）へ置き換えます。
3. API接続先の変更:
   - ApiEventRepository.ts 内の参照先を本番環境の API サーバー URL へ変更します。
