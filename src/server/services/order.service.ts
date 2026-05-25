// ============================================================================
// Order Service
// 订单业务逻辑层
// ============================================================================

import { PaymentStatus } from "@prisma/client";
import { orderRepository } from "@/server/repositories";

// 本地类型定义
interface Order {
  id: string;
  identityId: string;
  organizationId?: string;
  orderType: "membership" | "ai_rewrite" | "agent_submission" | "manual_review" | "organization_package";
  orderTitle: string;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  paidAt?: Date;
  expiredAt?: Date;
  relatedStudentName?: string;
  relatedEssayTitle?: string;
  remarks?: string;
}

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

/**
 * 获取个人订单列表（按 identityId）
 * 只返回个人订单（无 organizationId）
 */
async function getPersonalOrdersByIdentityId(identityId: string): Promise<Order[]> {
  const orders = await orderRepository.findByIdentity(identityId);
  // 过滤掉机构订单，只返回个人订单
  const personalOrders = (orders as unknown as Order[]).filter((o) => !o.organizationId);
  return personalOrders;
}

/**
 * 获取机构订单列表（按 organizationId）
 */
async function getOrgOrdersByOrganizationId(organizationId: string): Promise<Order[]> {
  const orders = await orderRepository.findByOrganization(organizationId);
  return orders as unknown as Order[];
}

/**
 * 获取订单统计摘要
 */
function getOrderSummary(orders: Order[]): {
  totalCount: number;
  totalAmount: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
} {
  const totalCount = orders.length;
  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};

  orders.forEach((o) => {
    byStatus[o.paymentStatus] = (byStatus[o.paymentStatus] || 0) + 1;
    byType[o.orderType] = (byType[o.orderType] || 0) + 1;
  });

  return { totalCount, totalAmount, byStatus, byType };
}

/**
 * 计算订单总金额
 */
function calculateOrderTotal(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + order.amount, 0);
}

/**
 * 格式化金额（分 -> 元）
 */
function formatAmount(fen: number): string {
  return `¥${(fen / 100).toFixed(2)}`;
}

// ============================================================================
// Service Export
// ============================================================================

export const orderService = {
  getPersonalOrders: getPersonalOrdersByIdentityId,
  getOrgOrders: getOrgOrdersByOrganizationId,
  getOrderSummary,
  calculateOrderTotal,
  formatAmount,
};