// ============================================================================
// 账号 Mock 数据 - 按手机号区分用户和身份
// ============================================================================

import type { User, UserIdentity, Entitlement, Membership } from "@/types";

// ============================================================================
// 用户账号
// ============================================================================

export interface MockAccount {
  phone: string;
  nickname: string;
  userId: string;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    phone: "13800138001",
    nickname: "付费家长小明",
    userId: "user-parent-001",
  },
  {
    phone: "13800138002",
    nickname: "运营小王",
    userId: "user-operator-001",
  },
  {
    phone: "13800138003",
    nickname: "张老师",
    userId: "user-teacher-001",
  },
  {
    phone: "13800138004",
    nickname: "李管理员",
    userId: "user-org-admin-001",
  },
];

// 根据手机号获取用户
export function getMockAccountByPhone(phone: string): MockAccount | undefined {
  return MOCK_ACCOUNTS.find((a) => a.phone === phone);
}

// ============================================================================
// 身份数据
// ============================================================================

export const MOCK_IDENTITIES: UserIdentity[] = [
  // 付费家长
  {
    id: "id-parent-001",
    userId: "user-parent-001",
    identityType: "parent",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  // 运营人员
  {
    id: "id-operator-001",
    userId: "user-operator-001",
    identityType: "operator",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  // 个人老师
  {
    id: "id-teacher-001",
    userId: "user-teacher-001",
    identityType: "teacher",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  // 机构管理员
  {
    id: "id-org-admin-001",
    userId: "user-org-admin-001",
    identityType: "organization_admin",
    organizationId: "org-001",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  // 机构老师 (示例)
  {
    id: "id-org-teacher-001",
    userId: "user-org-admin-001", // 复用同一用户，便于测试
    identityType: "organization_teacher",
    organizationId: "org-001",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

// 根据身份ID获取身份
export function getMockIdentityById(identityId: string): UserIdentity | undefined {
  return MOCK_IDENTITIES.find((i) => i.id === identityId);
}

// 根据 userId 获取身份列表
export function getMockIdentitiesByUserId(userId: string): UserIdentity[] {
  return MOCK_IDENTITIES.filter((i) => i.userId === userId);
}

// 根据手机号获取身份列表
export function getMockIdentitiesByPhone(phone: string): UserIdentity[] {
  const account = getMockAccountByPhone(phone);
  if (!account) return [];
  return getMockIdentitiesByUserId(account.userId);
}