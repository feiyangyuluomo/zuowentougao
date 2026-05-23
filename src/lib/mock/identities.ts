// ============================================================================
// Mock 身份数据
// ============================================================================

import type { UserIdentity, Entitlement, Membership } from "@/types";

export const MOCK_IDENTITIES: UserIdentity[] = [
  {
    id: "id-001",
    userId: "user-001",
    identityType: "parent",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "id-002",
    userId: "user-003",
    identityType: "teacher",
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
];

// 会员权益
export const MOCK_ENTITLEMENTS: Entitlement[] = [
  {
    id: "ent-001",
    identityId: "id-001",
    entitlementType: "view_activity_detail",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    expiredAt: new Date("2026-12-31"),
  },
  {
    id: "ent-002",
    identityId: "id-001",
    entitlementType: "view_submission_email",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    expiredAt: new Date("2026-12-31"),
  },
  {
    id: "ent-003",
    identityId: "id-001",
    entitlementType: "ai_rewrite",
    aiQuota: 10,
    expiredAt: new Date("2026-12-31"),
  },
  {
    id: "ent-004",
    identityId: "id-001",
    entitlementType: "ai_recommend",
    aiQuota: 20,
    expiredAt: new Date("2026-12-31"),
  },
];

// 会员信息
export const MOCK_MEMBERSHIP: Membership = {
  id: "mem-001",
  identityId: "id-001",
  membershipType: "yearly",
  gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  validFrom: new Date("2025-01-01"),
  validTo: new Date("2026-12-31"),
  isLifetime: false,
  status: "active",
};

// 获取身份
export function getMockIdentityById(id: string): UserIdentity | null {
  return MOCK_IDENTITIES.find((i) => i.id === id) || null;
}

// 获取用户的所有身份
export function getMockIdentitiesByUserId(userId: string): UserIdentity[] {
  return MOCK_IDENTITIES.filter((i) => i.userId === userId);
}

// 获取身份的权益
export function getMockEntitlementsByIdentityId(identityId: string): Entitlement[] {
  return MOCK_ENTITLEMENTS.filter((e) => e.identityId === identityId);
}

// 获取身份的会员信息
export function getMockMembershipByIdentityId(identityId: string): Membership | null {
  const membership = MOCK_MEMBERSHIPS.find((m) => m.identityId === identityId);
  return membership || null;
}

// 所有会员信息
export const MOCK_MEMBERSHIPS: Membership[] = [
  MOCK_MEMBERSHIP,
  {
    id: "mem-002",
    identityId: "id-002",
    membershipType: "yearly",
    gradeScope: ["1", "2", "3", "4", "5", "6"],
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2026-12-31"),
    isLifetime: false,
    status: "active",
  },
];