import type { EssayGenre, EssayStatus, EssayVersionType, Timestamps } from "./common";

// ============================================================================
// 作文相关类型
// ============================================================================

// 作文
export interface Essay extends Timestamps {
  id: string;
  studentId: string;
  ownerIdentityId: string;   // 归属身份ID
  title: string;
  content: string;
  wordCount: number;
  genre?: EssayGenre;
  themeTags?: string[];
  status: EssayStatus;
  coverImage?: string;       // 封面图
  latestVersionId?: string;  // 最新版本ID
}

// 作文版本
export interface EssayVersion extends Timestamps {
  id: string;
  essayId: string;
  versionType: EssayVersionType;
  content: string;
  summary?: string;         // AI改稿摘要
  createdByIdentityId: string;
  modelName?: string;       // 如果是AI改稿，记录模型名称
}

// 作文上传参数
export interface EssayUploadParams {
  studentId: string;
  title: string;
  content: string;
  genre?: EssayGenre;
  themeTags?: string[];
  coverImage?: string;
}

// 作文列表项
export interface EssayListItem {
  id: string;
  title: string;
  wordCount: number;
  genre?: EssayGenre;
  themeTags?: string[];
  status: EssayStatus;
  updatedAt: Date;
  latestVersionType?: EssayVersionType;
  submissionCount: number;   // 投稿次数
}

// ============================================================================
// AI改稿相关类型
// ============================================================================

// AI改稿输入
export interface AIRewriteInput {
  essayId: string;
  instructions?: string;     // 改稿指令
}

// AI改稿输出
export interface AIRewriteOutput {
  originalContent: string;
  revisedContent: string;
  suggestions: string[];    // 改进建议
  summary: string;           // 改稿摘要
  modelName: string;
}

// AI分析输入
export interface AIAnalysisInput {
  content: string;
  grade?: string;
  genre?: EssayGenre;
  wordCount?: number;
}

// AI分析输出
export interface AIAnalysisOutput {
  grade?: string;
  genre?: EssayGenre;
  theme?: string[];
  writingType?: string;     // 写作类型
  qualityScore?: number;     // 质量评分
  suggestions: string[];     // 写作建议
  suitableActivities: string[]; // 适合的活动类型
}