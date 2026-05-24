// ============================================================================
// Workspace 投稿数据
// ============================================================================

import type { UserIdentity } from "@/types";

/**
 * 工作台投稿列表项
 */
export interface WorkspaceSubmissionItem {
  id: string;
  essayId: string;
  essayTitle: string;
  studentName: string;
  activityTitle: string;
  status: "pending" | "submitted" | "replied" | "accepted" | "rejected";
  submittedAt: Date;
}

/**
 * 获取工作台投稿列表
 * TODO: 实际应该从投稿表获取数据
 */
export function getWorkspaceSubmissions(identity: UserIdentity | null): WorkspaceSubmissionItem[] {
  if (!identity) {
    return [];
  }

  // TODO: 实际应该按学生归属权限过滤投稿记录
  // 目前返回空数组，等后续投稿功能完善
  return [];
}