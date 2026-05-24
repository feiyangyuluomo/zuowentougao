// ============================================================================
// Workspace 学生数据
// ============================================================================

import type { UserIdentity } from "@/types";
import type { Student } from "@/types/student";
import { isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockStudentsByOwner, getMockStudentsByOrganization } from "@/lib/mock/students";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import { selfSubmissionsStore } from "@/lib/mock/self-submissions";
import { getMockAgentSubmissions } from "@/lib/mock/agent-submissions";

/**
 * 工作台学生列表项
 */
export interface WorkspaceStudentItem {
  id: string;
  studentName: string;
  school?: string;
  grade?: string;
  guideTeacher?: string;
  parentPhone?: string;
  essayCount: number;
  submissionCount: number;
}

/**
 * 获取工作台学生列表
 * 根据身份类型返回不同的学生范围
 */
export function getWorkspaceStudents(identity: UserIdentity | null): WorkspaceStudentItem[] {
  if (!identity) {
    return [];
  }

  const identityId = identity.id;
  const orgId = identity.organizationId;

  // 根据身份获取学生列表
  let students: Student[] = [];

  if (isOrganizationAdmin(identity) && orgId) {
    // 机构管理员：获取机构下所有学生
    students = getMockStudentsByOrganization(orgId);
  } else if (isOrganizationTeacher(identity)) {
    // 机构老师：获取授权班级的学生（暂时按 ownerIdentityId）
    students = getMockStudentsByOwner(identityId);
  } else if (identity.identityType === "teacher") {
    // 个人老师：获取自己创建的学生
    students = getMockStudentsByOwner(identityId);
  }

  const studentIds = new Set(students.map((s: Student) => s.id));

  // 计算作文和投稿数量
  const essayMap = new Map<string, number>();
  const submissionMap = new Map<string, number>();

  // 统计作文数量
  MOCK_ESSAYS.forEach((e) => {
    if (studentIds.has(e.studentId)) {
      essayMap.set(e.studentId, (essayMap.get(e.studentId) || 0) + 1);
    }
  });

  // 统计自主投稿数量
  selfSubmissionsStore.forEach((s) => {
    if (studentIds.has(s.studentId)) {
      submissionMap.set(s.studentId, (submissionMap.get(s.studentId) || 0) + 1);
    }
  });

  // 统计平台代投数量
  getMockAgentSubmissions().forEach((t) => {
    if (studentIds.has(t.studentId)) {
      submissionMap.set(t.studentId, (submissionMap.get(t.studentId) || 0) + 1);
    }
  });

  return students.map((student: Student) => ({
    id: student.id,
    studentName: student.studentName,
    school: student.school,
    grade: student.grade,
    guideTeacher: student.guideTeacher,
    parentPhone: student.parentPhone,
    essayCount: essayMap.get(student.id) || 0,
    submissionCount: submissionMap.get(student.id) || 0,
  }));
}