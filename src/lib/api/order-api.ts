// ============================================================================
// Order API Client
// 订单相关 API 调用封装
// ============================================================================

import { apiGet } from "./client";

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 订单
 */
export interface Order {
  id: string;
  identityId: string;
  organizationId?: string;
  orderType: string;
  orderTitle: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  paidAt?: string;
  expiredAt?: string;
  relatedStudentName?: string;
  relatedEssayTitle?: string;
  remarks?: string;
}

/**
 * 订单筛选参数
 */
export interface OrderFilters {
  identityId: string;
}

// ============================================================================
// API 函数
// ============================================================================

/**
 * 获取个人订单列表
 * 只允许 parent 和 teacher
 */
export async function getOrders(identityId: string): Promise<Order[]> {
  return apiGet<Order[]>("/orders", {
    params: { identityId },
  });
}

/**
 * 获取机构订单列表
 * 只允许 organization_admin
 */
export async function getOrganizationOrders(
  identityId: string
): Promise<Order[]> {
  return apiGet<Order[]>("/organization-orders", {
    params: { identityId },
  });
}