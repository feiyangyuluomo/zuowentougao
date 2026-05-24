// ============================================================================
// Workspace 统计数据
// ============================================================================

import type { UserIdentity } from "@/types";
import { isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockClassesByTeacher, getMockClassesByOrganization } from "@/lib/mock/classes";
import { getMockStudentsByOwner } from "@/lib/mock/students";
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

  // 机构管理员获取机构下所有班级和学生
  if (isOrganizationAdmin(identity)) {
    const orgId = identity.organizationId;
    const classes = orgId ? getMockClassesByOrganization(orgId) : [];
    const students = getMockStudentsByOwner(identityId);

    return calculateStats(classes.length, students);
  }

  // 机构老师只能看到自己
  if (isOrganizationTeacher(identity)) {
    const students = getMockStudentsByOwner(identityId);
    return calculateStats(0, students);
  }

  // 个人老师可以管理自己的班级和学生
  if (identityType === "teacher") {
    const classes = getMockClassesByTeacher(identityId);
    const students = getMockStudentsByOwner(identityId);
    return calculateStats(classes.length, students);
  }

  // 其他身份无权限
  return { classCount: 0, studentCount: 0, essayCount: 0, submissionCount: 0 };
}

/**
 * 计算统计数据
 */
function calculateStats(classCount: number, students: Student[]): WorkspaceStats {
  const studentCount = students.length;
  // TODO: 后续应该从 StudentListItem 或实际作文数据获取 essayCount
  const essayCount = 0;
  const submissionCount = 0;

  return {
    classCount,
    studentCount,
    essayCount,
    submissionCount,
  };
}