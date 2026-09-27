import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

const app = express();  // Expressアプリケーションのインスタンス作成
const PORT = process.env.PORT || 3001;  // ポート番号設定

// CORSミドルウェアの設定（フロントエンドからのクロスドメインリクエストを許可）
app.use(
    cors({
        // 開発サーバー(ポート5173)からのアクセスのみを許可
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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
