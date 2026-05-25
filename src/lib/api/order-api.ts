// ============================================================================
// Order API Client
// 订单相关 API 调用封装
// ============================================================================

import { apiGet } from "./client";

// ============================================================================
// 常量
// ============================================================================

// 订单类型中文名称
export const ORDER_TYPE_LABELS: Record<string, string> = {
  membership: "会员权益",
  ai_rewrite: "AI批改",
  agent_submission: "平台代投",
  manual_review: "人工批改",
  organization_package: "机构套餐",
};

// 支付状态中文名称
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "待支付",
  paid: "已支付",
  refunded: "已退款",
  cancelled: "已取消",
};

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

/**
 * 格式化金额（分 -> 元）
 */
export function formatAmount(fen: number): string {
  return `¥${(fen / 100).toFixed(2)}`;
}