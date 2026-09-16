/**
 * @file スタンプデータの検証・保存・取得を担当するサービス層(ビジネスロック)
 */
import type {  StampValidationResult,  StampSaveResult } from "../types";
import type { IEventRepository } from "../types/event";
import { LocalStorageEventRepository } from "./LocalStorageEventRepository";

// デフォルトのリポジトリインスタンス(必要に応じて差し替え可能)
let repository: IEventRepository = new LocalStorageEventRepository();

export const stampService = {
    /**
     * リポジトリの切り替え(DB/LocalStorageの動的変更用)
     */
    setRepository(newRepo: IEventRepository) {
        repository = newRepo;
    },

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
     * 獲得したスタンプIDを図鑑に保存する(非同期処理化)
     * @param spotId - 保存対象のスポットID
     */
    async saveStamp(spotId: string): Promise<StampSaveResult> {
        const isUnlocked = await repository.unlockEvent(spotId);
        const updated = await repository.getUnlockedEventIds();

        // 重複チェック: すでに獲得済みの場合は保存せずに終了
        if (!isUnlocked) {
            return {
                success: false,
                isAlreadyVisited: true,
                message: 'このスタンプは既に獲得済みです'
            };
        }

        return {
            success: true,
            isAlreadyVisited: false,
            updatedStamps: updated
        };
    },

    /**
     * localStorage から過去に獲得したスタンプIDのリストを取得する
     */
    async getSavedStamps(): Promise<string[]> {
        return await repository.getUnlockedEventIds();
    }
};