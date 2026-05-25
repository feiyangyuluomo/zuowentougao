// ============================================================================
// Auth Service
// 认证业务逻辑层 - server 层
// ============================================================================

import type { User, UserIdentity, Entitlement, Membership } from "@/types";
import { userRepository } from "@/server/repositories/user.repository";
import { identityRepository } from "@/server/repositories/identity.repository";
import { entitlementRepository } from "@/server/repositories/entitlement.repository";
import { membershipRepository } from "@/server/repositories/membership.repository";

// 运营人员和管理员没有权益
const NO_ENTITLEMENT_TYPES = ["operator", "admin"];

// 游客权益（无权益）
const EMPTY_ENTITLEMENTS: Entitlement[] = [];

/**
 * 判断身份是否无权益
 */
function isNoEntitlementIdentity(identityType: string): boolean {
  return NO_ENTITLEMENT_TYPES.includes(identityType);
}

/**
 * 根据手机号登录
 * TODO: 未来接入真实登录（密码/验证码/微信）
 */
export async function loginByPhone(phone: string): Promise<{
  user: User | null;
  identities: UserIdentity[];
}> {
  const user = await userRepository.findByPhone(phone);
  if (!user) {
    return { user: null, identities: [] };
  }

  const identities = await identityRepository.findByUserId(user.id);
  return { user, identities };
}

/**
 * 获取用户完整上下文
 */
export async function getUserWithIdentities(phone: string): Promise<{
  user: User | null;
  identities: UserIdentity[];
  entitlements: Entitlement[];
  membership: Membership | null;
  currentIdentity: UserIdentity | null;
}> {
  const { user, identities } = await loginByPhone(phone);

  if (!user || identities.length === 0) {
    return { user: null, identities: [], entitlements: [], membership: null, currentIdentity: null };
  }

  const currentIdentity = identities[0];
  const entitlements = await getIdentityEntitlements(currentIdentity);
  const membership = await getIdentityMembership(currentIdentity);

  return { user, identities, entitlements, membership, currentIdentity };
}

/**
 * 获取身份上下文
 */
export async function getIdentityContext(identityId: string): Promise<{
  identity: UserIdentity | null;
  entitlements: Entitlement[];
  membership: Membership | null;
}> {
  const identity = await identityRepository.findById(identityId);
  if (!identity) {
    return { identity: null, entitlements: [], membership: null };
  }

  const entitlements = await getIdentityEntitlements(identity);
  const membership = await getIdentityMembership(identity);

  return { identity, entitlements, membership };
}

/**
 * 切换身份上下文
 */
export async function switchIdentityContext(identityId: string): Promise<{
  identity: UserIdentity | null;
  entitlements: Entitlement[];
  membership: Membership | null;
}> {
  return getIdentityContext(identityId);
}

/**
 * 获取身份的权益
 */
async function getIdentityEntitlements(identity: UserIdentity): Promise<Entitlement[]> {
  if (isNoEntitlementIdentity(identity.identityType)) {
    return EMPTY_ENTITLEMENTS;
  }
  return entitlementRepository.findByIdentityId(identity.id);
}

/**
 * 获取身份的会员信息
 */
async function getIdentityMembership(identity: UserIdentity): Promise<Membership | null> {
  if (isNoEntitlementIdentity(identity.identityType)) {
    return null;
  }
  return membershipRepository.findByIdentityId(identity.id);
}