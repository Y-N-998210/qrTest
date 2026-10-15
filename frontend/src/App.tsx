import { useState } from 'react';
import { JoyTopPage } from './features/joy/JoyTopPage';
import { BingoPage } from './features/bingo/BingoPage';
import { BingoAdminPage } from './features/bingo/BingoAdminPage';
import StampPage from './features/stamp/StampPage';
import { StampAdminPage } from './features/stamp/StampAdminPage'; // 🎯 追加

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('joy-top');

  const handleNavigate = (page: string) => {
    console.log(`Navigate requested to: ${page}`);

    if (page === 'scan') {
      setCurrentPage('scan');
    } else if (page === 'bingo') {
      setCurrentPage('bingo');
    } else if (page === 'bingo-admin') {
      setCurrentPage('bingo-admin');
    } else if (page === 'stamp-admin') {
      setCurrentPage('stamp-admin'); // 🎯 追加
    } else if (page === 'joy-top') {
      setCurrentPage('joy-top');
    } else if (page === 'home') {
      alert('学園祭メインHPへの遷移処理（統合後に接続）');
    } else {
      alert(`「${page}」画面は現在開発中です！`);
    }
  };

  return (
    <div className="app-container">
      {currentPage === 'joy-top' && (
        <div>
          {/* 運営画面へのアクセスのしやすさのためにボタンを置いておく例 */}
          <div className="bg-gray-100 p-2 text-right text-xs flex justify-end gap-3">
            <button
              onClick={() => setCurrentPage('stamp-admin')}
              className="text-amber-600 hover:underline font-bold px-2"
            >
              ⚙️ スタンプ運営管理へ
            </button>
            <button
              onClick={() => setCurrentPage('bingo-admin')}
              className="text-indigo-600 hover:underline font-bold px-2"
            >
              ⚙️ ビンゴ管理へ
            </button>
          </div>
          <JoyTopPage onNavigate={handleNavigate} />
        </div>
      )}

      {currentPage === 'scan' && (
        <div>
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

      {/* スタンプ運営管理画面 */}
      {currentPage === 'stamp-admin' && (
        <StampAdminPage onNavigate={handleNavigate} />
      )}

      {/* ビンゴ表示画面 */}
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

      {/* ビンゴ運営管理画面 */}
      {currentPage === 'bingo-admin' && (
        <div>
          <div className="bg-slate-900 text-white text-xs p-2 text-center flex justify-between items-center px-4">
            <span className="font-bold text-yellow-400">⚙️ ビンゴ運営管理</span>
            <button
              onClick={() => setCurrentPage('joy-top')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition"
            >
              ＜ お楽しみ企画TOPへ戻る
            </button>
          </div>
          <BingoAdminPage />
        </div>
      )}
    </div>
  );
}
