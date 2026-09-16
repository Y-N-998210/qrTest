/**
 * @file イベント図鑑を表示するコンポーネント
 */

import React from 'react';
import type { EventItem } from '../types/event';

interface EventBookProps {
    allEvents: EventItem[]; // 全イベント(スポット)のマスターデータ配列
    unlockedIds: string[];  // ユーザが開放済みイベントID（文字列)の配列
}

export const EventBook: React.FC<EventBookProps> = ({ allEvents, unlockedIds }) => {
    return (
        <div className="event-book p-4">
            {/* 図鑑のタイトルヘッダー */}
            <h2 className="text-xl font-bold mb-4">📖 イベント図鑑</h2>

            {/* カード */}
            <div className="grid grid-cols-2 gap-4">
                {allEvents.map((event) => {
                    const isUnlocked = unlockedIds.includes(event.id);

                    return (
                        <div
                            key={event.id}  // Reactがリスト要素を識別するためのユニークキー
                            className={`p-4 rounded-lg border ${isUnlocked ? 'bg-white border-blue-500' : 'bg-gray-200 border-gray-300 opacity-60'
                                }`}
                        >
                            {/* アイコン：未開放は鍵マーク */}
                            <div className="text-2xl mb-2">{isUnlocked ? '🎯' : '🔒'}</div>
                            {/* タイトル：未開放は伏字 */}
                            <h3 className="font-bold">{isUnlocked ? event.title : '?????'}</h3>
                            {/* 説明文：未開放は案内メッセージ */}
                            <p className="text-xs text-gray-600">
                                {isUnlocked ? event.description : 'QRコードを読み取って解放しよう!!'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};