import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

const app = express(); // Expressアプリケーションのインスタンス作成
const PORT = process.env.PORT || 3001; // ポート番号設定

// CORSミドルウェアの設定（フロントエンドからのクロスドメインリクエストを許可）
app.use(
    cors({
        // =========================================================
        // 【本番環境用】特定のドメインのみを許可（セキュリティ重視）
        // =========================================================
        // origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://your-app.vercel.app'],

        // =========================================================
        // 【開発環境用】アクセス元を自動許可＆認証情報を手軽に許可（スマホ実機テスト対応）
        // =========================================================
        origin: true,
        credentials: true,
    }),
);

// JSON形式のリクエストボディ（req.body）を解析できるようにするミドルウェア
app.use(express.json());

// APIルーティングのセットアップ (/api プレフィックス)
// '/api' から始まるリクエスト（例: /api/events/unlocked など）を apiRoutes に割り振る
app.use('/api', apiRoutes);

// 指定ポートでWebサーバー起動
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
