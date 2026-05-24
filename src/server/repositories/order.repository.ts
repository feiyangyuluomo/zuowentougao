// ============================================================================
// Order Repository
// 订单数据访问层 - 支持 mock/db 双模式
// ============================================================================

import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";
import { MOCK_ORDERS, getOrdersByIdentityId, getOrdersByOrganizationId } from "@/lib/mock/orders";
import type { OrderType, PaymentStatus } from "@prisma/client";

// 本地类型定义（兼容 mock 和未来 db 模式）
interface Order {
  id: string;
  identityId: string;
  organizationId?: string;
  orderType: OrderType;
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

// Repository 接口
export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByIdentity(identityId: string): Promise<Order[]>;
  findByOrganization(organizationId: string): Promise<Order[]>;
}

// Repository 实现
export class OrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    if (USE_MOCK) {
      return MOCK_ORDERS.find((o) => o.id === id) || null;
    }
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return null;
    return {
      id: order.id,
      identityId: order.identityId,
      organizationId: order.organizationId ?? undefined,
      orderType: order.orderType as OrderType,
      orderTitle: order.orderTitle,
      amount: order.amount,
      paymentStatus: order.paymentStatus as PaymentStatus,
      createdAt: order.createdAt,
      paidAt: order.paidAt ?? undefined,
      expiredAt: order.expiredAt ?? undefined,
      relatedStudentName: order.relatedStudentName ?? undefined,
      relatedEssayTitle: order.relatedEssayTitle ?? undefined,
      remarks: order.remarks ?? undefined,
    };
  }

  async findByIdentity(identityId: string): Promise<Order[]> {
    if (USE_MOCK) {
      return getOrdersByIdentityId(identityId);
    }
    const orders = await prisma.order.findMany({ where: { identityId } });
    return orders.map((o) => ({
      id: o.id,
      identityId: o.identityId,
      organizationId: o.organizationId ?? undefined,
      orderType: o.orderType as OrderType,
      orderTitle: o.orderTitle,
      amount: o.amount,
      paymentStatus: o.paymentStatus as PaymentStatus,
      createdAt: o.createdAt,
      paidAt: o.paidAt ?? undefined,
      expiredAt: o.expiredAt ?? undefined,
      relatedStudentName: o.relatedStudentName ?? undefined,
      relatedEssayTitle: o.relatedEssayTitle ?? undefined,
      remarks: o.remarks ?? undefined,
    }));
  }

  async findByOrganization(organizationId: string): Promise<Order[]> {
    if (USE_MOCK) {
      return getOrdersByOrganizationId(organizationId);
    }
    const orders = await prisma.order.findMany({ where: { organizationId } });
    return orders.map((o) => ({
      id: o.id,
      identityId: o.identityId,
      organizationId: o.organizationId ?? undefined,
      orderType: o.orderType as OrderType,
      orderTitle: o.orderTitle,
      amount: o.amount,
      paymentStatus: o.paymentStatus as PaymentStatus,
      createdAt: o.createdAt,
      paidAt: o.paidAt ?? undefined,
      expiredAt: o.expiredAt ?? undefined,
      relatedStudentName: o.relatedStudentName ?? undefined,
      relatedEssayTitle: o.relatedEssayTitle ?? undefined,
      remarks: o.remarks ?? undefined,
    }));
  }
}

// 单例导出
export const orderRepository = new OrderRepository();