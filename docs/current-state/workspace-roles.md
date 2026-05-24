# 工作台角色权限

## 可见角色

系统支持 6 种身份类型进入工作台：

| identityType | 显示名称 | 说明 |
|--------------|----------|------|
| parent | 家长 | 普通用户，为自己孩子管理作文和投稿 |
| teacher | 个人老师 | 独立老师，管理自己学生 |
| organization_admin | 机构管理员 | 机构负责人，拥有全部机构权限 |
| organization_teacher | 机构老师 | 机构内老师，仅可访问授权班级 |
| operator | 运营人员 | 平台运营，可访问投稿任务池 |
| admin | 管理员 | 平台管理员 |

## 工作台访问规则

### 入口控制

`canAccessWorkspace` 函数控制是否可以进入工作台：

```typescript
// src/lib/permissions/workspace-resource.ts
export function canAccessWorkspace(identity: UserIdentity | null): boolean {
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

### 侧边栏菜单可见性

菜单项根据身份决定是否显示：

| 菜单项 | parent | teacher | organization_admin | organization_teacher | operator | admin |
|--------|--------|--------|-------------------|---------------------|----------|-------|
| 工作台首页 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 班级管理 | - | - | ✓ | ✓ | - | - |
| 学生管理 | - | - | ✓ | ✓ | - | - |
| 我的孩子 | ✓ | - | - | - | - | - |
| 老师管理 | - | - | ✓ | - | - | - |
| 作文管理 | ✓ | ✓ | ✓ | ✓ | - | - |
| 投稿记录 | ✓ | ✓ | ✓ | ✓ | - | - |
| 成长档案 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 批量上传 | - | ✓ | ✓ | ✓ | - | - |
| 数据统计 | - | ✓ | ✓ | ✓ | - | - |
| 我的订单 | ✓ | ✓ | - | - | - | - |
| 机构订单 | - | - | ✓ | - | - | - |

### 页面级权限控制

部分页面有额外的权限校验：

#### 我的订单 `/workspace/orders`
- 可见角色：parent, teacher
- 校验函数：`canAccessOrdersPage`

```typescript
export function canAccessOrdersPage(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return ["parent", "teacher"].includes(identity.identityType);
}
```

#### 机构订单 `/workspace/organization-orders`
- 可见角色：organization_admin
- 校验函数：`canAccessOrganizationOrdersPage`

```typescript
export function canAccessOrganizationOrdersPage(identity: UserIdentity | null): boolean {
  if (!identity) return false;
  return isOrganizationAdmin(identity) && !!identity.organizationId;
}
```

#### 数据统计 `/workspace/statistics`
- 可见角色：teacher, organization_admin, organization_teacher
- 无专门校验函数，通过页面内 `isOrganizationAdmin` + `isTeacher` 组合判断

```typescript
if (!isOrganizationAdmin(currentIdentity) && !isTeacher(currentIdentity)) {
  return <没有权限访问>;
}
```

#### 老师管理 `/workspace/teachers`
- 可见角色：organization_admin
- 无专门校验函数，页面存在但未做路由级别限制

### 资源归属规则

数据按身份隔离，遵循以下规则：

#### 学生归属

| 身份类型 | 学生数据来源 |
|----------|--------------|
| parent | ownerIdentityId === identity.id |
| teacher | ownerIdentityId === identity.id |
| organization_admin | organizationId === 当前机构 |
| organization_teacher | ownerIdentityId === identity.id（授权班级内的学生） |
| operator/admin | 全部（不限制） |

#### 作文归属

作文归属于学生，学生归属规则同上。

#### 投稿记录归属

自主投稿和平台代投记录都按学生归属隔离。

### 班级归属

| 身份类型 | 班级数据来源 |
|----------|--------------|
| teacher | teacherId === identity.id |
| organization_admin | organizationId === 当前机构 |
| organization_teacher | teacherId === identity.id |