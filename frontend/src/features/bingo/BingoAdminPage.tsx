import React, { useEffect, useState } from 'react';
import { bingoApi } from './services/bingoApi';
import type { BingoNumber } from './types/bingo';

export const BingoAdminPage: React.FC = () => {
  const [calledNumbers, setCalledNumbers] = useState<BingoNumber[]>([]);
  const [inputNum, setInputNum] = useState<string>('');

  // 呼ばれた番号一覧の取得
  const fetchNumbers = async () => {
    try {
      const data = await bingoApi.getCalledNumbers();
      setCalledNumbers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  // 番号を呼ぶ（追加する）
  const handleCallNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputNum, 10);
    if (isNaN(num) || num < 1 || num > 75) return;

    try {
      await bingoApi.callNumber(num);
      setInputNum('');
      await fetchNumbers();
    } catch (err) {
      console.error(err);
    }
  };

  // 指定した番号を削除（取り消し）する
  const handleDeleteNumber = async (num: number) => {
    if (
      !window.removeNaN &&
      !window.confirm(`番号 ${num} の記録を取り消しますか？`)
    )
      return;

    try {
      await bingoApi.deleteNumber(num);
      await fetchNumbers();
    } catch (err) {
      console.error(err);
    }
  };

  const calledNumSet = new Set(calledNumbers.map((item) => item.number));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        ビンゴ運営管理画面
      </h1>

      {/* 番号入力フォーム */}
      <form
        onSubmit={handleCallNumber}
        className="bg-white rounded-2xl p-6 shadow-md mb-8 flex gap-4 justify-center items-center"
      >
        <input
          type="number"
          min="1"
          max="100"
          value={inputNum}
          onChange={(e) => setInputNum(e.target.value)}
          placeholder="番号 (1〜100)"
          className="border border-gray-300 rounded-lg px-4 py-2 w-48 text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow"
        >
          番号を呼ぶ
        </button>
      </form>

      {/* 1〜100の番号一覧（クリックまたは状態管理で管理しやすいグリッド） */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          番号抽選状況（クリックで削除・取消可能）
        </h2>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => {
            const isCalled = calledNumSet.has(num);
            return (
              <button
                key={num}
                onClick={() => isCalled && handleDeleteNumber(num)}
                title={isCalled ? 'クリックして取り消す' : '未呼出'}
                className={`h-12 flex items-center justify-center rounded-lg font-bold text-lg transition ${
                  isCalled
                    ? 'bg-red-500 text-white shadow-md hover:bg-red-600 cursor-pointer scale-105'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
