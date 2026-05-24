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

/**
 * 检查是否可以访问学生详情
 */
export function canAccessStudent(identity: UserIdentity | null, studentOwnerId: string): boolean {
  if (!identity) return false;

  // 机构管理员可以访问机构下所有学生
  if (isOrganizationAdmin(identity)) {
    return true; // TODO: 应该检查学生是否属于该机构
  }

  // 机构老师只能访问自己负责的学生
  if (isOrganizationTeacher(identity)) {
    return identity.id === studentOwnerId;
  }

  // 个人老师只能访问自己的学生
  if (identity.identityType === "teacher") {
    return identity.id === studentOwnerId;
  }

  return false;
}

/**
 * 检查是否可以访问班级详情
 */
export function canAccessClass(identity: UserIdentity | null, classId: string): boolean {
  if (!identity) return false;

  // 机构管理员可以访问机构下所有班级
  if (isOrganizationAdmin(identity)) {
    return true; // TODO: 应该检查班级是否属于该机构
  }

  // 个人老师只能访问自己创建的班级
  if (identity.identityType === "teacher") {
    return true; // TODO: 应该检查班级是否属于该老师
  }

  return false;
}

/**
 * 检查是否可以访问作文
 */
export function canAccessEssay(identity: UserIdentity | null, essayId: string): boolean {
  if (!identity) return false;

  // 机构管理员可以访问机构下所有作文
  if (isOrganizationAdmin(identity)) {
    return true;
  }

  // 机构老师和 personal 老师需要检查作文归属
  if (isOrganizationTeacher(identity) || identity.identityType === "teacher") {
    return true; // TODO: 应该检查作文是否属于该老师的学生
  }

  return false;
}

/**
 * 检查是否可以访问投稿记录
 */
export function canAccessWorkspaceSubmission(identity: UserIdentity | null, submissionId: string): boolean {
  if (!identity) return false;

  // 机构管理员可以访问机构下所有投稿
  if (isOrganizationAdmin(identity)) {
    return true; // TODO: 应该检查投稿是否属于该机构
  }

  // 机构老师和 personal 老师需要检查投稿归属
  if (isOrganizationTeacher(identity) || identity.identityType === "teacher") {
    return true; // TODO: 应该检查投稿是否属于该老师的学生
  }

  return false;
}