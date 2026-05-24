// ============================================================================
// Workspace 投稿数据
// ============================================================================

import type { UserIdentity } from "@/types";
import { isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockStudentsByOwner, getMockStudentsByOrganization } from "@/lib/mock/students";
import { selfSubmissionsStore } from "@/lib/mock/self-submissions";
import { MOCK_ACTIVITIES } from "@/lib/mock/activities";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import type { Student } from "@/types/student";

/**
 * 工作台投稿列表项
 */
export interface WorkspaceSubmissionItem {
  id: string;
  essayId: string;
  essayTitle: string;
  studentName: string;
  activityTitle: string;
  status: "pending" | "submitted" | "replied" | "accepted" | "rejected";
  submittedAt: Date;
}

/**
 * 获取工作台投稿列表
 * 根据身份类型返回不同的投稿范围
 */
export function getWorkspaceSubmissions(identity: UserIdentity | null): WorkspaceSubmissionItem[] {
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

  // 过滤属于这些学生的投稿记录
  return selfSubmissionsStore
    .filter((s) => studentIds.has(s.studentId))
    .map((s) => {
      const student = studentMap.get(s.studentId);
      const activity = MOCK_ACTIVITIES.find((a) => a.id === s.activityId);
      const essay = MOCK_ESSAYS.find((e) => e.id === s.essayId);
      return {
        id: s.id,
        essayId: s.essayId,
        essayTitle: essay?.title || "未知作文",
        studentName: student?.studentName || "未知",
        activityTitle: activity?.title || "未知活动",
        status: s.submissionStatus as "pending" | "submitted" | "replied" | "accepted" | "rejected",
        submittedAt: s.createdAt,
      };
    });
}