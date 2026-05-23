// ============================================================================
// 会员权益相关权限函数
// ============================================================================

import type { UserIdentity, Membership, Entitlement } from "@/types";

/**
 * 检查当前会员是否有效
 */
export function isMembershipActive(membership: Membership | null): boolean {
  if (!membership) return false;
  if (membership.status !== "active") return false;

  const now = new Date();
  const validTo = new Date(membership.validTo);

  if (membership.isLifetime) return true;

  return now <= validTo;
}

/**
 * 检查是否具有查看活动完整详情的权益
 */
export function canViewActivityDetail(
  entitlements: Entitlement[]
): boolean {
  return hasEntitlement(entitlements, "view_activity_detail");
}

/**
 * 检查是否具有AI改稿权益
 */
export function canUseAIRewriteEntitlement(entitlements: Entitlement[]): boolean {
  return hasEntitlement(entitlements, "ai_rewrite");
}

/**
 * 检查是否具有AI推荐活动权益
 */
export function canUseAIRecommendEntitlement(entitlements: Entitlement[]): boolean {
  return hasEntitlement(entitlements, "ai_recommend");
}

/**
 * 检查是否具有平台代投权益
 */
export function canUseAgentSubmission(entitlements: Entitlement[]): boolean {
  return hasEntitlement(entitlements, "agent_submission");
}

/**
 * 获取剩余AI改稿次数
 */
export function getRemainingAIRewriteQuota(entitlements: Entitlement[]): number {
  const entitlement = entitlements.find((e) => e.entitlementType === "ai_rewrite");
  if (!entitlement) return 0;
  return entitlement.aiQuota ?? 0;
}

/**
 * 获取剩余代投次数
 */
export function getRemainingAgentSubmissionQuota(
  entitlements: Entitlement[]
): number {
  const entitlement = entitlements.find(
    (e) => e.entitlementType === "agent_submission"
  );
  if (!entitlement) return 0;
  return entitlement.agentSubmissionQuota ?? 0;
}

/**
 * 检查是否具有机构学生管理权限
 */
export function canManageOrganizationStudents(
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  return ["organization_admin", "organization_teacher"].includes(
    identity.identityType
  );
}

/**
 * 检查是否具有后台访问权限
 */
export function canAccessAdmin(identity: UserIdentity | null): boolean {
  if (!identity) return false;

  return ["operator", "admin"].includes(identity.identityType);
}

/**
 * 检查是否具有编辑工作台权限
 */
export function canAccessEditor(identity: UserIdentity | null): boolean {
  if (!identity) return false;

  return ["editor", "operator", "admin"].includes(identity.identityType);
}

/**
 * 检查是否具有工作台（老师/机构）权限
 */
export function canAccessWorkspace(identity: UserIdentity | null): boolean {
  if (!identity) return false;

  return [
    "teacher",
    "organization_admin",
    "organization_teacher",
  ].includes(identity.identityType);
}

// ============================================================================
// 辅助函数
// ============================================================================

function hasEntitlement(
  entitlements: Entitlement[],
  type: Entitlement["entitlementType"]
): boolean {
  return entitlements.some((e) => e.entitlementType === type);
}