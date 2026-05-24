// ============================================================================
// 权益 Mock 数据 - 按 identityId 获取
// ============================================================================

import type { Entitlement, Membership } from "@/types";

// ============================================================================
// 权益配置
// ============================================================================

export const MOCK_ENTITLEMENTS_BY_IDENTITY: Record<string, Entitlement[]> = {
  "id-parent-001": [
    {
      id: "ent-parent-001",
      identityId: "id-parent-001",
      entitlementType: "view_activity_detail",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-parent-002",
      identityId: "id-parent-001",
      entitlementType: "view_submission_email",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-parent-003",
      identityId: "id-parent-001",
      entitlementType: "ai_rewrite",
      aiQuota: 10,
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-parent-004",
      identityId: "id-parent-001",
      entitlementType: "ai_recommend",
      aiQuota: 20,
      expiredAt: new Date("2026-12-31"),
    },
  ],
  "id-teacher-001": [
    {
      id: "ent-teacher-001",
      identityId: "id-teacher-001",
      entitlementType: "view_activity_detail",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-teacher-002",
      identityId: "id-teacher-001",
      entitlementType: "view_submission_email",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-teacher-003",
      identityId: "id-teacher-001",
      entitlementType: "ai_rewrite",
      aiQuota: 50,
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-teacher-004",
      identityId: "id-teacher-001",
      entitlementType: "ai_recommend",
      aiQuota: 100,
      expiredAt: new Date("2026-12-31"),
    },
  ],
  "id-org-admin-001": [
    {
      id: "ent-org-admin-001",
      identityId: "id-org-admin-001",
      entitlementType: "view_activity_detail",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-org-admin-002",
      identityId: "id-org-admin-001",
      entitlementType: "view_submission_email",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-org-admin-003",
      identityId: "id-org-admin-001",
      entitlementType: "ai_rewrite",
      aiQuota: 200,
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-org-admin-004",
      identityId: "id-org-admin-001",
      entitlementType: "ai_recommend",
      aiQuota: 500,
      expiredAt: new Date("2026-12-31"),
    },
  ],
  "id-org-teacher-001": [
    {
      id: "ent-org-teacher-001",
      identityId: "id-org-teacher-001",
      entitlementType: "view_activity_detail",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-org-teacher-002",
      identityId: "id-org-teacher-001",
      entitlementType: "view_submission_email",
      gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-org-teacher-003",
      identityId: "id-org-teacher-001",
      entitlementType: "ai_rewrite",
      aiQuota: 50,
      expiredAt: new Date("2026-12-31"),
    },
    {
      id: "ent-org-teacher-004",
      identityId: "id-org-teacher-001",
      entitlementType: "ai_recommend",
      aiQuota: 100,
      expiredAt: new Date("2026-12-31"),
    },
  ],
};

// ============================================================================
// 会员信息
// ============================================================================

export const MOCK_MEMBERSHIP_BY_IDENTITY: Record<string, Membership> = {
  "id-parent-001": {
    id: "mem-parent-001",
    identityId: "id-parent-001",
    membershipType: "yearly",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2026-12-31"),
    isLifetime: false,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  "id-teacher-001": {
    id: "mem-teacher-001",
    identityId: "id-teacher-001",
    membershipType: "yearly",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2026-12-31"),
    isLifetime: false,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  "id-org-admin-001": {
    id: "mem-org-admin-001",
    identityId: "id-org-admin-001",
    membershipType: "yearly",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2026-12-31"),
    isLifetime: false,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  "id-org-teacher-001": {
    id: "mem-org-teacher-001",
    identityId: "id-org-teacher-001",
    membershipType: "yearly",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2026-12-31"),
    isLifetime: false,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
};

// ============================================================================
// 获取权益的函数
// ============================================================================

// 获取某身份的权益
export function getEntitlementsByIdentityId(identityId: string): Entitlement[] {
  return MOCK_ENTITLEMENTS_BY_IDENTITY[identityId] || [];
}

// 获取某身份的会员信息
export function getMembershipByIdentityId(identityId: string): Membership | null {
  return MOCK_MEMBERSHIP_BY_IDENTITY[identityId] || null;
}

// 运营人员没有权益
export function isNoEntitlementIdentity(identityType: string): boolean {
  return ["operator", "admin"].includes(identityType);
}