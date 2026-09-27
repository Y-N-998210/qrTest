# [PoC] Express + SQLite フルスタック構成・永続化仕様書

> **概要**
> フロントエンド（React）とバックエンド（Express + SQLite）を疎通させ、実機（スマホ）のカメラでのQRスキャンからデータ永続化・図鑑画面への反映までを確認済みです。

---

## 1. 動作概要

ユーザー識別からデータ保存、UI同期までのデータフローおよびエンドポイント定義です。

### 1.1 動作フロー
* **認証・識別:** フロントエンド（`localStorage`）で生成した `x-user-id` (UUID) をHTTPヘッダーに付与し、ユーザーごとの進行状況を識別。
* **QRスキャン＆データ保存:** 
  1. スマホカメラ等でQRコード（`festival-stamp:spot-01` 等）を検知。
  2. `POST /api/events/unlock` へ送信し、重複チェックを経て SQLite の `user_stamps` テーブルへ保存。
* **図鑑同期:** 
  1. `GET /api/events` で全イベントのマスターデータを取得。
  2. `GET /api/events/unlocked` でユーザーの獲得済みID一覧を取得。
  3. 両者を照合し、獲得済みスポットを解放状態としてUI描画。

### 1.2 フロー図
```text
[ユーザー操作]
  │ 1. アプリ初回起動
  ▼
[フロントエンド: `src/features/stamp`]
  │ 2. localStorage から UUID を取得（非存在時は自動生成）
  │ 3. `x-user-id` ヘッダーを付与してバックエンドへリクエスト
  ▼
[バックエンド: `server/src/`]
  │ 4. Express ルーティング (`routes/`) ➔ コントローラー (`controllers/`)
  │ 5. ビジネスロジック・DB操作 (`services/`, `config/db.ts`)
  ▼
[Database: SQLite (`db.sqlite`)]
  └─ 6. WALモードによる高速書き込み & 重複チェックを経てデータ保存
```

### 1.3 エンドポイント一覧

#### ① 全イベント（スタンプ）マスター一覧の取得
* **Endpoint:** `GET /api/events`
* **Headers:** `x-user-id: <UUID>`
* **Response (200 OK):**
    ```json
    [
      {
        "id": "spot-01",
        "title": "メインステージ",
        "description": "中央広場のメインステージ前スポット"
      }
    ]
    ```

#### ② 獲得済みスタンプID一覧の取得
* **Endpoint:** `GET /api/events/unlocked`
* **Headers:** `x-user-id: <UUID>`
* **Response (200 OK):**
    ```json
    [
      "spot-01",
      "spot-03"
    ]
    ```

#### ③ スタンプ解放（スキャン実行）
* **Endpoint:** `POST /api/events/unlock`
* **Headers:** 
    * `Content-Type: application/json`
    * `x-user-id: <UUID>`
* **Request Body:**
    ```json
    {
      "eventId": "spot-01"
    }
    ```
* **Response (200 OK / 成功時):**
    ```json
    {
      "success": true,
      "isNew": true // 獲得済みの場合、false
    }
    ```
* **Response (400 Bad Request / バリデーションエラー時):**
    ```json
    {
      "error": "eventIdの形式が不正です(半角英数字、ハイフン、アンダースコアのみ使用可能）"
    }
    ```

#### ④ 全ユーザーの累計獲得ポイント（スタンプ総数）の取得
* **Endpoint:** `GET /api/events/total-points`
* **Headers:** なし
* **Response (200 OK):**
    ```json
    {
      "totalPoints": 42
    }
    ```
  *※ **補足:** バックエンド側にAPIとして実装済みですが、現在のフロントエンドUI（`ApiEventRepository.ts` 等）からは未呼び出しです。全体統計カウンター画面などの将来拡張用として保持されています。*

#### ⑤ ユーザー獲得スタンプの一括リセット（デバッグ・テスト用）
* **Endpoint:** `DELETE /api/events/unlocked`
* **Headers:** `x-user-id: <UUID>`
* **Response (200 OK):**
    ```json
    {
      "success": true
    }
    ```

#### ⑥ 特定スタンプの個別削除（デバッグ・テスト用）
* **Endpoint:** `DELETE /api/events/unlocked/:id`
* **Headers:** `x-user-id: <UUID>`
* **Response (204 No Content):**  
  *※ ボディなし（空レスポンス）*  
  *※ `id`には削除対象の`eventId`(例:`spot-1`)を指定*

---

## 2. ディレクトリ構造 & レイヤードアーキテクチャ

本プロジェクトは、フロントエンドとバックエンドが同一リポジトリ内に配置された Monorepo（モノレポ）類似構成 となっています。バックエンドコードは本番用コードベースに即時移植できるよう、明確な層状アーキテクチャ（MVCパターン）を採用しています

### 2.1 関連ディレクトリ構成
```text
C:.
├─ docs/                        # 本ドキュメント配置場所
├─ public/                      # 静的アセット
├─ server/                      # サーバーサイド（Express + SQLite）
│  ├─ dist/                     # TypeScriptビルド成果物
│  └─ src/
│      ├─ config/
│      │  └─ db.ts              # SQLite接続・テーブル初期化・WALモード設定
│      ├─ controllers/
│      │  └─ stampController.ts # HTTPリクエスト/レスポンス制御・バリデーション
│      ├─ routes/
│      │  └─ apiRoutes.ts       # エンドポイント定義
│      ├─ services/
│      │  └─ stampService.ts    # DBクエリ・ビジネスロジック処理
│      └─ types/                # サーバー側TypeScript型定義
└─ src/                         # フロントエンド（React / Vite）
   ├─ features/
   │  └─ stamp/                 # スタンプ機能機能別モジュール
   │      ├─ components/        # QRスキャナー・図鑑UIコンポーネント
   │      ├─ hooks/             # API通信・状態管理カスタムフック
   │      ├─ services/          # Fetch APIクライアント
   │      └─ types/             # 型定義
   ├─ mocks/                    # MSW (Mock Service Worker) ※本PoC時はオフに設定
   └─ utils/                    # 共通ユーティリティ (localStorage管理等)
```

### 2.2 役割分離（レイヤード設計）
```text
[ Client Layer (src/features/stamp) ]
  ↓  HTTP Fetch Request (Header: x-user-id)
[ Routing Layer (server/src/routes/apiRoutes.ts) ]
  ↓  URLルーティング & ミドルウェア実行
[ Controller Layer (server/src/controllers/stampController.ts) ]
  ↓  パラメータ検証 / レスポンスステータス整形 (200, 400, 500)
[ Service Layer (server/src/services/stampService.ts) ]
  ↓  ビジネスロジック (重複チェック・DBデータ加工)
[ Data Access / Config Layer (server/src/config/db.ts) ]
  ↓  SQLクエリ実行 (better-sqlite3)
[ Database (db.sqlite) ]
```
### 2.3 データベース設計(SQLite)
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
    PRIMARY KEY (user_id, event_id), -- 複合主キーにより同一ユーザーの重複保存を防止
    FOREIGN KEY (event_id) REFERENCES events(id)
);
```

---

## 3.セキュリティ上の課題と本番運用に向けた対策案

現状はローカル環境および機能検証（PoC）段階の仕様となっているため、本番運用に向けて以下の課題と対策案を認識・保持しています。

1. API直打ちによる全スタンプ不正解放リスク
    - 課題:  
    QRコードのデータ構造が festival-stamp:spot-01 などの固定文字列となっている。Curl や Postman、あるいはブラウザの DevTools から POST /api/events/unlock に対してリクエストを直接送信することで、現地に赴くことなく全スポットのスタンプを解放できてしまう。
    - 本番対策案:  
    QRコードに埋め込むデータに、時間経過で無効化される HMAC ハッシュ値やワンタイムトークンを含める（例: spot-01:1711234560:hash_value）。サーバー側で生成時刻およびハッシュの検証を行い、有効期限（例: 30秒以内）を過ぎたリクエストを拒否する。
2. x-user-id の成りすまし・改ざんリスク
    - 課題:  
    クライアント側の localStorage で任意生成された UUID を信頼してデータ処理を行っている。リクエストヘッダーの x-user-id を他人の UUID に書き換えて送信することで、第三者のスタンプ解放状況の改ざんや参照が可能。
    - 本番対策案:  
    サーバー署名付きの JWT（JSON Web Token）または Cookie セッションによる身元証明を導入する。ログイン（あるいは匿名セッション発行）時に暗号化トークンを発行し、以降のリクエストで身元を厳密に証明する。
3. DoS / 連打攻撃リスク
    - 課題:  
    リクエストの頻度制限（Rate Limiting）が設定されていないため、スクリプト等による連打攻撃によってデータベース（SQLite）のロックやサーバーリソースの枯渇が発生する可能性がある。
    - 本番対策案:  
    express-rate-limit ミドルウェアを導入し、同一 IP または同一ユーザーIDからの単位時間あたりのアクセス数を上限設定（例: 1分間に30リクエストまで）する。

---

## 4.起動手順
### 1. 依存関係のインストール
```bash
npm install        # フロントエンド依存関係 (root)
cd server && npm i # サーバー依存関係
```
### 2.起動コマンド
- バックエンド起動: `cd server && npm run dev (Port3001で常駐)`
- フロントエンド起動: ルートディレクトリで`npm run dev`