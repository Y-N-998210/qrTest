/**
 * @file QRスキャンの動作状態(成功・失敗・エラー) を管理するカスタムフック
 */
import { useState } from "react";
import { stampService } from "../services/stampService";
import { type ScanResultState } from "../types/index";
import { type IDetectedBarcode } from "@yudiel/react-qr-scanner";

export function useQrScanner() {
    // スキャン結果データ(成功・獲得済み情報など)
    const [scanResult, setScanResult] = useState<ScanResultState | null>(null);
    // エラーメッセージ(無効なQRコードなど)
    const [error, setError] = useState<string | null>(null);

    /**
     * カメラがQRコードを検知した際に発火するハンドラー関数
     * @param detectedCode - カメラライブラリから渡される検出コード情報配列
     */
    const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
        // 検出データがない場合は処理しない
        if (!detectedCodes || detectedCodes.length === 0) return;

        // 読み取った生のテキスト値を取得
        const rawValue = detectedCodes[0].rawValue;

        // 1.フォーマット検証
        const validation = stampService.parseQrCode(rawValue);

        if (!validation.isValid) {
            setError(validation.message || '読み取りエラー');
            return;
        }

        // 2.正しいQRコードであればローカルストレージへ保存処理
        if (validation.spotId) {
            const result = await stampService.saveStamp(validation.spotId);
            setScanResult({
                spotId: validation.spotId,
                ...result
            });
            setError(null); // エラー状態をクリア
        }
    };

    /**
     * スキャン結果表示をクリアし、連続で次のQRコードを読める状態に戻す
     */
    const clearResult = () => {
        setScanResult(null);
        setError(null);
    };

    return { scanResult, error, handleScan, clearResult};
}