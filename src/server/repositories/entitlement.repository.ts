// ============================================================================
// Entitlement Repository
// 权益数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Entitlement, EntitlementType } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";
import { getEntitlementsByIdentityId } from "@/lib/mock/entitlements";

// Repository 接口
export interface IEntitlementRepository {
  findByIdentityId(identityId: string): Promise<Entitlement[]>;
}

// Repository 实现
export class EntitlementRepository implements IEntitlementRepository {
  async findByIdentityId(identityId: string): Promise<Entitlement[]> {
    if (USE_MOCK) {
      return getEntitlementsByIdentityId(identityId);
    }
    const entitlements = await prisma.entitlement.findMany({ where: { identityId } });
    return entitlements.map((e) => ({
      id: e.id,
      identityId: e.identityId,
      entitlementType: e.entitlementType as EntitlementType,
      gradeScope: e.gradeScope,
      aiQuota: e.aiQuota ?? undefined,
      expiredAt: e.expiredAt,
    }));
  }
}

// 单例导出
export const entitlementRepository = new EntitlementRepository();