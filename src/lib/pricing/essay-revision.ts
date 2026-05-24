// ============================================================================
// 作文批改费用计算逻辑
// ============================================================================

/**
 * 作文类型
 */
export type EssayLevel = "primary" | "middle"; // 小学 | 中学

/**
 * 加急类型
 */
export type RushType = "none" | "12h" | "24h"; // 普通 | 加急12小时 | 加急24小时

/**
 * 计算作文批改费用
 * 小学作文：300字以内50元，每增加100字增加10元
 * 中学作文：500字以内80元，每增加100字增加10元
 */
export function calculateRevisionFee(wordCount: number, level: EssayLevel): number {
  if (level === "primary") {
    // 小学：300字以内50元，每增加100字增加10元
    if (wordCount <= 300) {
      return 50;
    }
    const extraWords = wordCount - 300;
    const extraUnits = Math.ceil(extraWords / 100);
    return 50 + extraUnits * 10;
  } else {
    // 中学：500字以内80元，每增加100字增加10元
    if (wordCount <= 500) {
      return 80;
    }
    const extraWords = wordCount - 500;
    const extraUnits = Math.ceil(extraWords / 100);
    return 80 + extraUnits * 10;
  }
}

/**
 * 计算加急费用倍数
 */
export function getRushMultiplier(rushType: RushType): number {
  switch (rushType) {
    case "12h":
      return 2; // 加急12小时 *2
    case "24h":
      return 1.5; // 加急24小时 *1.5
    default:
      return 1;
  }
}

/**
 * 计算总费用
 */
export function calculateTotalFee(wordCount: number, level: EssayLevel, rushType: RushType): number {
  const baseFee = calculateRevisionFee(wordCount, level);
  const multiplier = getRushMultiplier(rushType);
  return Math.round(baseFee * multiplier);
}

/**
 * 获取作文级别标签
 */
export const ESSAY_LEVEL_LABELS: Record<EssayLevel, string> = {
  primary: "小学",
  middle: "中学",
};

/**
 * 获取加急类型标签
 */
export const RUSH_TYPE_LABELS: Record<RushType, string> = {
  none: "普通",
  "12h": "加急12小时",
  "24h": "加急24小时",
};

/**
 * 获取加急说明
 */
export const RUSH_DESCRIPTION: Record<RushType, string> = {
  none: "",
  "12h": "加急12小时内批改：报价×2",
  "24h": "加急24小时内批改：报价×1.5",
};

/**
 * 收费明细表（用于展示）
 */
export function getFeeTable(level: EssayLevel): { wordRange: string; fee: number }[] {
  const table: { wordRange: string; fee: number }[] = [];

  if (level === "primary") {
    // 小学收费表
    table.push({ wordRange: "300字及以下", fee: 50 });
    for (let words = 400; words <= 1200; words += 100) {
      table.push({ wordRange: `${words}字`, fee: calculateRevisionFee(words, "primary") });
    }
  } else {
    // 中学收费表
    table.push({ wordRange: "500字及以下", fee: 80 });
    for (let words = 600; words <= 1500; words += 100) {
      table.push({ wordRange: `${words}字`, fee: calculateRevisionFee(words, "middle") });
    }
  }

  return table;
}

/**
 * AI批改单次费用
 */
export const AI_REVISION_FEE_PER_TIME = 1; // 1元/次