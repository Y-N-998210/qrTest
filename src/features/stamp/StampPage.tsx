/**
 * @file QRスキャン画面
 */

import { useQrScanner } from "./hooks/useQrScanner";
import { QrCameraView } from "./components/QrCameraView";

export default function StampPage() {
    // カスタムフックからスキャン処理・結果・エラー表示用状態を取得
    const { scanResult, error, handleScan, clearResult } = useQrScanner();
    
    return (
        <div>
            <h1>学園祭スタンプラリー</h1>

            {/* カメラ枠の表示 */}
            <QrCameraView onScan={handleScan} />

            {/* 無効なQRコードを読んだとき */}
            {error && (
                <div>
                    {error}
                </div>
            )}

            {/* 読み取り成功時 */}
            {scanResult && (
                <div>
                    <p>
                        {scanResult.success ? 'スタンプゲット' : '通知'}
                    </p>

                    <button
                        onClick={clearResult}
                    >
                        次のQRコードをスキャン
                    </button>
                </div>
            )}
        </div>
    )
}