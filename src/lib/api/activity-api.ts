// ============================================================================
// Activity API Client
// 活动相关 API 调用封装
// ============================================================================

import { apiGet } from "./client";

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 活动列表项
 */
export interface ActivityListItem {
  id: string;
  title: string;
  publisherName: string;
  gradeScope?: string[];
  hasPayment: boolean;
  hasCertificate: boolean;
  deadline?: string;
  isLongTerm: boolean;
  activityStatus: string;
  publicSummary: string;
  coverImage?: string;
}

/**
 * 活动详情
 */
export interface ActivityDetail extends ActivityListItem {
  activityType?: string;
  genre?: string;
  themeTags?: string[];
  submissionEmail?: string;
  submissionMethod?: string;
  submissionFormat?: string;
  emailSubjectFormat?: string;
  hasBonus: boolean;
  hasSampleIssue: boolean;
  hasTeacherGuide: boolean;
  hasOrgAward: boolean;
  supportSelfSubmission: boolean;
  supportAgentSubmission: boolean;
  sourceUrl?: string;
  originalDetail?: string;
  paidDetail?: string;
  writingSuggestions?: string;
  views: number;
  submissions: number;
}

/**
 * 活动筛选参数
 */
export interface ActivityFilters {
  keyword?: string;
  gradeScope?: string[];
  genre?: string[];
  activityStatus?: string;
  hasPayment?: boolean;
  hasCertificate?: boolean;
}

// ============================================================================
// API 函数
// ============================================================================

/**
 * 获取活动列表
 */
export async function getActivities(
  filters?: ActivityFilters
): Promise<ActivityListItem[]> {
  // 将 filters 转换为 Record<string, string | string[] | undefined>
  const params: Record<string, string | string[] | undefined> = {};
  if (filters) {
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.gradeScope) params.gradeScope = filters.gradeScope;
    if (filters.genre) params.genre = filters.genre;
    if (filters.activityStatus) params.activityStatus = filters.activityStatus;
    if (filters.hasPayment !== undefined) params.hasPayment = String(filters.hasPayment);
    if (filters.hasCertificate !== undefined) params.hasCertificate = String(filters.hasCertificate);
  }
  return apiGet<ActivityListItem[]>("/activities", { params });
}

/**
 * 获取活动详情
 */
export async function getActivityById(
  id: string
): Promise<ActivityDetail | null> {
  return apiGet<ActivityDetail | null>(`/activities/${id}`);
}