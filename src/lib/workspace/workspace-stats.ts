// ============================================================================
// Workspace 统计数据
// ============================================================================

import type { UserIdentity } from "@/types";
import { isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockClassesByTeacher, getMockClassesByOrganization } from "@/lib/mock/classes";
import { getMockStudentsByOwner, getMockStudentsByOrganization } from "@/lib/mock/students";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import { getMockAgentSubmissions } from "@/lib/mock/agent-submissions";
import { selfSubmissionsStore } from "@/lib/mock/self-submissions";
import type { Student } from "@/types/student";

/**
 * 工作台统计数据
 */
export interface WorkspaceStats {
  classCount: number;
  studentCount: number;
  essayCount: number;
  submissionCount: number;
}

/**
 * 获取工作台统计数据
 * 根据身份类型返回不同的数据范围
 */
export function getWorkspaceStats(identity: UserIdentity | null): WorkspaceStats {
  if (!identity) {
    return { classCount: 0, studentCount: 0, essayCount: 0, submissionCount: 0 };
  }

  const identityType = identity.identityType;
  const identityId = identity.id;
  const orgId = identity.organizationId;

  // 获取符合身份的学生列表
  const students = getStudentsForIdentity(identity);
  const studentIds = new Set(students.map((s: Student) => s.id));

  // 获取班级数量
  let classCount = 0;
  if (isOrganizationAdmin(identity) && orgId) {
    classCount = getMockClassesByOrganization(orgId).length;
  } else if (identityType === "teacher") {
    classCount = getMockClassesByTeacher(identityId).length;
  }

  // 计算作文数量：从 MOCK_ESSAYS 统计属于这些学生的作文
  const essayCount = MOCK_ESSAYS.filter((e) => studentIds.has(e.studentId)).length;

  // 计算投稿数量：自主投稿 + 平台代投
  const selfSubmissionCount = selfSubmissionsStore.filter((s) => studentIds.has(s.studentId)).length;
  const agentSubmissionCount = getMockAgentSubmissions().filter((t) => studentIds.has(t.studentId)).length;
  const submissionCount = selfSubmissionCount + agentSubmissionCount;

  return {
    classCount,
    studentCount: students.length,
    essayCount,
    submissionCount,
  };
}

/**
 * 根据身份获取对应的学生列表
 */
function getStudentsForIdentity(identity: UserIdentity): Student[] {
  const identityId = identity.id;
  const orgId = identity.organizationId;

  if (isOrganizationAdmin(identity) && orgId) {
    // 机构管理员：获取机构下所有学生
    return getMockStudentsByOrganization(orgId);
  }

  if (isOrganizationTeacher(identity)) {
    // 机构老师：获取授权班级的学生（暂时按 ownerIdentityId）
    return getMockStudentsByOwner(identityId);
  }

  if (identity.identityType === "teacher") {
    // 个人老师：获取自己创建的学生
    return getMockStudentsByOwner(identityId);
  }

  return [];
}