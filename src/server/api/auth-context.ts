// ============================================================================
// Auth Context (Phase 4B.1 临时方案)
// ============================================================================
//
// 注意：这是 Phase 4B.1 临时方案
//
// 当前没有真实 session/JWT/cookie，所以临时从 query/body 获取 identityId。
//
// 真实上线前必须替换为以下方案之一：
// 1. Session + Cookie
// 2. JWT Token
// 3. NextAuth / Supabase Auth
//
// 此临时方案的风险：
// - 前端可以直接传入任意 identityId
// - 无法防止 CSRF 攻击
// - 无法防止身份伪造
// ============================================================================

import { NextRequest } from "next/server";
import { identityRepository } from "@/server/repositories";
import type { UserIdentity } from "@/types";
import { getIdentityIdFromRequest } from "@/server/api/validators";
import { errorResponse, notFoundResponse } from "@/server/api/response";

// ============================================================================
// 允许访问订单 API 的身份类型
// ============================================================================

const ALLOWED_ORDER_IDENTITY_TYPES = ["parent", "teacher"] as const;
const ALLOWED_ORG_ORDER_IDENTITY_TYPES = ["organization_admin"] as const;

/**
 * 从 request 获取身份（临时方案）
 */
export async function getIdentityFromRequest(
  request: NextRequest
): Promise<UserIdentity | null> {
  const identityId = await getIdentityIdFromRequest(request);
  if (!identityId) return null;

  return identityRepository.findById(identityId);
}

/**
 * 从 request 获取身份（不存在则报错）
 */
export async function requireIdentityFromRequest(
  request: NextRequest
): Promise<UserIdentity> {
  const identity = await getIdentityFromRequest(request);
  if (!identity) {
    throw new Error("身份不存在或未提供");
  }
  return identity;
}

/**
 * 校验身份是否可以访问个人订单 API
 * 只允许 parent 和 teacher
 */
export async function requireOrderIdentityFromRequest(request: NextRequest): Promise<UserIdentity> {
  const identity = await requireIdentityFromRequest(request);

  if (!ALLOWED_ORDER_IDENTITY_TYPES.includes(identity.identityType as typeof ALLOWED_ORDER_IDENTITY_TYPES[number])) {
    throw new Error("只允许家长和个人老师访问此接口");
  }

  return identity;
}

/**
 * 校验身份是否可以访问机构订单 API
 * 只允许 organization_admin
 */
export async function requireOrgOrderIdentityFromRequest(request: NextRequest): Promise<UserIdentity> {
  const identity = await requireIdentityFromRequest(request);

  if (!ALLOWED_ORG_ORDER_IDENTITY_TYPES.includes(identity.identityType as typeof ALLOWED_ORG_ORDER_IDENTITY_TYPES[number])) {
    throw new Error("只允许机构管理员访问此接口");
  }

  return identity;
}