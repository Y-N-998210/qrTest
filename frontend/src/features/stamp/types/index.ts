/**
 * @file QRコードスキャンで使用する型定義
 */

// QRコードのフォーマット判定結果
export interface StampValidationResult {
    isValid: boolean;   // 学園祭用のQRか
    spotId?:  string;   // 抽出されたスポット(ブース) ID (例: "booth01")
    message?: string;   // エラー時のメッセージ 
}
// ローカルストレージへの保存結果
export interface StampSaveResult {
    success: boolean;   // 新規保存に成功したか
    isAlreadyVisited:   boolean;    // すでに訪問(取得)済みだったか
    message?: string;   // ユーザーに表示する通知メッセージ
    updatedStamps?: string[];  // 更新後の獲得済みスタンプID一覧
}

// 画面側で保持するスキャン結果の状態
export interface ScanResultState extends StampSaveResult {
    spotId: string; // 対象のスポットID
}