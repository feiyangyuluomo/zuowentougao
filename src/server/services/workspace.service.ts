// ============================================================================
// Workspace Service
// 工作台业务逻辑层
// ============================================================================

import type { UserIdentity } from "@/types";
import { isTeacher, isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import {
  studentRepository,
  classRepository,
  essayRepository,
  selfSubmissionRepository,
  agentSubmissionRepository,
} from "@/server/repositories";

// 工作台统计数据
export interface WorkspaceStats {
  studentCount: number;
  classCount: number;
  essayCount: number;
  submissionCount: number;
}

export interface WorkspaceClass {
  id: string;
  className: string;
  grade?: string;
  studentCount: number;
  essayCount: number;
  submissionCount: number;
}

export interface StudentInfo {
  id: string;
  studentName: string;
  school?: string;
  grade?: string;
  avatar?: string;
}

/**
 * 获取工作台统计数据
 */
export async function getWorkspaceStats(identity: UserIdentity | null): Promise<WorkspaceStats> {
  if (!identity) {
    return { studentCount: 0, classCount: 0, essayCount: 0, submissionCount: 0 };
  }

  // 获取学生数量
  const students = await studentRepository.findByOwner(identity.id);
  const studentCount = students.length;

  // 获取班级数量
  let classCount = 0;
  const isOrgAdmin = isOrganizationAdmin(identity);
  const isOrgTeacher = isOrganizationTeacher(identity);
  const isTeacherRole = isTeacher(identity);

  if (isOrgAdmin && identity.organizationId) {
    const classes = await classRepository.findByOrganization(identity.organizationId);
    classCount = classes.length;
  } else if (isOrgTeacher || isTeacherRole) {
    const classes = await classRepository.findByTeacher(identity.id);
    classCount = classes.length;
  }

  // 获取作文数量
  const essays = await essayRepository.findByOwner(identity.id);
  const essayCount = essays.length;

  // 获取投稿数量（自主投稿 + 平台代投）
  const selfSubmissions = await selfSubmissionRepository.findByIdentity(identity.id);
  const agentSubmissions = await agentSubmissionRepository.findByIdentity(identity.id);
  const submissionCount = selfSubmissions.length + agentSubmissions.length;

  return {
    studentCount,
    classCount,
    essayCount,
    submissionCount,
  };
}

/**
 * 获取工作台班级列表
 */
export async function getWorkspaceClasses(identity: UserIdentity | null): Promise<WorkspaceClass[]> {
  if (!identity) return [];

  const isOrgAdmin = isOrganizationAdmin(identity);
  const isOrgTeacher = isOrganizationTeacher(identity);
  const isTeacherRole = isTeacher(identity);

  let classes: Awaited<ReturnType<typeof classRepository.findByOrganization>> = [];

  if (isOrgAdmin && identity.organizationId) {
    classes = await classRepository.findByOrganization(identity.organizationId);
  } else if (isOrgTeacher || isTeacherRole) {
    classes = await classRepository.findByTeacher(identity.id);
  }

  // 获取每个班级的学生数和作文数
  const classInfos: WorkspaceClass[] = [];
  for (const cls of classes) {
    const classStudents = await studentRepository.findByClass(cls.id);
    const studentIds = classStudents.map((s) => s.id);
    const essays = await essayRepository.findByOwner(identity.id);
    const classEssays = essays.filter((e) => studentIds.includes(e.studentId));

    classInfos.push({
      id: cls.id,
      className: cls.className,
      grade: cls.grade || undefined,
      studentCount: classStudents.length,
      essayCount: classEssays.length,
      submissionCount: 0, // 简化处理
    });
  }

  return classInfos;
}

/**
 * 获取工作台学生列表
 */
export async function getWorkspaceStudents(identity: UserIdentity | null): Promise<StudentInfo[]> {
  if (!identity) return [];

  const isOrgAdmin = isOrganizationAdmin(identity);
  const isOrgTeacher = isOrganizationTeacher(identity);
  const isTeacherRole = isTeacher(identity);

  let students: Awaited<ReturnType<typeof studentRepository.findByOwner>> = [];

  if (isOrgAdmin && identity.organizationId) {
    students = await studentRepository.findByOrganization(identity.organizationId);
  } else if (isOrgTeacher || isTeacherRole || identity.identityType === "parent") {
    students = await studentRepository.findByOwner(identity.id);
  }

  return students.map((s) => ({
    id: s.id,
    studentName: s.studentName,
    school: s.school || undefined,
    grade: s.grade || undefined,
    avatar: s.avatar || undefined,
  }));
}