// ============================================================================
// Essay API Client
// 作文相关 API 调用封装
// ============================================================================

import { apiGet, apiPost } from "./client";

/**
 * 作文基础信息
 */
export interface EssayInfo {
  id: string;
  studentId?: string;
  ownerIdentityId: string;
  title: string;
  content: string;
  wordCount: number;
  genre?: string;
  themeTags?: string[];
  status: "draft" | "published";
  coverImage?: string;
  latestVersionId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建作文参数
 */
export interface CreateEssayParams {
  studentId?: string;
  title: string;
  content: string;
  wordCount?: number;
  genre?: string;
  themeTags?: string[];
  grade?: string;
}

/**
 * 获取作文列表
 */
export async function getEssays(): Promise<EssayInfo[]> {
  return apiGet<EssayInfo[]>("/essays");
}

/**
 * 获取单个作文详情
 */
export async function getEssayById(id: string): Promise<EssayInfo | null> {
  return apiGet<EssayInfo | null>(`/essays/${id}`);
}

/**
 * 创建作文
 */
export async function createEssay(data: CreateEssayParams): Promise<EssayInfo> {
  return apiPost<EssayInfo>("/essays", data);
}