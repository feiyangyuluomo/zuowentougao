// ============================================================================
// Workspace 班级数据
// ============================================================================

import type { UserIdentity, Class } from "@/types";
import { isOrganizationAdmin } from "@/lib/permissions";
import { getMockClassesByTeacher, getMockClassesByOrganization } from "@/lib/mock/classes";
import { getMockStudentsByOwner, getMockStudentsByOrganization } from "@/lib/mock/students";

/**
 * 工作台班级列表项
 */
export interface WorkspaceClassItem {
  id: string;
  className: string;
  grade?: string;
  studentCount: number;
  isOrganization: boolean;
}

/**
 * 获取工作台班级列表
 * 根据身份类型返回不同的班级范围
 */
export function getWorkspaceClasses(identity: UserIdentity | null): WorkspaceClassItem[] {
  if (!identity) {
    return [];
  }

  const identityType = identity.identityType;
  const identityId = identity.id;
  const orgId = identity.organizationId;

  // 机构管理员获取机构下所有班级
  if (isOrganizationAdmin(identity) && orgId) {
    const classes = getMockClassesByOrganization(orgId);
    const orgStudents = getMockStudentsByOrganization(orgId);

    return classes.map((cls: Class) => ({
      id: cls.id,
      className: cls.className,
      grade: cls.grade,
      studentCount: orgStudents.filter((s) => s.classId === cls.id).length,
      isOrganization: true,
    }));
  }

  // 个人老师获取自己创建的班级
  if (identityType === "teacher") {
    const classes = getMockClassesByTeacher(identityId);
    const teacherStudents = getMockStudentsByOwner(identityId);

    return classes.map((cls: Class) => ({
      id: cls.id,
      className: cls.className,
      grade: cls.grade,
      studentCount: teacherStudents.filter((s) => s.classId === cls.id).length,
      isOrganization: false,
    }));
  }

  return [];
}