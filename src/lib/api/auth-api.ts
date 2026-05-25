// ============================================================================
// Auth API Client
// 认证相关 API 调用封装
// ============================================================================

import { apiPost } from "./client";

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 登录请求参数
 */
export interface LoginRequest {
  phone: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  user: {
    id: string;
    nickname: string;
    phone: string;
    avatar?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  identities: Array<{
    id: string;
    userId: string;
    identityType: string;
    organizationId?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  entitlements: Array<{
    id: string;
    identityId: string;
    entitlementType: string;
    gradeScope?: string[];
    aiQuota?: number;
    expiredAt: string;
  }>;
  membership: {
    id: string;
    identityId: string;
    membershipType: string;
    gradeScope?: string[];
    validFrom: string;
    validTo: string;
    isLifetime: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  currentIdentity: {
    id: string;
    userId: string;
    identityType: string;
    organizationId?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * 切换身份请求参数
 */
export interface SwitchIdentityRequest {
  identityId: string;
}

/**
 * 切换身份响应
 */
export interface SwitchIdentityResponse {
  identity: {
    id: string;
    userId: string;
    identityType: string;
    organizationId?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  entitlements: Array<{
    id: string;
    identityId: string;
    entitlementType: string;
    gradeScope?: string[];
    aiQuota?: number;
    expiredAt: string;
  }>;
  membership: {
    id: string;
    identityId: string;
    membershipType: string;
    gradeScope?: string[];
    validFrom: string;
    validTo: string;
    isLifetime: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

// ============================================================================
// API 函数
// ============================================================================

/**
 * 手机号登录
 * 注意：当前是 mock/test login，不适合生产
 */
export async function loginByPhone(phone: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/auth/login", { phone });
}

/**
 * 切换身份
 * 注意：当前不做真实 session 校验，不适合生产
 */
export async function switchIdentity(
  identityId: string
): Promise<SwitchIdentityResponse> {
  return apiPost<SwitchIdentityResponse>("/auth/identity/switch", {
    identityId,
  });
}