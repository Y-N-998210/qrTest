# 帝祭 2026 お楽しみ企画【Joy】& スタンプラリー Web App

学園祭（帝祭2026）の特設Webサイトに組み込む、お楽しみ企画ポータルおよびQRスタンプラリーのフロントエンドアプリケーション。

---

## 🛠 技術スタック

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Mock Service**: MSW (Mock Service Worker)
- **State/Architecture**: Repository Pattern (`IEventRepository`)
- **Database (Future)**: SQLite (バックエンドAPI経由で接続予定)

---

## 📁 ディレクトリ構造

```text
src/
├── features/
│   ├── joy/             # お楽しみ企画TOPページ関連コンポーネント (`JoyTopPage.tsx`)
│   └── stamp/           # QRスキャナー・イベント図鑑関連コンポーネント (`StampPage.tsx`)
├── data/
│   └── events.ts        # イベントマスタデータ (フロントエンド内保持)
├── repositories/        # データ層抽象化 (Repositoryパターン)
│   ├── IEventRepository.ts       # インターフェース定義
│   ├── ApiEventRepository.ts     # 本番API/SQLite接続用リポジトリ
│   └── LocalStorageEventRepository.ts # ローカル検証用リポジトリ
├── services/
│   └── stampService.ts  # スタンプビジネスロジック
└── App.tsx              # 画面ルーティング・エントリーポイント
```

---

## 🚀 開発サーバーの起動

```
# パッケージのインストール
npm install

# 開発サーバー起動 (MSWによるモックAPI有効)
npm run dev

# ビルド & 型チェック
npm run build
```

---

## 🔌 バックエンド（SQLite API）連携仕様

本アプリケーションは、軽量化および画面表示速度向上のため「イベントマスタデータはフロントエンド内（src/data/events.ts）に保持し、DB（SQLite）側ではユーザーごとのスタンプ獲得記録のみを管理する」アーキテクチャを採用。

バックエンドAPIは以下のエンドポイントを実装することで、フロントエンドと接続可能です。

### リクエスト共通仕様

通信時、フロントエンドから以下のカスタムヘッダーが付与される。

- x-user-id: クライアント識別用UUID（例: 550e8400-e29b-41d4-a716-446655440000）

## DBテーブル設計案（SQLite）

user_stamps テーブル
| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `user_id` | TEXT | ユーザー識別用UUID (複合主キー) |
| `event_id` | TEXT | 獲得したイベントID (例: `spot-01` ) (複合主キー) |
| `unlocked_at` | TEXT | 獲得日時 (ISO8601形式など) |

## 必須APIエンドポイント一覧
1. 獲得済みスタンプ一覧の取得
   - URL:`GET /api/events/unlocked`
   - Header:`x-user-id: <UUID>`
   - Response:`JSON Array`
     ```
     ["spot-01", "spot-03"]
     ```
2. スタンプの新規獲得（記録）
   - URL:`POST /api/events/unlock`
   - Header:`x-user-id: <UUID>`
   - Body:
     ```
     { "eventId": "spot-02" }
     ```
   - Response:
     ```
     { "success": true, "isNew": true }
     ```
3. 全体達成率の取得
   - URL:`GET /api/stats/total-points`
   - Response:
     ```
     { "totalPoints": 152 }
     ```
4. 獲得スタンプのリセット（デバッグ用）
   - URL:`DELETE /api/events/unlocked`
   - Header:`x-user-id: <UUID>`
   - Response:
     ```
     { "success": true }
     ```

---

## 🚢 学園祭メインHPへの統合手順
1.`src/feactures/joy`及び`src/features/stamp`ディレクトリを統合先プロジェクトへコピーする
2.統合先プロジェクトのルーター（react-router-dom 等）にて、以下のパスを割り当てます：
- `/joy` ➔ `<JoyTopPage />`
- `/joy/scan` ➔ `<StampPage />`
