// ============================================================================
// AI 相关权限函数
// ============================================================================

import type { UserIdentity, Entitlement } from "@/types";

/**
 * 检查是否可以使用 AI 改稿
 */
export function canUseAIRewrite(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  // 运营和管理员可以使用所有 AI 功能
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  return hasEntitlement(entitlements, "ai_rewrite");
}

/**
 * 检查是否可以使用 AI 推荐活动
 */
export function canUseAIRecommend(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  if (!identity) return false;

  // 运营和管理员可以使用所有 AI 功能
  if (["operator", "admin"].includes(identity.identityType)) {
    return true;
  }

  return hasEntitlement(entitlements, "ai_recommend");
}

/**
 * 检查 AI 权益是否还有剩余次数
 */
export function hasAIRemainingQuota(entitlements: Entitlement[]): boolean {
  const aiRewrite = entitlements.find((e) => e.entitlementType === "ai_rewrite");
  const aiRecommend = entitlements.find((e) => e.entitlementType === "ai_recommend");

  // 如果没有限制次数，则认为有剩余
  if (!aiRewrite?.aiQuota && !aiRecommend?.aiQuota) {
    return true;
  }

  // TODO: 实际检查已使用次数
  return true;
}

/**
 * 检查是否可以进行 AI 标题建议
 */
export function canUseAITitleSuggestion(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  return canUseAIRewrite(identity, entitlements);
}

/**
 * 检查是否可以进行 AI 投稿建议
 */
export function canUseAISubmissionAdvice(
  identity: UserIdentity | null,
  entitlements: Entitlement[]
): boolean {
  return canUseAIRecommend(identity, entitlements);
}

// ============================================================================
// 辅助函数
// ============================================================================

function hasEntitlement(
  entitlements: Entitlement[],
  type: Entitlement["entitlementType"]
): boolean {
  return entitlements.some((e) => e.entitlementType === type);
}