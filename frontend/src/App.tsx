import { useState } from 'react';
import { JoyTopPage } from './features/joy/JoyTopPage';
import { BingoPage } from './features/bingo/BingoPage';
import { BingoAdminPage } from './features/bingo/BingoAdminPage';
import StampPage from './features/stamp/StampPage';

export default function App() {
  // 現在表示している画面 ('joy-top' | 'scan' | 'bingo' | 'bingo-admin' | 他の企画画面)
  const [currentPage, setCurrentPage] = useState<string>('joy-top');

  // 画面遷移ハンドラー
  const handleNavigate = (page: string) => {
    console.log(`Navigate requested to: ${page}`);

    if (page === 'scan') {
      // QRコードリーダー画面へ
      setCurrentPage('scan');
    } else if (page === 'bingo') {
      setCurrentPage('bingo');
    } else if (page === 'bingo-admin') {
      setCurrentPage('bingo-admin');
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
      {currentPage === 'joy-top' && (
        <div>
          <JoyTopPage onNavigate={handleNavigate} />
        </div>
      )}

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

      {/* ビンゴ表示画面（来場者用） */}
      {currentPage === 'bingo' && (
        <div>
          <div className="bg-slate-800 text-white text-xs p-2 text-center flex justify-between items-center px-4">
            <span className="font-bold">🎯 ビンゴ番号表示</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage('bingo-admin')}
                className="bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition"
              >
                運営管理画面へ ＞
              </button>
              <button
                onClick={() => setCurrentPage('joy-top')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition"
              >
                ＜ お楽しみ企画TOPへ戻る
              </button>
            </div>
          </div>
          <BingoPage />
        </div>
      )}

      {/* ビンゴ運営管理画面（運営スタッフ用） */}
      {currentPage === 'bingo-admin' && (
        <div>
          <div className="bg-slate-900 text-white text-xs p-2 text-center flex justify-between items-center px-4">
            <span className="font-bold text-yellow-400">⚙️ ビンゴ運営管理</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage('bingo')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition"
              >
                表示画面を確認する ↗
              </button>
              <button
                onClick={() => setCurrentPage('joy-top')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition"
              >
                ＜ お楽しみ企画TOPへ戻る
              </button>
            </div>
          </div>
          <BingoAdminPage />
        </div>
      )}
    </div>
  );
}
