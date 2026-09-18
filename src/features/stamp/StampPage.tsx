import { useState, useEffect } from "react";
import { useQrScanner } from "./hooks/useQrScanner";
import { QrCameraView } from "./components/QrCameraView";
import { EventBook } from "./components/EventBook";
import { stampService } from "./services/stampService";
import type { EventItem } from "./types/event";

export default function StampPage() {
    const { scanResult, scannedEvent, error, handleScan, clearResult } = useQrScanner();
    const [activeTab, setActiveTab] = useState<'scan' | 'book'>('scan');
    const [allEvents, setAllEvents] = useState<EventItem[]>([]);
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

    // 図鑑データの読み込み関数
    const loadEventData = async () => {
        const events = await stampService.getAllEvents();
        const saved = await stampService.getSavedStamps();
        setAllEvents(events);
        setUnlockedIds(saved);
    };

    useEffect(() => {
        loadEventData();
    }, []);

    // スキャン成功・獲得時に図鑑データを最新化
    useEffect(() => {
        if (scanResult) {
            loadEventData();
        }
    }, [scanResult]);

    const handleContinueScan = () => {
        clearResult();
    };

    const handleGoToBook = () => {
        clearResult();
        setActiveTab('book');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* ヘッダー / タブ切り替え */}
            <header className="bg-white shadow-sm border-b p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-center mb-3">学園祭スタンプラリー</h1>
                <div className="flex justify-center gap-2 max-w-xs mx-auto">
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors ${
                            activeTab === 'scan'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        QRスキャン
                    </button>
                    <button
                        onClick={() => setActiveTab('book')}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors ${
                            activeTab === 'book'
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        イベント図鑑
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4">
                {/* スキャン画面 */}
                {activeTab === 'scan' && (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-600 text-center">
                            会場に配置されたQRコードをカメラにかざしてください
                        </p>

                        <QrCameraView onScan={handleScan} />

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm font-medium w-full text-center">
                                ⚠️ {error}
                            </div>
                        )}
                    </div>
                )}

                {/* 図鑑画面 */}
                {activeTab === 'book' && (
                    <EventBook 
                        allEvents={allEvents} 
                        unlockedIds={unlockedIds}
                        onReset={loadEventData}
                    />
                )}
            </main>

            {/* スキャン結果 モーダルポップアップ */}
            {scanResult && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center space-y-4">
                        {scanResult.success ? (
                            <>
                                <div className="text-5xl">🎉</div>
                                <h2 className="text-2xl font-bold text-gray-800">スタンプゲット！</h2>
                                {scannedEvent && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-left">
                                        <div className="text-xs font-bold text-blue-600 mb-1">
                                            {scannedEvent.organization || '企画'}
                                        </div>
                                        <div className="font-bold text-gray-800 text-base">
                                            {scannedEvent.title}
                                        </div>
                                        {scannedEvent.schedule && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                ⏰ {scannedEvent.schedule}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <p className="text-sm text-gray-600">
                                    図鑑に新しいイベントが追加されました！
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="text-5xl">ℹ️</div>
                                <h2 className="text-xl font-bold text-gray-800">獲得済み</h2>
                                <p className="text-sm text-gray-600">
                                    {scanResult.message || 'このスタンプは既に獲得済みです。'}
                                </p>
                            </>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                onClick={handleGoToBook}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 active:scale-95 transition"
                            >
                                📖 図鑑を見る
                            </button>
                            <button
                                onClick={handleContinueScan}
                                className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition text-sm"
                            >
                                📷 続けてスキャンする
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}