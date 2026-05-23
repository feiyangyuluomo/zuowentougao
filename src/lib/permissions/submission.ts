// ============================================================================
// 投稿相关权限函数
// ============================================================================

import type {
  UserIdentity,
  SelfSubmission,
  AgentSubmissionTask,
  Entitlement,
} from "@/types";

/**
 * 检查是否可以查看自己的自主投稿记录
 */
export function canViewSelfSubmission(
  submission: SelfSubmission,
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  // 管理员和运营可以查看所有
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // 投稿记录归属身份可以查看
  return submission.identityId === identity.id;
}

/**
 * 检查是否可以查看自己的平台代投记录
 */
export function canViewAgentSubmission(
  task: AgentSubmissionTask,
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  // 管理员和运营可以查看所有
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // 代投任务归属身份可以查看
  return task.identityId === identity.id;
}

/**
 * 检查是否可以处理平台代投任务（运营权限）
 */
export function canHandleAgentSubmissionTask(
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  return ["operator", "admin"].includes(identity.identityType);
}

/**
 * 检查是否可以上传投稿截图（运营权限）
 */
export function canUploadSubmissionScreenshot(
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  return ["operator", "admin"].includes(identity.identityType);
}

/**
 * 检查是否可以更新代投后台状态（运营权限）
 */
export function canUpdateAgentSubmissionStatus(
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  return ["operator", "admin"].includes(identity.identityType);
}

/**
 * 检查是否可以看到运营内部备注
 */
export function canViewInternalNotes(
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  return ["operator", "admin"].includes(identity.identityType);
}

/**
 * 检查是否可以查看成长档案
 */
export function canViewGrowthRecords(
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  return ["parent", "teacher", "organization_admin", "organization_teacher", "operator", "admin"].includes(
    identity.identityType
  );
}