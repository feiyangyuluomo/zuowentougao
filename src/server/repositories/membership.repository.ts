// ============================================================================
// Membership Repository
// 会员数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Membership, MembershipType, AccountStatus } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";
import { getMembershipByIdentityId } from "@/lib/mock/entitlements";

// Repository 接口
export interface IMembershipRepository {
  findByIdentityId(identityId: string): Promise<Membership | null>;
}

// Repository 实现
export class MembershipRepository implements IMembershipRepository {
  async findByIdentityId(identityId: string): Promise<Membership | null> {
    if (USE_MOCK) {
      return getMembershipByIdentityId(identityId);
    }
    const membership = await prisma.membership.findFirst({ where: { identityId } });
    if (!membership) return null;
    return {
      id: membership.id,
      identityId: membership.identityId,
      membershipType: membership.memberType as MembershipType,
      gradeScope: membership.gradeScope,
      validFrom: membership.validFrom,
      validTo: membership.validTo,
      isLifetime: membership.isLifetime,
      status: membership.status as AccountStatus,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    };
  }
}

// 单例导出
export const membershipRepository = new MembershipRepository();