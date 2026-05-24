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

/**
 * 获取个人订单列表
 */
export async function getOrders(identityId: string): Promise<Order[]> {
  const orders = await orderRepository.findByIdentity(identityId);
  return orders as unknown as Order[];
}

/**
 * 获取机构订单列表
 */
export async function getOrganizationOrders(organizationId: string): Promise<Order[]> {
  const orders = await orderRepository.findByOrganization(organizationId);
  return orders as unknown as Order[];
}

/**
 * 计算订单总金额
 */
export function calculateOrderTotal(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + order.amount, 0);
}

/**
 * 格式化金额（分 -> 元）
 */
export function formatAmount(fen: number): string {
  return `¥${(fen / 100).toFixed(2)}`;
}