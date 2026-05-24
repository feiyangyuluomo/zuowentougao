// ============================================================================
// Order Repository
// 订单数据访问层 - 支持 mock/db 双模式
// ============================================================================

import { USE_MOCK } from "@/server/config/data-source";
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
    return null;
  }

  async findByIdentity(identityId: string): Promise<Order[]> {
    if (USE_MOCK) {
      return getOrdersByIdentityId(identityId);
    }
    return [];
  }

  async findByOrganization(organizationId: string): Promise<Order[]> {
    if (USE_MOCK) {
      return getOrdersByOrganizationId(organizationId);
    }
    return [];
  }
}

// 单例导出
export const orderRepository = new OrderRepository();