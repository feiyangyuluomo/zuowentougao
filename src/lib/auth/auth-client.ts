// ============================================================================
// Auth Client Service
// 客户端安全的 auth 封装层
//
// 此文件可以在客户端直接 import
//
// 重要：真实 db 登录必须通过 /api/auth/* route 调用 server service，
// 不能从 client 直接 import server 层代码（如 @/server/* 或 prisma）。
// ============================================================================

import type { User, UserIdentity, Entitlement, Membership } from "@/types";

// ============================================================================
// Mock 数据导入（client-safe，因为只是静态数据）
// ============================================================================

import { getMockAccountByPhone, getMockIdentitiesByPhone } from "@/lib/mock/accounts";
import { getEntitlementsByIdentityId, getMembershipByIdentityId, isNoEntitlementIdentity } from "@/lib/mock/entitlements";

// ============================================================================
// 常量
// ============================================================================

// 游客权益（无权益）
const EMPTY_ENTITLEMENTS: Entitlement[] = [];

// 运营人员和管理员没有权益
const NO_ENTITLEMENT_TYPES = ["operator", "admin"];

// ============================================================================
// 内部辅助函数
// ============================================================================

/**
 * 判断身份是否无权益
 */
function checkIsNoEntitlementIdentity(identityType: string): boolean {
  return NO_ENTITLEMENT_TYPES.includes(identityType);
}

/**
 * 创建默认身份（当用户无身份时）
 */
function createDefaultIdentity(userId: string, phone: string): UserIdentity {
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
 *
 * 注意：真实登录必须通过 /api/auth/* route 调用 server service
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

// ============================================================================
// 预留接口（未来通过 API route 调用 server service）
// ============================================================================

/**
 * 根据手机号登录（未来通过 API 调用）
 * TODO: 接入真实登录后，通过 /api/auth/login 调用 server service
 */
export async function loginByPhone(phone: string): Promise<{
  user: User | null;
  identities: UserIdentity[];
}> {
  // 临时实现，后续通过 API route 调用
  const account = getMockAccountByPhone(phone);
  if (!account) {
    return { user: null, identities: [] };
  }
  const identities = getMockIdentitiesByPhone(phone);
  return {
    user: {
      id: account.userId,
      nickname: account.nickname,
      phone: account.phone,
      avatar: undefined,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    identities,
  };
}

/**
 * 获取用户完整上下文（未来通过 API 调用）
 * TODO: 接入真实登录后，通过 /api/auth/profile 调用 server service
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
  const entitlements = checkIsNoEntitlementIdentity(currentIdentity.identityType)
    ? EMPTY_ENTITLEMENTS
    : getEntitlementsByIdentityId(currentIdentity.id);
  const membership = checkIsNoEntitlementIdentity(currentIdentity.identityType)
    ? null
    : getMembershipByIdentityId(currentIdentity.id);
  return { user, identities, entitlements, membership, currentIdentity };
}