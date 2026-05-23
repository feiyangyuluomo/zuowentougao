// ============================================================================
// 活动相关权限函数
// ============================================================================

import type { UserIdentity, Activity, Entitlement } from "@/types";

/**
 * 检查是否可以查看完整活动详情
 * 游客只能看部分信息，会员可以看完整详情
 */
export function canViewFullActivity(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  // 运营和管理员可以查看所有活动
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // 检查权益
  return hasEntitlement(entitlements, "view_activity_detail");
}

/**
 * 检查是否可以查看投稿邮箱
 * 需要会员权益
 */
export function canViewSubmissionEmail(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  return hasEntitlement(entitlements, "view_submission_email");
}

/**
 * 检查是否可以查看投稿方式
 * 会员可见
 */
export function canViewSubmissionMethod(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // TODO: 根据会员权益判断
  return true;
}

/**
 * 检查是否可以创建自主投稿记录
 */
export function canCreateSelfSubmission(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  // 家长、老师、机构可以创建自主投稿
  return ["parent", "teacher", "organization_admin", "organization_teacher"].includes(
    identity.identityType
  );
}

/**
 * 检查是否可以申请平台代投
 */
export function canApplyAgentSubmission(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // TODO: 检查是否有代投权益
  return true;
}

/**
 * 检查活动是否属于当前身份可访问范围
 */
export function canAccessActivity(
  activity: Activity,
  identity: UserIdentity | null
): boolean {
  // 管理员和运营可以访问所有
  if (!identity) return false;
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // TODO: 检查活动是否在用户购买的年级范围内
  return true;
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