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
 * 检查学生是否属于该身份
 */
function isStudentOwnedByIdentity(student: Student | null, identity: UserIdentity): boolean {
  if (!student) return false;

  // 机构管理员检查
  if (isOrganizationAdmin(identity)) {
    return student.organizationId === identity.organizationId;
  }

  // 机构老师和个人老师检查
  if (isOrganizationTeacher(identity) || identity.identityType === "teacher") {
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

  // 获取学生信息
  const students = getMockStudentsByOwner(identity.id);
  const student = students.find((s: Student) => s.id === studentId) || null;

  // 机构管理员检查
  if (isOrganizationAdmin(identity)) {
    const orgStudents = getMockStudentsByOrganization(identity.organizationId || "");
    return orgStudents.some((s: Student) => s.id === studentId);
  }

  // 机构老师和个人老师：只能访问自己的学生
  if (isOrganizationTeacher(identity) || identity.identityType === "teacher") {
    return students.some((s: Student) => s.id === studentId);
  }

  return false;
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

  // 机构管理员检查作文所属学生是否属于该机构
  if (isOrganizationAdmin(identity) && identity.organizationId) {
    const orgStudents = getMockStudentsByOrganization(identity.organizationId);
    const orgStudentIds = new Set(orgStudents.map((s: Student) => s.id));
    return orgStudentIds.has(essay.studentId);
  }

  // 机构老师和个人老师：检查作文是否属于自己的学生
  if (isOrganizationTeacher(identity) || identity.identityType === "teacher") {
    const teacherStudents = getMockStudentsByOwner(identity.id);
    const teacherStudentIds = new Set(teacherStudents.map((s: Student) => s.id));
    return teacherStudentIds.has(essay.studentId);
  }

  return false;
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

  // 机构管理员检查
  if (isOrganizationAdmin(identity) && identity.organizationId) {
    const orgStudents = getMockStudentsByOrganization(identity.organizationId);
    const orgStudentIds = new Set(orgStudents.map((s: Student) => s.id));
    return orgStudentIds.has(submission.studentId);
  }

  // 机构老师和个人老师：检查投稿是否属于自己的学生
  if (isOrganizationTeacher(identity) || identity.identityType === "teacher") {
    const teacherStudents = getMockStudentsByOwner(identity.id);
    const teacherStudentIds = new Set(teacherStudents.map((s: Student) => s.id));
    return teacherStudentIds.has(submission.studentId);
  }

  return false;
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

  // 机构管理员检查
  if (isOrganizationAdmin(identity) && identity.organizationId) {
    const orgStudents = getMockStudentsByOrganization(identity.organizationId);
    const orgStudentIds = new Set(orgStudents.map((s: Student) => s.id));
    return orgStudentIds.has(task.studentId);
  }

  // 机构老师和个人老师：检查代投是否属于自己的学生
  if (isOrganizationTeacher(identity) || identity.identityType === "teacher") {
    const teacherStudents = getMockStudentsByOwner(identity.id);
    const teacherStudentIds = new Set(teacherStudents.map((s: Student) => s.id));
    return teacherStudentIds.has(task.studentId);
  }

  return false;
}