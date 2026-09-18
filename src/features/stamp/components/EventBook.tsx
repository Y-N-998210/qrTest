/**
 * @file イベント図鑑を表示するコンポーネント
 */

import React from 'react';
import type { EventItem } from '../types/event';
import { stampService } from '../services/stampService';

interface EventBookProps {
    allEvents: EventItem[]; // 全イベント(スポット)のマスターデータ配列
    unlockedIds: string[]; // ユーザが開放済みイベントID（文字列)の配列
    onReset?: () => void; // リセット後の再描画コールバック
}

export const EventBook: React.FC<EventBookProps> = ({allEvents, unlockedIds, onReset,}) => {
    const handleReset = async () => {
        if (window.confirm('デバッグ機能: 獲得したスタンプを全てリセットしますか？')) {
            await stampService.resetStamps();
            if (onReset) onReset();
        }
    };

  return (
    <div className="event-book p-4">
        <div className="flex justify-between items-center mb-4">
            {/* 図鑑のタイトルヘッダー */}
            <h2 className="text-xl font-bold">📖 イベント図鑑</h2>

            <div className="flex items-center gap-2">
                <span className='text-sm font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
                    {unlockedIds.length} / {allEvents.length} 解放
                </span>
                {/* デバッグ用リセットボタン */}
                <button
                onClick={handleReset}
                className='text-xs bg-red-100 text-red-600 border border-red-300 px-2 py-1 rounded hover:bg-red-200 transition'
                >
                    リセット
                </button>
            </div>
        </div>

        {/* カード */}
        <div className="grid grid-cols-2 gap-4">
            {allEvents.map((event) => {
                const isUnlocked = unlockedIds.includes(event.id);

                return (
                    <div
                        key={event.id} // Reactがリスト要素を識別するためのユニークキー
                        className={`p-4 rounded-lg border ${
                        isUnlocked
                            ? 'bg-white border-blue-500'
                            : 'bg-gray-200 border-gray-300 opacity-60'
                        }`}
                    >
                        {/* アイコン：未開放は鍵マーク */}
                        <div className="text-2xl mb-2">
                            {isUnlocked ? '🎯' : '🔒'}
                        </div>
                        {/* タイトル：未開放は伏字 */}
                        <h3 className="font-bold">
                            {isUnlocked ? event.title : '?????'}
                        </h3>
                        {/* 説明文：未開放は案内メッセージ */}
                        <p className="text-xs text-gray-600">
                            {isUnlocked ? event.description: 'QRコードを読み取って解放しよう!!'}
                        </p>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
