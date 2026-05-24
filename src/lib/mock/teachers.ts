// ============================================================================
// 老师Mock数据
// ============================================================================

import type { UserIdentity, AccountStatus } from "@/types";

export interface TeacherRecord extends UserIdentity {
  teacherName?: string;
  phone?: string;
  wechat?: string;
  studentCount: number;
  essayCount: number;
  joinedAt: Date;
}

export const MOCK_TEACHERS: TeacherRecord[] = [
  {
    id: "teacher-001",
    userId: "user-001",
    identityType: "organization_teacher",
    organizationId: "org-001",
    status: "active",
    teacherName: "张老师",
    phone: "13800138001",
    wechat: "zhanglaoshi",
    studentCount: 15,
    essayCount: 42,
    joinedAt: new Date("2024-01-15"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "teacher-002",
    userId: "user-002",
    identityType: "organization_teacher",
    organizationId: "org-001",
    status: "active",
    teacherName: "李老师",
    phone: "13800138002",
    wechat: "lilaoshi",
    studentCount: 23,
    essayCount: 67,
    joinedAt: new Date("2024-02-20"),
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "teacher-003",
    userId: "user-003",
    identityType: "organization_teacher",
    organizationId: "org-001",
    status: "active",
    teacherName: "王老师",
    phone: "13800138003",
    wechat: "wanglaoshi",
    studentCount: 8,
    essayCount: 19,
    joinedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "teacher-004",
    userId: "user-004",
    identityType: "organization_teacher",
    organizationId: "org-001",
    status: "frozen",
    teacherName: "赵老师",
    phone: "13800138004",
    wechat: "zhaolaoshi",
    studentCount: 12,
    essayCount: 28,
    joinedAt: new Date("2024-01-20"),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-04-15"),
  },
];

// 内存中的老师列表
let teachersStore: TeacherRecord[] = [...MOCK_TEACHERS];

/**
 * 根据机构ID获取老师列表
 */
export function getMockTeachersByOrganization(organizationId: string): TeacherRecord[] {
  return teachersStore.filter((t) => t.organizationId === organizationId);
}

/**
 * 根据ID获取老师详情
 */
export function getMockTeacherById(teacherId: string): TeacherRecord | null {
  return teachersStore.find((t) => t.id === teacherId) || null;
}

/**
 * 创建新老师
 */
export function createMockTeacher(params: {
  organizationId: string;
  teacherName: string;
  phone?: string;
  wechat?: string;
}): TeacherRecord {
  const newTeacher: TeacherRecord = {
    id: `teacher-${Date.now()}`,
    userId: `user-${Date.now()}`,
    identityType: "organization_teacher",
    organizationId: params.organizationId,
    status: "active",
    teacherName: params.teacherName,
    phone: params.phone,
    wechat: params.wechat,
    studentCount: 0,
    essayCount: 0,
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  teachersStore.push(newTeacher);
  return newTeacher;
}

/**
 * 更新老师信息
 */
export function updateMockTeacher(
  teacherId: string,
  updates: Partial<Pick<TeacherRecord, "teacherName" | "phone" | "wechat" | "status">>
): TeacherRecord | null {
  const index = teachersStore.findIndex((t) => t.id === teacherId);
  if (index === -1) return null;

  teachersStore[index] = {
    ...teachersStore[index],
    ...updates,
    updatedAt: new Date(),
  };
  return teachersStore[index];
}

/**
 * 删除老师（软删除 - 改为closed状态）
 */
export function deleteMockTeacher(teacherId: string): boolean {
  const index = teachersStore.findIndex((t) => t.id === teacherId);
  if (index === -1) return false;

  teachersStore[index].status = "closed";
  teachersStore[index].updatedAt = new Date();
  return true;
}

/**
 * 根据老师ID获取学生列表
 */
export function getStudentsByTeacherId(teacherId: string) {
  // 这个需要从学生mock数据中过滤
  // 暂时返回空数组，后续可以关联学生数据
  return [];
}