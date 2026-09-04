/**
 * @file WEBカメラの映像枠を表示するコンポーネント
 */
import React from "react";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";

interface QrCameraViewProps {
    onScan: (detectedCodes: IDetectedBarcode[]) => void;    // 検知時親へ送るコールバック
}

export const QrCameraView: React.FC<QrCameraViewProps> = ({ onScan }) => {
    return (
        // 角丸・影付きのアスペクト比1:1カメラ枠
        <div className="w-full max-w-[320px] aspect-square mx-auto rounded-2xl overflow-hidden shadow-lg relative bg-black">
            <Scanner
                onScan={onScan}
                constraints={{ facingMode: 'environment' }} // リアカメラを優先
                components={{ audio: false }}    // 読み取り時の効果音オフ
            />
        </div>
    )
}