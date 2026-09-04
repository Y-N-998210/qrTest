/**
 * @file スタンプデータの検証・保存・取得を担当するサービス層(ビジネスロック)
 */
import type {  StampValidationResult,  StampSaveResult } from "../types";

// ブラウザの localStorage に保存する際のキー名
const STORAGE_KEY = 'festival_stamps';

export const stampService = {
    /**
     * 読み取ったQRコード文字列が学園祭用の正当なデータか判断する
     * @param rawData - QRコードから読み取った生のテキスト
     * @example
     * 正しい形式: "festival-stamp:booth01" -> spotId: "booth01"
     */
    parseQrCode(rawData: string): StampValidationResult {
        // データが存在しない、またはプレフィックスが合致しない場合は不適切と判断
        if (!rawData || !rawData.startsWith('festival-stamp:')) {
            return {
                isValid: false,
                message: '学園祭用QRコードではありません'
            };
        }

        //  プレフィックスを取り除いてスポットIDのみ抽出
        const spotId = rawData.replace('festival-stamp:', '');
        return {
            isValid: true,
            spotId
        };
    },

    /**
     * 獲得したスタンプIDを localStorage に保存する
     * @param spotId - 保存対象のスポットID
     */
    saveStamp(spotId: string): StampSaveResult {
        const savedStamps = this.getSavedStamps();

        // 重複チェック: すでに獲得済みの場合は保存せずに終了
        if (savedStamps.includes(spotId)) {
            return {
                success: false,
                isAlreadyVisited: true,
                message: 'このスタンプは既に獲得済みです'
            };
        }

        // 未獲得の場合は配列に追加して localStorage に書き込み
        const updated = [...savedStamps, spotId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        return {
            success: true,
            isAlreadyVisited: false,
            updatedStamps: updated
        };
    },

    /**
     * localStorage から過去に獲得したスタンプIDのリストを取得する
     */
    getSavedStamps(): string[] {
        const data = localStorage.getItem(STORAGE_KEY);
        // データが存在すればJSON解析して返し、なければ空配列を返す
        return data ? JSON.parse(data) : [];
    }
};