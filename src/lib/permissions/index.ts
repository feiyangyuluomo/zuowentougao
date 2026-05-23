// ============================================================================
// 权限函数统一导出
// ============================================================================

// 活动相关权限
export * from "./activity";

// 作文相关权限
export * from "./essay";

// 投稿相关权限
export * from "./submission";

// 会员权益相关权限
export * from "./membership";

// ============================================================================
// 通用权限检查
// ============================================================================

import type { UserIdentity } from "@/types";

/**
 * 检查是否已登录
 */
export function isAuthenticated(identity: UserIdentity | null): boolean {
  return identity !== null;
}

/**
 * 检查是否是游客
 */
export function isGuest(identity: UserIdentity | null): boolean {
  return identity === null;
}

/**
 * 检查是否是管理员
 */
export function isAdmin(identity: UserIdentity | null): boolean {
  return identity?.identityType === "admin";
}

/**
 * 检查是否是运营人员
 */
export function isOperator(identity: UserIdentity | null): boolean {
  return identity?.identityType === "operator";
}

/**
 * 检查是否是机构身份
 */
export function isOrganization(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return ["organization_admin", "organization_teacher"].includes(
    identity.identityType
  );
}

/**
 * 检查是否是老师身份
 */
export function isTeacher(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return ["teacher", "organization_teacher"].includes(identity.identityType);
}

/**
 * 检查是否是机构管理员
 */
export function isOrganizationAdmin(identity: UserIdentity | null): boolean {
  return identity?.identityType === "organization_admin";
}

/**
 * 检查是否是机构老师
 */
export function isOrganizationTeacher(identity: UserIdentity | null): boolean {
  return identity?.identityType === "organization_teacher";
}

/**
 * 检查是否是家长身份
 */
export function isParent(identity: UserIdentity | null): boolean {
  return identity?.identityType === "parent";
}