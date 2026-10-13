import { useState } from 'react';
import { JoyTopPage } from './features/joy/JoyTopPage';
import { BingoPage } from './features/bingo/BingoPage';
import StampPage from './features/stamp/StampPage';

export default function App() {
  // 現在表示している画面 ('joy-top' | 'scan' | 他の企画画面)
  const [currentPage, setCurrentPage] = useState<string>('joy-top');

  // 画面遷移ハンドラー
  const handleNavigate = (page: string) => {
    console.log(`Navigate requested to: ${page}`);

    if (page === 'scan') {
      // QRコードリーダー画面へ
      setCurrentPage('scan');
    } else if (page === 'bingo') {
      setCurrentPage('bingo');
    } else if (page === 'joy-top') {
      // お楽しみ企画（Joy）のトップページへ
      setCurrentPage('joy-top');
    } else if (page === 'home') {
      // 将来的に学園祭全体のメインHPに戻る処理（統合前の現在はアラート表示）
      alert('学園祭メインHPへの遷移処理（統合後に接続）');
    } else {
      // まだ作成していない各お楽しみ企画画面
      alert(`「${page}」画面は現在開発中です！`);
    }
  };

  return (
    <div className="app-container">
      {/* 1. お楽しみ企画（Joy） TOPページ */}
      {currentPage === 'joy-top' && <JoyTopPage onNavigate={handleNavigate} />}

      {/* 2. イベント QR リーダー & 図鑑ページ */}
      {currentPage === 'scan' && (
        <div>
          {/* お楽しみ企画TOPへ戻るための案内バー */}
          <div className="bg-slate-800 text-white text-xs p-2 text-center flex justify-between items-center px-4">
            <span className="font-bold">📷 イベント QR リーダー</span>
            <button
              onClick={() => setCurrentPage('joy-top')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition"
            >
              ＜ お楽しみ企画TOPへ戻る
            </button>
          </div>

          <StampPage />
        </div>
      )}

      {/* ビンゴ画面へ */}
      {currentPage === 'bingo' && (
        <div>
          <div className="bg-slate-800 text-white text-xs p-2 text-center flex justify-between items-center px-4">
            <span className="font-bold">🎯 ビンゴ番号表示</span>
            <button
              onClick={() => setCurrentPage('joy-top')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition"
            >
              ＜ お楽しみ企画TOPへ戻る
            </button>
          </div>
          <BingoPage />
        </div>
      )}
    </div>
  );
}
