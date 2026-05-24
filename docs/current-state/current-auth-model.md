# 当前认证与身份模型

## 核心概念

### User（用户）

用户是登录凭证的持有者，一个手机号对应一个 User。

```typescript
interface User {
  id: string;
  nickname: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
```

### UserIdentity（身份）

用户可以拥有多个身份，不同身份有不同权限和数据视图。

```typescript
interface UserIdentity {
  id: string;
  userId: string;                  // 关联用户
  identityType: IdentityType;
  organizationId?: string;          // 机构身份才有
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

type IdentityType =
  | "parent"               // 家长
  | "teacher"              // 个人老师
  | "organization_admin"    // 机构管理员
  | "organization_teacher"  // 机构老师
  | "operator"             // 运营人员
  | "admin";               // 管理员
```

### Entitlement（权益）

身份拥有的具体权益，如 AI 批改次数、平台代投次数等。

```typescript
interface Entitlement {
  id: string;
  identityId: string;
  entitlementType: EntitlementType;
  totalCount: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
}

type EntitlementType =
  | "ai_rewrite"           // AI批改
  | "agent_submission"      // 平台代投
  | "manual_review";       // 人工批改
```

### Membership（会员）

身份的会员状态。

```typescript
interface Membership {
  id: string;
  identityId: string;
  memberType: "monthly" | "yearly" | "lifetime";
  status: "active" | "expired" | "cancelled";
  validFrom: Date;
  validTo: Date;
}
```

---

## 认证流程

### 登录

1. 用户输入手机号
2. 调用 `useAuthStore.login(phone)`
3. 根据手机号获取 Mock 账号信息
4. 获取该手机号下的身份列表
5. 如果没有身份，根据手机号规则创建默认身份：
   - `13800138000` → parent（家长）
   - `13800138002` → operator（运营）
   - `13800138003` → teacher（个人老师）
   - `13800138004` → organization_admin（机构管理员）
6. 加载第一个身份的权益和会员信息
7. 设置 `currentIdentity` 为第一个身份

### 身份切换

1. 用户点击头像下拉菜单 → 身份切换
2. 调用 `useAuthStore.switchIdentity(identityId)`
3. 重新加载新身份的权益和会员信息
4. 更新 `currentIdentity`

### 退出登录

调用 `useAuthStore.logout()`，清除所有认证状态。

---

## 身份与权限

### 权限检查函数

| 函数 | 说明 |
|------|------|
| `isAuthenticated(identity)` | 是否已登录 |
| `isAdmin(identity)` | 是否管理员 |
| `isOperator(identity)` | 是否运营 |
| `isParent(identity)` | 是否家长 |
| `isTeacher(identity)` | 是否老师（含机构老师） |
| `isOrganizationAdmin(identity)` | 是否机构管理员 |
| `isOrganizationTeacher(identity)` | 是否机构老师 |
| `isOrganization(identity)` | 是否机构身份 |
| `isGuest(identity)` | 是否游客 |

### 权益加载规则

```typescript
// operator 和 admin 没有权益
function isNoEntitlementIdentity(identityType: IdentityType): boolean {
  return ["operator", "admin"].includes(identityType);
}
```

---

## 数据存储

### 持久化

AuthStore 使用 Zustand 的 `persist` 中间件，数据存储在 `localStorage`，key 为 `auth-storage`。

```typescript
{
  user,
  identities,
  currentIdentity,
  entitlements,
  membership,
  _isAuthenticated,
}
```

### Mock 数据

- 账号数据：`src/lib/mock/accounts.ts`
- 身份数据：`src/lib/mock/identities.ts`
- 权益数据：`src/lib/mock/entitlements.ts`
- 会员数据：`src/lib/mock/memberships.ts`

---

## 工作台访问控制

### canAccessWorkspace

```typescript
function canAccessWorkspace(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return [
    "parent",
    "teacher",
    "organization_admin",
    "organization_teacher",
    "operator",
    "admin",
  ].includes(identity.identityType);
}
```

所有 6 种身份都可以进入工作台。

---

## 权益与会员的关系

| 身份类型 | 权益 | 会员 |
|----------|------|------|
| parent | ✓ | ✓ |
| teacher | ✓ | ✓ |
| organization_admin | ✓ | ✓ |
| organization_teacher | ✓ | ✓ |
| operator | ✗ | ✗ |
| admin | ✗ | ✗ |

运营和管理员是平台内部人员，不享受面向用户的权益服务。