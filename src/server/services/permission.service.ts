// ============================================================================
// Permission Service
// 权限校验业务逻辑层
// ============================================================================

import type { UserIdentity } from "@/types";
import {
  isAdmin,
  isOperator,
  isParent,
  isTeacher,
  isOrganizationAdmin,
  isOrganizationTeacher,
  isOrganization,
} from "@/lib/permissions";
import { studentRepository, essayRepository } from "@/server/repositories";

/**
 * 检查是否可以访问工作台
 */
export function canAccessWorkspace(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return isParent(identity) ||
         isTeacher(identity) ||
         isOrganizationAdmin(identity) ||
         isOrganizationTeacher(identity) ||
         isOperator(identity) ||
         isAdmin(identity);
}

/**
 * 检查是否可以访问学生详情
 */
export async function canAccessStudent(
  identity: UserIdentity | null,
  studentId: string
): Promise<boolean> {
  if (!identity) return false;
  if (isAdmin(identity) || isOperator(identity)) return true;

  const students = await studentRepository.findByOwner(identity.id);
  return students.some((s) => s.id === studentId);
}

/**
 * 检查是否可以访问作文详情
 */
export async function canAccessEssay(
  identity: UserIdentity | null,
  essayId: string
): Promise<boolean> {
  if (!identity) return false;
  if (isAdmin(identity) || isOperator(identity)) return true;

  const essays = await essayRepository.findByOwner(identity.id);
  return essays.some((e) => e.id === essayId);
}

/**
 * 检查是否可以访问个人订单页
 */
export function canAccessOrdersPage(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return isParent(identity) || isTeacher(identity);
}

/**
 * 检查是否可以访问机构订单页
 */
export function canAccessOrganizationOrdersPage(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return isOrganizationAdmin(identity) && !!identity.organizationId;
}

/**
 * 检查是否是机构身份
 */
export function isOrganizationIdentity(identity: UserIdentity | null): boolean {
  return isOrganization(identity);
}

/**
 * 获取身份类型名称
 */
export function getIdentityTypeName(identityType: string): string {
  const names: Record<string, string> = {
    parent: "家长",
    teacher: "个人老师",
    organization_admin: "机构管理员",
    organization_teacher: "机构老师",
    operator: "运营人员",
    admin: "管理员",
  };
  return names[identityType] || identityType;
}