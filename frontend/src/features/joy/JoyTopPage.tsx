import React, { useState, useEffect } from 'react';
import { getOrCreateUserId } from '../../utils/userId';

interface JoyTopPageProps {
  onNavigate?: (page: string) => void;
}

export const JoyTopPage: React.FC<JoyTopPageProps> = ({ onNavigate }) => {
  // パラメータ・状態管理 (後でAPI/Storeと接続可能)
  const [totalPt] = useState(30); // 全体達成率パラメータ (0〜100pt)
  const [userPt] = useState(30); // 自己達成率パラメータ
  const [showHint, setShowHint] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [hasBingoNotice, setHasBingoNotice] = useState(true);

  // サポートID及びコピー状態管理
  const [copied, setCopied] = useState(false);
  const userId = getOrCreateUserId();

  // サポートIDのクリップボードコピー処理
  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('IDのコピーに失敗', err);
    }
  };

  // 初回起動時にストーリーを表示する仕様
  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem('joy_story_seen');
    if (isFirstVisit) {
      setShowStory(true);
      sessionStorage.setItem('joy_story_seen', 'true');
    }
  }, []);

  // 自己ptに基づく知識ランクの判定
  const getRank = (pt: number) => {
    if (pt >= 100) return '妖精 🧚';
    if (pt >= 80) return '教授 🎓';
    if (pt >= 60) return '先生 👨‍🏫';
    if (pt >= 30) return '優秀な学生 ⭐';
    return '学生 📖';
  };

  // 自己ptに基づくキャラクター（うってぃ）の状態
  const getUttyState = (pt: number) => {
    if (pt >= 50)
      return {
        emoji: '🥳',
        mood: '元気いっぱい！',
        dialog: 'ありがとう！助かったよ！',
      };
    if (pt >= 30)
      return {
        emoji: '🙂',
        mood: '回復中',
        dialog: 'もう少しで元気になるかも！',
      };
    return { emoji: '🥺', mood: 'ピンチ！', dialog: 'タスケテー' };
  };

  const utty = getUttyState(userPt);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 pb-16 max-w-md mx-auto relative border-x border-gray-200 flex flex-col justify-between">
      <div>
        {/* 1. ヘッダーナビゲーション */}
        <header className="bg-white p-3 sticky top-0 z-20 shadow-sm flex items-center justify-between border-b">
          <button
            onClick={() => onNavigate?.('home')}
            className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200"
          >
            ＜ トップへ戻る
          </button>

          <div className="flex items-center gap-2">
            {/* ヒントボタン */}
            <button
              onClick={() => setShowHint(true)}
              className="p-2 bg-yellow-100 rounded-full text-sm hover:bg-yellow-200"
              title="ヒント"
            >
              💡
            </button>
            {/* ストーリーボタン */}
            <button
              onClick={() => setShowStory(true)}
              className="p-2 bg-purple-100 rounded-full text-sm hover:bg-purple-200"
              title="ストーリー"
            >
              📖
            </button>
            {/* マイスケジュール ショートカット */}
            <button
              onClick={() => onNavigate?.('schedule')}
              className="p-2 bg-blue-100 rounded-full text-sm hover:bg-blue-200"
              title="マイスケジュール"
            >
              📅
            </button>
            {/* QRリーダー ショートカット */}
            <button
              onClick={() => onNavigate?.('scan')}
              className="p-2 bg-green-100 rounded-full text-sm hover:bg-green-200"
              title="QRリーダー"
            >
              📷
            </button>
          </div>
        </header>

        {/* 2. ステータス / ダッシュボード */}
        <section className="p-4 bg-gradient-to-b from-blue-50 to-slate-50 border-b">
          <div className="flex items-stretch justify-between gap-4">
            {/* 左側: キャラクターとうってぃの状態 */}
            <div className="flex-1 flex flex-col justify-between items-center bg-white p-4 rounded-2xl shadow-sm border">
              <div className="text-center w-full">
                <span className="text-xs text-gray-500 font-bold">
                  自己貢献度
                </span>
                <div className="text-3xl font-extrabold text-blue-600">
                  {userPt}
                  <span className="text-sm font-normal">pt</span>
                </div>
              </div>

              {/* キャラクター吹き出し＆画像 */}
              <div className="my-3 text-center">
                <div className="inline-block bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full mb-1 animate-bounce">
                  {utty.dialog}
                </div>
                <div className="text-6xl my-1">{utty.emoji}</div>
              </div>

              {/* 知識ランク */}
              <div className="w-full text-center bg-slate-100 p-2 rounded-xl">
                <div className="text-[10px] text-gray-500 font-bold">
                  あなたの知識ランク
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {getRank(userPt)}
                </div>
              </div>
            </div>

            {/* 右側: 全体達成率パラメータ (縦型メーター) */}
            <div className="w-24 bg-white p-3 rounded-2xl shadow-sm border flex flex-col items-center justify-between">
              <span className="text-[10px] font-bold text-gray-500 text-center">
                全体達成率
              </span>
              <div className="text-xs font-extrabold text-indigo-600">
                {totalPt} / 100pt
              </div>

              {/* バーメーター本体 */}
              <div className="w-8 h-40 bg-gray-100 rounded-full overflow-hidden border relative flex flex-col justify-end my-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 transition-all duration-500 rounded-b-full"
                  style={{ height: `${Math.min(totalPt, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400">限界突破OK!</span>
            </div>
          </div>

          <div className="text-center mt-3">
            <span className="text-xs text-gray-400 font-medium">
              ⇩ Scroll で企画へ ⇩
            </span>
          </div>
        </section>

        {/* 3. お楽しみ企画バナー一覧 */}
        <section className="p-4 space-y-3">
          <h2 className="text-sm font-bold text-gray-500 px-1">
            ポイント獲得＆お楽しみ企画
          </h2>

          {/* バナー 1: QRリーダー */}
          <button
            onClick={() => onNavigate?.('scan')}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-blue-100 hover:border-blue-400 text-left flex items-center justify-between transition group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  ポイントGET
                </span>
                <h3 className="font-bold text-base text-gray-800 group-hover:text-blue-600">
                  イベント QR リーダー
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                たくさんの企画に参加して、「イベント図鑑」を埋めよう！！
              </p>
            </div>
            <div className="text-3xl pl-2">📷</div>
          </button>

          {/* バナー 2: 学校探検 */}
          <button
            onClick={() => onNavigate?.('map')}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-green-100 hover:border-green-400 text-left flex items-center justify-between transition group"
          >
            <div>
              <h3 className="font-bold text-base text-gray-800 mb-1 group-hover:text-green-600">
                学校探検！！
              </h3>
              <p className="text-xs text-gray-500">
                学内をめぐって地図を完成させよう！
              </p>
            </div>
            <div className="text-3xl pl-2">🗺️</div>
          </button>

          {/* バナー 3: イベント人気投票 */}
          <button
            onClick={() => onNavigate?.('vote')}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-pink-100 hover:border-pink-400 text-left flex items-center justify-between transition group"
          >
            <div>
              <h3 className="font-bold text-base text-gray-800 mb-1 group-hover:text-pink-600">
                イベント人気投票！
              </h3>
              <p className="text-xs text-gray-500">
                お気に入りの企画に投票して応援しよう！
              </p>
            </div>
            <div className="text-3xl pl-2">🗳️</div>
          </button>

          {/* バナー 4: 思い出投稿 */}
          <button
            onClick={() => onNavigate?.('memories')}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-amber-100 hover:border-amber-400 text-left flex items-center justify-between transition group"
          >
            <div>
              <h3 className="font-bold text-base text-gray-800 mb-1 group-hover:text-amber-600">
                思い出 投稿
              </h3>
              <p className="text-xs text-gray-500">
                投稿した写真がHPに載るかも！？
              </p>
            </div>
            <div className="text-3xl pl-2">🖼️</div>
          </button>

          {/* バナー 5: マイスケジュール作成 */}
          <button
            onClick={() => onNavigate?.('schedule')}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border hover:border-purple-400 text-left flex items-center justify-between transition group"
          >
            <div>
              <h3 className="font-bold text-base text-gray-800 mb-1 group-hover:text-purple-600">
                マイスケジュールの作成
              </h3>
              <p className="text-xs text-gray-500">
                自分だけのまわりかた予定表をつくろう！
              </p>
            </div>
            <div className="text-3xl pl-2">📅</div>
          </button>

          {/* バナー 6: ビンゴ番号表示 (お知らせマーク付き) */}
          <button
            onClick={() => {
              setHasBingoNotice(false);
              onNavigate?.('bingo');
            }}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border hover:border-indigo-400 text-left flex items-center justify-between transition group relative"
          >
            {hasBingoNotice && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white font-bold items-center justify-center">
                  !
                </span>
              </span>
            )}
            <div>
              <h3 className="font-bold text-base text-gray-800 mb-1 group-hover:text-indigo-600">
                ビンゴ番号表示
              </h3>
              <p className="text-xs text-gray-500">
                ビンゴゲームの記録・抽選番号を閲覧
              </p>
            </div>
            <div className="text-3xl pl-2">🎰</div>
          </button>
        </section>

        {/* 4. ヒント モーダル */}
        {showHint && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                💡 お楽しみ企画の使い方
              </h3>
              <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
                <p>
                  ・QRコードを読み込むとポイントが貯まり、イベント図鑑が開禁されます。
                </p>
                <p>
                  ・みんなの獲得ポイントが貯まると全体達成率が上がり、演出が豪華になります！
                </p>
                <p>
                  ・あなたのポイントに応じて「うってぃ」が元気になり、知識ランクが上がります。
                </p>
              </div>
              <button
                onClick={() => setShowHint(false)}
                className="w-full py-2 bg-blue-600 text-white font-bold text-sm rounded-xl"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* 5. ストーリー モーダル */}
        {showStory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
              <div className="text-5xl">🆘</div>
              <h3 className="text-xl font-bold text-gray-800">
                うってぃを救え！
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed text-left bg-blue-50 p-3 rounded-xl">
                学園祭のマスコットキャラクター「うってぃ」の元気がなくなっちゃった！
                <br />
                <br />
                学内の企画やスタンプラリーに参加してポイントを集めることで、うってぃにエネルギーを届けよう！
              </p>
              <button
                onClick={() => setShowStory(false)}
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow"
              >
                さっそくはじめる！
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. フッター (サポートID / 復元用表示) */}
      <footer className="mt-8 py-4 px-4 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
        <p className="mb-1 font-medium">帝祭2026 お楽しみ企画ポータル</p>

        <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm mt-1">
          <span className="text-[10px] text-slate-400 font-mono">
            サポートID:
          </span>
          <span className="font-mono text-[11px] font-semibold text-slate-700 select-all">
            {userId}
          </span>
          <button
            onClick={handleCopyUserId}
            className="ml-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition font-sans active:bg-slate-300"
          >
            {copied ? '✓ コピー完了' : 'コピー'}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 mt-2">
          ※ブラウザのキャッシュを削除すると進行状況がリセットされる場合があります。
        </p>
      </footer>
    </div>
  );
};
