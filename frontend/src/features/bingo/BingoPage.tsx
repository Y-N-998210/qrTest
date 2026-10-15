import React, { useEffect, useState } from 'react';
import { bingoApi } from './services/bingoApi';

export const BingoPage: React.FC = () => {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [latestNumber, setLatestNumber] = useState<number | null>(null);

  // データの取得（必要に応じて定期的にポーリングで最新化するとモニターとして完璧になります）
  const fetchCalledNumbers = async () => {
    try {
      const data = await bingoApi.getCalledNumbers();
      const numbers = data.map((item) => item.number);
      setCalledNumbers(numbers);
      if (numbers.length > 0) {
        setLatestNumber(numbers[numbers.length - 1]);
      } else {
        setLatestNumber(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCalledNumbers();

    // モニター画面として使う場合、数秒おきに自動でバックエンドから最新状況を取得すると便利です
    const interval = setInterval(fetchCalledNumbers, 3000);
    return () => clearInterval(interval);
  }, []);

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

      {/* 1〜75の番号一覧グリッド（入力フォームは削除しました） */}
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