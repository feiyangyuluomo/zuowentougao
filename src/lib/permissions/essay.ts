// ============================================================================
// 作文相关权限函数
// ============================================================================

import type { UserIdentity, Essay, Student, Entitlement } from "@/types";

/**
 * 检查是否可以上传作文
 * 需要登录，且有对应权益
 */
export function canUploadEssay(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  // 家长、老师、机构可以上传作文
  return ["parent", "teacher", "organization_admin", "organization_teacher"].includes(
    identity.identityType
  );
}

/**
 * 检查是否可以管理某个学生的作文
 */
export function canManageStudentEssays(
  student: Student,
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  // 管理员和运营可以管理所有
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // 家长只能管理自己孩子
  if (identity.identityType === "parent") {
    return student.ownerIdentityId === identity.id;
  }

  // 老师只能管理自己学生
  if (["teacher", "organization_teacher"].includes(identity.identityType)) {
    return student.ownerIdentityId === identity.id;
  }

  // 机构管理员可以管理机构内所有学生
  if (identity.identityType === "organization_admin") {
    return student.organizationId === identity.organizationId;
  }

  return false;
}

/**
 * 检查是否可以创建学生
 */
export function canCreateStudent(identity: UserIdentity | null): boolean {
  if (!identity) return false;

  return ["parent", "teacher", "organization_admin", "organization_teacher"].includes(
    identity.identityType
  );
}

/**
 * 检查是否可以删除作文
 * 需要二次确认，这里只做初步判断
 */
export function canDeleteEssay(
  essay: Essay,
  identity: UserIdentity | null
): boolean {
  if (!identity) return false;

  // 只有作文归属身份可以删除
  return essay.ownerIdentityId === identity.id;
}

/**
 * 检查是否可以使用AI改稿功能
 */
export function canUseAIRewrite(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  // 管理员和运营可以无限制使用
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  // TODO: 检查权益和配额
  return true;
}

/**
 * 检查是否可以使用AI推荐活动功能
 */
export function canUseAIRecommend(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  return hasEntitlement(entitlements, "ai_recommend");
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