// ============================================================================
// 订单 Mock 数据
// ============================================================================

import type { UserIdentity } from "@/types";

// 订单类型
export type OrderType =
  | "membership"           // 会员权益
  | "ai_rewrite"           // AI批改
  | "agent_submission"      // 平台代投
  | "manual_review"         // 人工批改
  | "organization_package"; // 机构套餐

// 支付状态
export type PaymentStatus = "pending" | "paid" | "refunded" | "cancelled";

// 订单记录
export interface Order {
  id: string;
  identityId: string;
  organizationId?: string;        // 机构订单才有
  orderType: OrderType;
  orderTitle: string;
  amount: number;                 // 金额（分）
  paymentStatus: PaymentStatus;
  createdAt: Date;
  paidAt?: Date;                  // 支付时间
  expiredAt?: Date;               // 到期时间
  relatedStudentName?: string;     // 关联学生
  relatedEssayTitle?: string;     // 关联作文
  remarks?: string;               // 备注
}

// ============================================================================
// Mock 订单数据
// ============================================================================

export const MOCK_ORDERS: Order[] = [
  // ===== 家长订单 (id-parent-001) =====
  {
    id: "order-001",
    identityId: "id-parent-001",
    orderType: "membership",
    orderTitle: "年费会员",
    amount: 29900,
    paymentStatus: "paid",
    createdAt: new Date("2025-01-15"),
    paidAt: new Date("2025-01-15"),
    expiredAt: new Date("2026-01-15"),
    remarks: "年费会员权益",
  },
  {
    id: "order-002",
    identityId: "id-parent-001",
    orderType: "ai_rewrite",
    orderTitle: "AI作文批改 × 5次",
    amount: 2500,
    paymentStatus: "paid",
    createdAt: new Date("2025-03-10"),
    paidAt: new Date("2025-03-10"),
    relatedStudentName: "小明",
  },
  {
    id: "order-003",
    identityId: "id-parent-001",
    orderType: "agent_submission",
    orderTitle: "平台代投服务 × 3篇",
    amount: 15000,
    paymentStatus: "paid",
    createdAt: new Date("2025-04-20"),
    paidAt: new Date("2025-04-20"),
    relatedStudentName: "小明",
    relatedEssayTitle: "春天的校园",
  },
  {
    id: "order-004",
    identityId: "id-parent-001",
    orderType: "manual_review",
    orderTitle: "人工精细批改 × 1次",
    amount: 8000,
    paymentStatus: "paid",
    createdAt: new Date("2025-05-01"),
    paidAt: new Date("2025-05-01"),
    relatedStudentName: "小明",
    relatedEssayTitle: "我的妈妈",
  },

  // ===== 个人老师订单 (id-teacher-001) =====
  {
    id: "order-005",
    identityId: "id-teacher-001",
    orderType: "membership",
    orderTitle: "年费会员（老师）",
    amount: 19900,
    paymentStatus: "paid",
    createdAt: new Date("2025-01-10"),
    paidAt: new Date("2025-01-10"),
    expiredAt: new Date("2026-01-10"),
    remarks: "老师年费会员权益",
  },
  {
    id: "order-006",
    identityId: "id-teacher-001",
    orderType: "ai_rewrite",
    orderTitle: "AI作文批改 × 20次套餐",
    amount: 8000,
    paymentStatus: "paid",
    createdAt: new Date("2025-02-15"),
    paidAt: new Date("2025-02-15"),
    relatedStudentName: "学生A",
  },
  {
    id: "order-007",
    identityId: "id-teacher-001",
    orderType: "agent_submission",
    orderTitle: "平台代投服务 × 10篇套餐",
    amount: 40000,
    paymentStatus: "paid",
    createdAt: new Date("2025-03-01"),
    paidAt: new Date("2025-03-01"),
    relatedStudentName: "学生B",
  },

  // ===== 机构管理员订单 (id-org-admin-001) =====
  {
    id: "order-008",
    identityId: "id-org-admin-001",
    organizationId: "org-001",
    orderType: "organization_package",
    orderTitle: "机构套餐（50账号版）",
    amount: 299900,
    paymentStatus: "paid",
    createdAt: new Date("2025-01-01"),
    paidAt: new Date("2025-01-01"),
    expiredAt: new Date("2026-01-01"),
    remarks: "包含50个老师账号 + 500次AI批改 + 100次平台代投",
  },
  {
    id: "order-009",
    identityId: "id-org-admin-001",
    organizationId: "org-001",
    orderType: "ai_rewrite",
    orderTitle: "AI作文批改充值 × 100次",
    amount: 35000,
    paymentStatus: "paid",
    createdAt: new Date("2025-02-20"),
    paidAt: new Date("2025-02-20"),
    remarks: "机构AI批改充值",
  },
  {
    id: "order-010",
    identityId: "id-org-admin-001",
    organizationId: "org-001",
    orderType: "agent_submission",
    orderTitle: "平台代投服务包 × 50篇",
    amount: 180000,
    paymentStatus: "paid",
    createdAt: new Date("2025-03-15"),
    paidAt: new Date("2025-03-15"),
    remarks: "机构平台代投充值",
  },
  {
    id: "order-011",
    identityId: "id-org-admin-001",
    organizationId: "org-001",
    orderType: "manual_review",
    orderTitle: "人工精细批改充值 × 20次",
    amount: 120000,
    paymentStatus: "paid",
    createdAt: new Date("2025-04-01"),
    paidAt: new Date("2025-04-01"),
    remarks: "机构人工批改充值",
  },
];

// ============================================================================
// 获取订单的函数
// ============================================================================

/**
 * 根据 identityId 获取个人订单
 */
export function getOrdersByIdentityId(identityId: string): Order[] {
  return MOCK_ORDERS.filter((o) => o.identityId === identityId && !o.organizationId);
}

/**
 * 根据 organizationId 获取机构订单
 */
export function getOrdersByOrganizationId(organizationId: string): Order[] {
  return MOCK_ORDERS.filter((o) => o.organizationId === organizationId);
}

/**
 * 根据 identityId 和 organizationId 获取机构订单
 * 只有机构管理员可以查看机构订单
 */
export function getOrganizationOrdersByIdentity(identity: UserIdentity): Order[] {
  if (!identity.organizationId) return [];
  // 仅机构管理员可以查看机构订单
  if (identity.identityType !== "organization_admin") return [];
  return getOrdersByOrganizationId(identity.organizationId);
}

/**
 * 格式化金额（分 -> 元）
 */
export function formatAmount(fen: number): string {
  return `¥${(fen / 100).toFixed(2)}`;
}

/**
 * 订单类型中文名称
 */
export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  membership: "会员权益",
  ai_rewrite: "AI批改",
  agent_submission: "平台代投",
  manual_review: "人工批改",
  organization_package: "机构套餐",
};

/**
 * 支付状态中文名称
 */
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "待支付",
  paid: "已支付",
  refunded: "已退款",
  cancelled: "已取消",
};