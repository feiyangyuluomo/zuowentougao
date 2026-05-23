import type {
  MembershipType,
  OrderType,
  PaymentStatus,
  AfterSaleType,
  AfterSaleStatus,
  Timestamps,
} from "./common";

// ============================================================================
// 会员相关类型
// ============================================================================

// Re-export Membership from user for backward compatibility
export type { Membership } from "./user";

// 会员权益
export interface MembershipBenefit {
  type: string;
  name: string;
  description: string;
  remaining?: number;
  total?: number;
}

// 会员产品
export interface MembershipProduct {
  id: string;
  type: MembershipType;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  validDays: number;
  gradeScope?: string[];
}

// ============================================================================
// 订单相关类型
// ============================================================================

// 服务订单
export interface ServiceOrder extends Timestamps {
  id: string;
  identityId: string;
  orderType: OrderType;
  amount: number;
  paymentStatus: PaymentStatus;
  relatedEssayId?: string;
  relatedActivityId?: string;
  relatedAgentSubmissionTaskId?: string;
  createdAt: Date;
  paidAt?: Date;
}

// 创建订单参数
export interface CreateOrderParams {
  identityId: string;
  orderType: OrderType;
  amount: number;
  relatedEssayId?: string;
  relatedActivityId?: string;
}

// 订单列表项
export interface OrderListItem {
  id: string;
  orderType: OrderType;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  paidAt?: Date;
  description: string;
}

// ============================================================================
// 优惠券相关类型
// ============================================================================

// 优惠券
export interface Coupon extends Timestamps {
  id: string;
  couponType: string;
  name: string;
  amount?: number;           // 满减金额
  discountRate?: number;     // 折扣率
  minAmount?: number;        // 最低消费
  validFrom: Date;
  validTo: Date;
  status: "active" | "inactive" | "expired";
}

// 优惠券领取记录
export interface CouponRecord extends Timestamps {
  id: string;
  couponId: string;
  identityId: string;
  usedOrderId?: string;
  status: "unused" | "used" | "expired";
  createdAt: Date;
  usedAt?: Date;
}

// ============================================================================
// 售后相关类型
// ============================================================================

// 售后单
export interface AfterSale extends Timestamps {
  id: string;
  orderId: string;
  afterSaleType: AfterSaleType;
  refundAmount?: number;
  status: AfterSaleStatus;
  reason?: string;
  operatorNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// 余额相关类型
// ============================================================================

// 余额账户
export interface BalanceAccount {
  userId: string;
  balance: number;
  updatedAt: Date;
}

// 余额变动记录
export interface BalanceChange {
  id: string;
  userId: string;
  changeType: "recharge" | "refund" | "consume" | "adjust";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reason?: string;
  relatedOrderId?: string;
  createdAt: Date;
}