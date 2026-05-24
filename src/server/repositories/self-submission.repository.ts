// ============================================================================
// SelfSubmission Repository
// 自主投稿数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { SelfSubmission, SelfSubmissionListItem } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
import { selfSubmissionsStore, getMockSelfSubmissionsByIdentity } from "@/lib/mock/self-submissions";

// Repository 接口
export interface ISelfSubmissionRepository {
  findById(id: string): Promise<SelfSubmission | null>;
  findByIdentity(identityId: string): Promise<SelfSubmissionListItem[]>;
}

// Repository 实现
export class SelfSubmissionRepository implements ISelfSubmissionRepository {
  async findById(id: string): Promise<SelfSubmission | null> {
    if (USE_MOCK) {
      return selfSubmissionsStore.find((s) => s.id === id) || null;
    }
    return null;
  }

  async findByIdentity(identityId: string): Promise<SelfSubmissionListItem[]> {
    if (USE_MOCK) {
      return getMockSelfSubmissionsByIdentity(identityId);
    }
    return [];
  }
}

// 单例导出
export const selfSubmissionRepository = new SelfSubmissionRepository();