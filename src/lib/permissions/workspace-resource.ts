// ============================================================================
// Workspace 资源归属权限检查
// ============================================================================

import type { UserIdentity } from "@/types";
import { isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockStudentsByOwner, getMockStudentsByOrganization } from "@/lib/mock/students";
import { getMockClassesByTeacher, getMockClassesByOrganization } from "@/lib/mock/classes";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import { getMockAgentSubmissions } from "@/lib/mock/agent-submissions";
import { selfSubmissionsStore } from "@/lib/mock/self-submissions";
import type { Student } from "@/types/student";

// ============================================================================
// 通用检查函数
// ============================================================================

/**
 * 检查是否是管理员或运营人员
 */
function isAdminOrOperator(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return ["admin", "operator"].includes(identity.identityType);
}

/**
 * 检查是否是家长或个人老师（按 ownerIdentityId 归属）
 */
function isParentOrTeacher(identity: UserIdentity): boolean {
  return ["parent", "teacher"].includes(identity.identityType);
}

/**
 * 获取身份对应的学生列表
 */
function getStudentsForIdentity(identity: UserIdentity): Student[] {
  const orgId = identity.organizationId;

  if (isAdminOrOperator(identity)) {
    // admin/operator 访问全部 - 这里不做限制，由页面层处理
    return [];
  }

  if (isOrganizationAdmin(identity) && orgId) {
    // 机构管理员：获取机构下所有学生
    return getMockStudentsByOrganization(orgId);
  }

  if (isOrganizationTeacher(identity)) {
    // 机构老师：获取授权班级的学生（按 ownerIdentityId 关联）
    return getMockStudentsByOwner(identity.id);
  }

  if (isParentOrTeacher(identity)) {
    // 家长或个人老师：获取自己名下的学生
    return getMockStudentsByOwner(identity.id);
  }

  return [];
}

/**
 * 检查学生是否属于该身份
 */
function isStudentOwnedByIdentity(student: Student | null, identity: UserIdentity): boolean {
  if (!student) return false;

  if (isAdminOrOperator(identity)) return true;

  if (isOrganizationAdmin(identity)) {
    return student.organizationId === identity.organizationId;
  }

  if (isOrganizationTeacher(identity) || isParentOrTeacher(identity)) {
    return student.ownerIdentityId === identity.id;
  }

  return false;
}

// ============================================================================
// 资源归属权限检查
// ============================================================================

/**
 * 检查是否可以访问学生详情
 * @param identity 当前身份
 * @param studentId 学生ID
 */
export function canAccessStudent(identity: UserIdentity | null, studentId: string): boolean {
  if (!identity) return false;

  // admin/operator 允许全部访问
  if (isAdminOrOperator(identity)) return true;

  // 获取身份对应的学生列表
  const students = getStudentsForIdentity(identity);
  return students.some((s: Student) => s.id === studentId);
}

/**
 * 检查是否可以访问班级详情
 * @param identity 当前身份
 * @param classId 班级ID
 */
export function canAccessClass(identity: UserIdentity | null, classId: string): boolean {
  if (!identity) return false;

  // admin/operator 允许全部访问
  if (isAdminOrOperator(identity)) return true;

  // 机构管理员检查
  if (isOrganizationAdmin(identity) && identity.organizationId) {
    const orgClasses = getMockClassesByOrganization(identity.organizationId);
    return orgClasses.some((c) => c.id === classId);
  }

  // 个人老师检查
  if (identity.identityType === "teacher") {
    const teacherClasses = getMockClassesByTeacher(identity.id);
    return teacherClasses.some((c) => c.id === classId);
  }

  // 机构老师检查（授权班级）
  if (isOrganizationTeacher(identity)) {
    const teacherClasses = getMockClassesByTeacher(identity.id);
    return teacherClasses.some((c) => c.id === classId);
  }

  return false;
}

/**
 * 检查是否可以访问作文详情
 * @param identity 当前身份
 * @param essayId 作文ID
 */
export function canAccessEssay(identity: UserIdentity | null, essayId: string): boolean {
  if (!identity) return false;

  // admin/operator 允许全部访问
  if (isAdminOrOperator(identity)) return true;

  // 获取作文
  const essay = MOCK_ESSAYS.find((e) => e.id === essayId);
  if (!essay) return false;

  // 获取身份对应的学生列表
  const students = getStudentsForIdentity(identity);
  const studentIds = new Set(students.map((s: Student) => s.id));

  return studentIds.has(essay.studentId);
}

/**
 * 检查是否可以访问自主投稿记录
 * @param identity 当前身份
 * @param submissionId 投稿记录ID
 */
export function canAccessWorkspaceSubmission(identity: UserIdentity | null, submissionId: string): boolean {
  if (!identity) return false;

  // admin/operator 允许全部访问
  if (isAdminOrOperator(identity)) return true;

  // 查找投稿记录
  const submission = selfSubmissionsStore.find((s) => s.id === submissionId);
  if (!submission) return false;

  // 获取身份对应的学生列表
  const students = getStudentsForIdentity(identity);
  const studentIds = new Set(students.map((s: Student) => s.id));

  return studentIds.has(submission.studentId);
}

/**
 * 检查是否可以访问平台代投记录
 * @param identity 当前身份
 * @param taskId 代投任务ID
 */
export function canAccessAgentSubmission(identity: UserIdentity | null, taskId: string): boolean {
  if (!identity) return false;

  // admin/operator 允许全部访问
  if (isAdminOrOperator(identity)) return true;

  // 查找代投任务
  const task = getMockAgentSubmissions().find((t) => t.id === taskId);
  if (!task) return false;

  // 获取身份对应的学生列表
  const students = getStudentsForIdentity(identity);
  const studentIds = new Set(students.map((s: Student) => s.id));

  return studentIds.has(task.studentId);
}

/**
 * 检查是否可以访问个人订单页
 * 只允许家长和个人老师
 * @param identity 当前身份
 */
export function canAccessOrdersPage(identity: UserIdentity | null): boolean {
  if (!identity) return false;

  // 家长和个人老师可以访问
  return isParentOrTeacher(identity);
}

/**
 * 检查是否可以访问机构订单页
 * 只允许机构管理员且必须有 organizationId
 * @param identity 当前身份
 */
export function canAccessOrganizationOrdersPage(identity: UserIdentity | null): boolean {
  if (!identity) return false;

  // 仅机构管理员可以访问，且必须有所属机构
  return isOrganizationAdmin(identity) && !!identity.organizationId;
}