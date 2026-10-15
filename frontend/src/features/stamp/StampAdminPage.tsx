import React, { useState } from 'react';

interface StampAdminPageProps {
  onNavigate?: (page: string) => void;
}

export const StampAdminPage: React.FC<StampAdminPageProps> = ({ onNavigate }) => {
  const [targetId, setTargetId] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;

    const playerId = parseInt(targetId, 10);
    if (isNaN(playerId)) {
      setError('有効なプレイヤー番号（数値）を入力してください');
      return;
    }

    if (!window.confirm(`本当に プレイヤー #${playerId} のデータをリセットしますか？`)) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${playerId}/stamps`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✨ プレイヤー #${playerId} のデータを正常にリセットしました！`);
        setTargetId('');
      } else {
        setError(data.error || 'リセットに失敗しました');
      }
    } catch (err) {
      console.error(err);
      setError('サーバーとの通信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 pb-16 max-w-md mx-auto relative border-x border-gray-200 flex flex-col justify-between">
      <div>
        {/* ヘッダー */}
        <header className="bg-white p-3 sticky top-0 z-20 shadow-sm flex items-center justify-between border-b">
          <button
            onClick={() => onNavigate?.('joy-top')}
            className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200"
          >
            ＜ トップへ戻る
          </button>
          <span className="text-xs font-bold text-amber-600">⚙️ スタンプ運営管理</span>
        </header>

        {/* メインコンテンツ */}
        <main className="p-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-gray-800 border-b pb-2">
              🔄 参加者データ個別リセット
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              お客さんから提示された「プレイヤー番号」を入力し、スタンプラリーのクリア状況や獲得データをリセットします。
            </p>

            <form onSubmit={handleReset} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  対象のプレイヤー番号
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600 font-mono text-sm">
                    #
                  </span>
                  <input
                    type="number"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    placeholder="例: 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !targetId}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition shadow-sm"
              >
                {loading ? '処理中...' : 'このプレイヤーのデータをリセット'}
              </button>
            </form>

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl font-medium">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};