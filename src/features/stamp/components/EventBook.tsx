import React from 'react';
import { EventItem } from '../types/event';

interface EventBookProps {
    allEvents: EventItem[];
    unlockedIds: string[];
}

export const EventBook: React.FC<EventBookProps> = ({ allEvents, unlockedIds }) => {
    return (
        <div className="event-book p-4">
            <h2 className="text-xl font-bold mb-4">📖 イベント図鑑</h2>
            <div className="grid grid-cols-2 gap-4">
                {allEvents.map((event) => {
                    const isUnlocked = unlockedIds.includes(event.id);
                    return (
                        <div
                            key={event.id}
                            className={`p-4 rounded-lg border ${isUnlocked ? 'bg-white border-blue-500' : 'bg-gray-200 border-gray-300 opacity-60'
                                }`}
                        >
                            <div className="text-2xl mb-2">{isUnlocked ? '🎯' : '🔒'}</div>
                            <h3 className="font-bold">{isUnlocked ? event.title : '?????'}</h3>
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