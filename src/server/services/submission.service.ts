// ============================================================================
// Submission Service
// 自主投稿业务逻辑层
// ============================================================================

import type { SelfSubmissionListItem } from "@/types";
import { selfSubmissionRepository } from "@/server/repositories";

/**
 * 获取自主投稿列表
 */
export async function getSelfSubmissions(identityId: string): Promise<SelfSubmissionListItem[]> {
  return selfSubmissionRepository.findByIdentity(identityId);
}