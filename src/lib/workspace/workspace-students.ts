// ============================================================================
// Workspace 学生数据
// ============================================================================

import type { UserIdentity } from "@/types";
import type { Student } from "@/types/student";
import { getMockStudentsByOwner } from "@/lib/mock/students";

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

  // 获取学生列表（实际应该按身份和权限过滤）
  const students = getMockStudentsByOwner(identityId);

  return students.map((student: Student) => ({
    id: student.id,
    studentName: student.studentName,
    school: student.school,
    grade: student.grade,
    guideTeacher: student.guideTeacher,
    parentPhone: student.parentPhone,
    essayCount: 0, // TODO: 后续从作文表获取
    submissionCount: 0, // TODO: 后续从投稿表获取
  }));
}