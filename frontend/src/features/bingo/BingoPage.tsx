import React, { useEffect, useState } from 'react';
import { bingoApi } from './services/bingoApi';
import type { BingoNumber } from './types/bingo';

export const BingoPage: React.FC = () => {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [latestNumber, setLatestNumber] = useState<number | null>(null);
  const [inputNum, setInputNum] = useState<string>('');

  // データの取得
  useEffect(() => {
    bingoApi
      .getCalledNumbers()
      .then((data) => {
        const numbers = data.map((item) => item.number);
        setCalledNumbers(numbers);
        if (numbers.length > 0) {
          setLatestNumber(numbers[numbers.length - 1]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // 番号を呼ぶ(追加する)ハンドラー
  const handleCallNumber = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // ページリロードを防止
    const num = parseInt(inputNum, 10);
    if (isNaN(num) || num < 1 || num > 75) return;

    try {
      await bingoApi.callNumber(num);
      setCalledNumbers((prev) => [...prev, num]);
      setLatestNumber(num);
      setInputNum('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">ビンゴ番号表示</h1>

      {/* 最新の番号表示エリア */}
      <div className="bg-indigo-600 text-white rounded-2xl p-8 text-center shadow-lg mb-8">
        <p className="text-sm uppercase tracking-wider mb-2">
          直近で呼ばれた番号
        </p>
        <div className="text-7xl font-extrabold">
          {latestNumber !== null ? latestNumber : '-'}
        </div>
      </div>

      {/* テスト用：番号入力フォーム */}
      <form
        onSubmit={handleCallNumber}
        className="flex gap-4 justify-center mb-8"
      >
        <input
          type="number"
          min="1"
          max="75"
          value={inputNum}
          onChange={(e) => setInputNum(e.target.value)}
          placeholder="番号 (1-75)"
          className="border border-gray-300 rounded-lg px-4 py-2 w-40 text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          番号を呼ぶ
        </button>
      </form>

      {/* 1〜75の番号一覧グリッド */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          これまでに呼ばれた番号一覧
        </h2>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 75 }, (_, i) => i + 1).map((num) => {
            const isCalled = calledNumbers.includes(num);
            return (
              <div
                key={num}
                className={`h-12 flex items-center justify-center rounded-lg font-bold text-lg transition ${
                  isCalled
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
