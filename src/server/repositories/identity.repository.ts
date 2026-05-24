// ============================================================================
// Identity Repository
// 身份数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { UserIdentity, AccountStatus } from "@/types";
import { IdentityType } from "@prisma/client";
import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";

// Mock 数据
interface MockIdentity extends UserIdentity {}

const mockIdentitiesStore: MockIdentity[] = [
  {
    id: "id-parent-001",
    userId: "user-parent-001",
    identityType: "parent",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "id-operator-001",
    userId: "user-operator-001",
    identityType: "operator",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "id-teacher-001",
    userId: "user-teacher-001",
    identityType: "teacher",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "id-org-admin-001",
    userId: "user-org-admin-001",
    identityType: "organization_admin",
    organizationId: "org-001",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "id-org-teacher-001",
    userId: "user-org-teacher-001",
    identityType: "organization_teacher",
    organizationId: "org-001",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

// Repository 接口
export interface IIdentityRepository {
  findById(id: string): Promise<UserIdentity | null>;
  findByUserId(userId: string): Promise<UserIdentity[]>;
}

// Repository 实现 - mock/db 双模式
export class IdentityRepository implements IIdentityRepository {
  async findById(id: string): Promise<UserIdentity | null> {
    if (USE_MOCK) {
      return mockIdentitiesStore.find((i) => i.id === id) || null;
    }
    const identity = await prisma.userIdentity.findUnique({ where: { id } });
    if (!identity) return null;
    return {
      id: identity.id,
      userId: identity.userId,
      identityType: identity.identityType as IdentityType,
      organizationId: identity.organizationId ?? undefined,
      status: identity.status as AccountStatus,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,
    };
  }

  async findByUserId(userId: string): Promise<UserIdentity[]> {
    if (USE_MOCK) {
      return mockIdentitiesStore.filter((i) => i.userId === userId);
    }
    const identities = await prisma.userIdentity.findMany({ where: { userId } });
    return identities.map((identity) => ({
      id: identity.id,
      userId: identity.userId,
      identityType: identity.identityType as IdentityType,
      organizationId: identity.organizationId ?? undefined,
      status: identity.status as AccountStatus,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,
    }));
  }
}

// 单例导出
export const identityRepository = new IdentityRepository();