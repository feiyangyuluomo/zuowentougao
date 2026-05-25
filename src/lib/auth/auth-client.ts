// ============================================================================
// Auth Client Service
// 客户端安全的数据访问层 - 封装 auth 相关的 mock/repository 调用
// 此文件可以在客户端直接 import
// ============================================================================

import type { User, UserIdentity, Entitlement, Membership } from "@/types";

// 直接从 mock 导入（client-safe）
import { getMockAccountByPhone, getMockIdentitiesByPhone, getMockIdentityById } from "@/lib/mock/accounts";
import { getEntitlementsByIdentityId, getMembershipByIdentityId, isNoEntitlementIdentity } from "@/lib/mock/entitlements";

// Repository 导入（client-safe，因为 repository 内部处理 mock/db 切换）
import { userRepository } from "@/server/repositories/user.repository";
import { identityRepository } from "@/server/repositories/identity.repository";
import { entitlementRepository } from "@/server/repositories/entitlement.repository";
import { membershipRepository } from "@/server/repositories/membership.repository";

// 游客权益（无权益）
const EMPTY_ENTITLEMENTS: Entitlement[] = [];

// 运营人员和管理员没有权益
const NO_ENTITLEMENT_TYPES = ["operator", "admin"];

/**
 * 判断身份是否无权益
 */
function checkIsNoEntitlementIdentity(identityType: string): boolean {
  return NO_ENTITLEMENT_TYPES.includes(identityType);
}

/**
 * 根据手机号登录
 * 内部调用 repository 获取用户和身份信息
 */
export async function loginByPhone(phone: string): Promise<{
  user: User | null;
  identities: UserIdentity[];
}> {
  // 获取用户信息
  const user = await userRepository.findByPhone(phone);

  if (!user) {
    return { user: null, identities: [] };
  }

  // 获取身份列表
  const identities = await identityRepository.findByUserId(user.id);

  return { user, identities };
}

/**
 * 获取用户完整上下文（用户 + 身份 + 权益 + 会员）
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

  // 获取第一个身份的权益和会员
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
export async function getIdentityEntitlements(identity: UserIdentity): Promise<Entitlement[]> {
  if (checkIsNoEntitlementIdentity(identity.identityType)) {
    return EMPTY_ENTITLEMENTS;
  }
  return entitlementRepository.findByIdentityId(identity.id);
}

/**
 * 获取身份的会员信息
 */
export async function getIdentityMembership(identity: UserIdentity): Promise<Membership | null> {
  if (checkIsNoEntitlementIdentity(identity.identityType)) {
    return null;
  }
  return membershipRepository.findByIdentityId(identity.id);
}

/**
 * 创建默认身份（当用户无身份时）
 */
export function createDefaultIdentity(userId: string, phone: string): UserIdentity {
  const isOperator = phone === "13800138002";
  const isTeacher = phone === "13800138003";
  const isOrgAdmin = phone === "13800138004";

  let identityType: "parent" | "operator" | "teacher" | "organization_admin";
  if (isOperator) {
    identityType = "operator";
  } else if (isTeacher) {
    identityType = "teacher";
  } else if (isOrgAdmin) {
    identityType = "organization_admin";
  } else {
    identityType = "parent";
  }

  return {
    id: `id-${identityType}-${Date.now()}`,
    userId,
    identityType,
    organizationId: isOrgAdmin ? "org-001" : undefined,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================================================
// Mock 快速登录（直接读 mock，不走 repository）
// ============================================================================

/**

 * Mock 快速登录 - 直接从 mock 获取用户和身份
 * 用于 USE_MOCK=true 时的快速登录
 */
export async function mockLoginByPhone(phone: string): Promise<{
  user: User;
  identities: UserIdentity[];
  entitlements: Entitlement[];
  membership: Membership | null;
  currentIdentity: UserIdentity;
}> {
  const account = getMockAccountByPhone(phone);
  const mockNickname = account?.nickname || "游客";
  const mockUserId = account?.userId || `user-${Date.now()}`;

  const mockUser: User = {
    id: mockUserId,
    nickname: mockNickname,
    phone: phone || "13800138000",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUserId}`,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 获取身份列表
  const mockIdentities = getMockIdentitiesByPhone(phone);

  // 如果没有身份，创建一个默认身份
  if (mockIdentities.length === 0) {
    const defaultIdentity = createDefaultIdentity(mockUser.id, phone);
    mockIdentities.push(defaultIdentity);
  }

  const firstIdentity = mockIdentities[0];
  const entitlements = checkIsNoEntitlementIdentity(firstIdentity.identityType)
    ? EMPTY_ENTITLEMENTS
    : getEntitlementsByIdentityId(firstIdentity.id);
  const membership = checkIsNoEntitlementIdentity(firstIdentity.identityType)
    ? null
    : getMembershipByIdentityId(firstIdentity.id);

  return {
    user: mockUser,
    identities: mockIdentities,
    entitlements,
    membership,
    currentIdentity: firstIdentity,
  };
}

/**
 * Mock 切换身份 - 直接从 mock 获取权益和会员
 */
export function mockSwitchIdentity(
  identities: UserIdentity[],
  newIdentityId: string
): {
  identity: UserIdentity;
  entitlements: Entitlement[];
  membership: Membership | null;
} | null {
  const newIdentity = identities.find((i) => i.id === newIdentityId);
  if (!newIdentity) {
    return null;
  }

  const entitlements = checkIsNoEntitlementIdentity(newIdentity.identityType)
    ? EMPTY_ENTITLEMENTS
    : getEntitlementsByIdentityId(newIdentity.id);
  const membership = checkIsNoEntitlementIdentity(newIdentity.identityType)
    ? null
    : getMembershipByIdentityId(newIdentity.id);

  return { identity: newIdentity, entitlements, membership };
}