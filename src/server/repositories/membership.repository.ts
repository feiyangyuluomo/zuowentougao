// ============================================================================
// Membership Repository
// 会员数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Membership } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
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
    return null;
  }
}

// 单例导出
export const membershipRepository = new MembershipRepository();