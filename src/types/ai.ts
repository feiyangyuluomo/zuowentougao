import type { AITaskType, Timestamps } from "./common";

// ============================================================================
// AI记录相关类型
// ============================================================================

// AI记录
export interface AIRecord extends Timestamps {
  id: string;
  identityId: string;
  essayId: string;
  taskType: AITaskType;
  modelName: string;
  inputSummary: string;
  outputSummary: string;
  tokenUsage?: number;
  costAmount?: number;
}

// AI推荐结果
export interface AIRecommendResult {
  activityId: string;
  matchScore: number;
  matchReasons: string[];
  risks: string[];
  advice: string;
  isSelfSubmissionRecommended: boolean;
  isAgentSubmissionRecommended: boolean;
}

// AI改稿结果
export interface AIRewriteResult {
  originalContent: string;
  revisedContent: string;
  suggestions: string[];
  summary: string;
  modelName: string;
}

// AI标题建议
export interfaceAITitleSuggestion {
  title: string;
  reasoning: string;
}

// AI栏目匹配
export interface AIColumnMatch {
  activityId: string;
  activityTitle: string;
  matchScore: number;
  matchReasons: string[];
}

// AI投稿建议
export interface AISubmissionAdvice {
  advice: string;
  risks: string[];
  suggestions: string[];
}

// AI调用参数
export interface AICallParams {
  essayId?: string;
  content?: string;
  grade?: string;
  genre?: string;
  taskType: AITaskType;
}

// AI服务配额
export interface AIQuota {
  total: number;
  used: number;
  remaining: number;
  expiredAt?: Date;
}