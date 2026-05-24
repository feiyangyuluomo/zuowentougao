// ============================================================================
// Workspace 作文数据
// ============================================================================

import type { UserIdentity } from "@/types";
import { isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockStudentsByOwner, getMockStudentsByOrganization } from "@/lib/mock/students";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import type { Student } from "@/types/student";

/**
 * 工作台作文列表项
 */
export interface WorkspaceEssayItem {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  grade?: string;
  wordCount?: number;
  status: "draft" | "submitted" | "published";
  createdAt: Date;
}

/**
 * 获取工作台作文列表
 * 根据身份类型返回不同的作文范围
 */
export function getWorkspaceEssays(identity: UserIdentity | null): WorkspaceEssayItem[] {
  if (!identity) {
    return [];
  }

  const identityId = identity.id;
  const orgId = identity.organizationId;

  // 获取符合身份的学生列表
  let students: Student[] = [];

  if (isOrganizationAdmin(identity) && orgId) {
    // 机构管理员：获取机构下所有学生
    students = getMockStudentsByOrganization(orgId);
  } else if (isOrganizationTeacher(identity)) {
    // 机构老师：获取授权班级的学生
    students = getMockStudentsByOwner(identityId);
  } else if (identity.identityType === "teacher") {
    // 个人老师：获取自己创建的学生
    students = getMockStudentsByOwner(identityId);
  } else if (identity.identityType === "parent") {
    // 家长：获取自己名下的孩子
    students = getMockStudentsByOwner(identityId);
  }

  const studentIds = new Set(students.map((s: Student) => s.id));
  const studentMap = new Map(students.map((s: Student) => [s.id, s]));

  // 过滤属于这些学生的作文
  return MOCK_ESSAYS
    .filter((e) => studentIds.has(e.studentId))
    .map((e) => {
      const student = studentMap.get(e.studentId);
      return {
        id: e.id,
        studentId: e.studentId,
        studentName: student?.studentName || "未知",
        title: e.title,
        grade: student?.grade,
        wordCount: e.wordCount,
        status: e.status as "draft" | "submitted" | "published",
        createdAt: e.createdAt,
      };
    });
}