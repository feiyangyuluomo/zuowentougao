// ============================================================================
// 机构Mock数据
// ============================================================================

import type { Organization, Class } from "@/types";

// ============================================================================
// 机构数据
// ============================================================================

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-001",
    name: "上海创意文学社",
    studentLimit: 100,
    teacherLimit: 10,
    status: "active",
    validFrom: new Date("2024-01-01"),
    expiredAt: new Date("2026-12-31"),
    logo: "/images/organizations/org-001-logo.png",
    description: "专注于青少年创意写作培养的文学社团",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "org-002",
    name: "北京少年文学院",
    studentLimit: 200,
    teacherLimit: 20,
    status: "active",
    validFrom: new Date("2024-01-01"),
    expiredAt: new Date("2026-12-31"),
    logo: "/images/organizations/org-002-logo.png",
    description: "培养未来文学之星",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ============================================================================
// 班级数据
// ============================================================================

export const MOCK_CLASSES: Class[] = [
  // 个人老师班级（无机构）
  {
    id: "cls-self-001",
    organizationId: undefined,
    teacherIdentityId: "id-teacher-001",
    className: "张小明作文班",
    grade: "4",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "cls-self-002",
    organizationId: undefined,
    teacherIdentityId: "id-teacher-001",
    className: "李小雨作文班",
    grade: "2",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  // 机构班级
  {
    id: "cls-001",
    organizationId: "org-001",
    teacherIdentityId: "id-org-teacher-001",
    className: "文学创作初级班",
    grade: "3-4",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "cls-002",
    organizationId: "org-001",
    teacherIdentityId: "id-org-teacher-001",
    className: "文学创作进阶班",
    grade: "5-6",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "cls-003",
    organizationId: "org-001",
    teacherIdentityId: "id-org-teacher-002",
    className: "创意写作兴趣班",
    grade: "2-3",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 获取所有机构
 */
export function getMockOrganizations(): Organization[] {
  return MOCK_ORGANIZATIONS;
}

/**
 * 根据ID获取机构
 */
export function getMockOrganizationById(id: string): Organization | null {
  return MOCK_ORGANIZATIONS.find((o) => o.id === id) || null;
}

/**
 * 获取所有班级
 */
export function getMockClasses(): Class[] {
  return MOCK_CLASSES;
}

/**
 * 根据ID获取班级
 */
export function getMockClassById(id: string): Class | null {
  return MOCK_CLASSES.find((c) => c.id === id) || null;
}

/**
 * 获取机构的班级列表
 */
export function getMockClassesByOrganization(organizationId: string): Class[] {
  return MOCK_CLASSES.filter((c) => c.organizationId === organizationId);
}

/**
 * 获取某个老师管理的班级列表
 */
export function getMockClassesByTeacher(teacherIdentityId: string): Class[] {
  return MOCK_CLASSES.filter((c) => c.teacherIdentityId === teacherIdentityId);
}