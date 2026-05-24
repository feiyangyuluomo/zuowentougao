# 当前订单系统

## 数据结构

### Order 类型

```typescript
// src/lib/mock/orders.ts
interface Order {
  id: string;
  identityId: string;              // 归属身份ID
  organizationId?: string;          // 机构订单才有
  orderType: OrderType;
  orderTitle: string;
  amount: number;                   // 金额（分）
  paymentStatus: PaymentStatus;
  createdAt: Date;
  paidAt?: Date;                    // 支付时间
  expiredAt?: Date;                 // 到期时间
  relatedStudentName?: string;       // 关联学生
  relatedEssayTitle?: string;       // 关联作文
  remarks?: string;                 // 备注
}
```

### 订单类型

```typescript
type OrderType =
  | "membership"           // 会员权益
  | "ai_rewrite"           // AI批改
  | "agent_submission"      // 平台代投
  | "manual_review"         // 人工批改
  | "organization_package"; // 机构套餐
```

### 支付状态

```typescript
type PaymentStatus = "pending" | "paid" | "refunded" | "cancelled";
```

## 订单页面

### 我的订单 `/workspace/orders`

- **可见角色**：parent, teacher
- **数据获取**：`getOrdersByIdentityId(currentIdentity.id)`
- **过滤规则**：仅返回 `identityId` 匹配且 `organizationId` 为空的订单

**页面功能**：
- 订单统计概览（订单总数、消费总额）
- 订单列表（按时间倒序）
- 订单卡片显示：订单号、下单时间、支付时间、关联学生、关联作文、到期时间、备注、金额
- 订单类型说明

### 机构订单 `/workspace/organization-orders`

- **可见角色**：organization_admin
- **数据获取**：`getOrdersByOrganizationId(currentIdentity.organizationId)`
- **过滤规则**：仅返回 `organizationId` 匹配的订单

**页面功能**：
- 订单统计概览（订单总数、消费总额）
- 订单列表（按时间倒序）
- 订单卡片显示：同「我的订单」

**已移除**：原机构编号字段（机构名称/机构ID）

## Mock 数据

### 家长订单 (id-parent-001)

| 订单号 | 类型 | 标题 | 金额 |
|--------|------|------|------|
| order-001 | membership | 年费会员 | ¥299.00 |
| order-002 | ai_rewrite | AI作文批改 × 5次 | ¥25.00 |
| order-003 | agent_submission | 平台代投服务 × 3篇 | ¥150.00 |
| order-004 | manual_review | 人工精细批改 × 1次 | ¥80.00 |

### 个人老师订单 (id-teacher-001)

| 订单号 | 类型 | 标题 | 金额 |
|--------|------|------|------|
| order-005 | membership | 年费会员（老师） | ¥199.00 |
| order-006 | ai_rewrite | AI作文批改 × 20次套餐 | ¥80.00 |
| order-007 | agent_submission | 平台代投服务 × 10篇套餐 | ¥400.00 |

### 机构管理员订单 (id-org-admin-001)

| 订单号 | 类型 | 标题 | 金额 |
|--------|------|------|------|
| order-008 | organization_package | 机构套餐（50账号版） | ¥2999.00 |
| order-009 | ai_rewrite | AI作文批改充值 × 100次 | ¥350.00 |
| order-010 | agent_submission | 平台代投服务包 × 50篇 | ¥1800.00 |
| order-011 | manual_review | 人工精细批改充值 × 20次 | ¥1200.00 |

## 权限控制

### 入口权限

| 页面 | 函数 | 规则 |
|------|------|------|
| 我的订单 | `canAccessOrdersPage` | `identityType === "parent" \|\| "teacher"` |
| 机构订单 | `canAccessOrganizationOrdersPage` | `isOrganizationAdmin && !!organizationId` |

### 数据隔离

- 个人订单：按 `identityId` 隔离
- 机构订单：按 `organizationId` 隔离

## 辅助函数

```typescript
// 按身份获取个人订单
getOrdersByIdentityId(identityId: string): Order[]

// 按机构获取机构订单
getOrdersByOrganizationId(organizationId: string): Order[]

// 格式化金额（分→元）
formatAmount(fen: number): string
```

## 订单类型标签

| key | 中文名称 |
|-----|----------|
| membership | 会员权益 |
| ai_rewrite | AI批改 |
| agent_submission | 平台代投 |
| manual_review | 人工批改 |
| organization_package | 机构套餐 |

## 支付状态标签

| key | 中文名称 |
|-----|----------|
| pending | 待支付 |
| paid | 已支付 |
| refunded | 已退款 |
| cancelled | 已取消 |