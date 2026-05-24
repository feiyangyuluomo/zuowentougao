// ============================================================================
// Workspace 作文数据
// ============================================================================

import type { UserIdentity } from "@/types";

/**
 * 工作台作文列表项
 */
export interface WorkspaceEssayItem {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  grade?: string;
  wordCount?: number;
  status: "draft" | "submitted" | "published";
  createdAt: Date;
}

/**
 * 获取工作台作文列表
 * TODO: 实际应该从作文表获取数据
 */
export function getWorkspaceEssays(identity: UserIdentity | null): WorkspaceEssayItem[] {
  if (!identity) {
    return [];
  }

  // TODO: 实际应该按学生归属权限过滤作文
  // 目前返回空数组，等后续作文功能完善
  return [];
}