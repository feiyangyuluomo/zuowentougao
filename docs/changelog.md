# 更新日志

## 2026-05-25 Phase 4B.2 用户资产关联与跨流程状态打通

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/app/api/students/route.ts` | GET/POST /api/students |
| `src/app/api/essays/route.ts` | GET/POST /api/essays |
| `src/lib/api/student-api.ts` | 学生 API 客户端封装 |
| `src/lib/api/essay-api.ts` | 作文 API 客户端封装 |

### Repository 增强

| 文件 | 新增方法 |
|------|----------|
| `src/server/repositories/student.repository.ts` | `create()` |
| `src/server/repositories/essay.repository.ts` | `create()` |

### 页面修改

| 页面 | 修改内容 |
|------|----------|
| `/agent-submissions/new` | 学生/作文创建改用 API，自动刷新列表 |
| `/agent-submissions/new` | 支持 URL 参数 `essayId` 自动选中作文 |
| `/agent-submissions/new` | EssaySelectOrCreate 增加搜索框 |
| `/ai-assistant` | 保存作文改用 `createEssay()` API |
| `/essay-revision` | 移除 MOCK_ESSAYS，改用 `getEssays()` API |
| `/essay-revision` | "查看我的作文"链接改为 `/workspace/essays` |

### AI 助手 → 平台代投参数传递

| 场景 | 传递参数 |
|------|----------|
| 有 `savedEssayId` | `activity` + `essayId`（只传 ID） |
| 无 `essayId` | `activity` + `title` + `content`（fallback） |

### 验证结果

- type-check: 通过
- build: 通过

---

## 2026-05-25 Phase 4B.1 API 安全加固 + 页面逐步切 API

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/server/api/validators.ts` | 基础参数校验函数 |
| `src/server/api/auth-context.ts` | 临时身份上下文（Phase 4B.1 临时方案） |

### 功能改进

#### 1. validators.ts 校验函数
- `requireString()` - 要求字符串
- `requireIdentityId()` - 要求 identityId
- `requirePhone()` - 要求手机号（11位数字）
- `parseBooleanQuery()` - 解析布尔值 query
- `parseStringArrayQuery()` - 解析字符串数组 query（支持逗号分隔）
- `getIdentityIdFromRequest()` - 从 request 获取 identityId
- `getPhoneFromRequest()` - 从 request 获取手机号

#### 2. auth-context.ts 临时身份方案
- `getIdentityFromRequest()` - 获取身份（临时）
- `requireIdentityFromRequest()` - 要求身份存在
- `requireOrderIdentityFromRequest()` - 校验 parent/teacher
- `requireOrgOrderIdentityFromRequest()` - 校验 organization_admin
- **注意**：这是临时方案，真实上线前必须替换为 session/JWT/cookie

#### 3. API 加固

| API | 加固内容 |
|-----|---------|
| `POST /api/auth/login` | phone 校验（requirePhone） |
| `POST /api/auth/identity/switch` | identityId 校验（requireIdentityId） |
| `GET /api/activities` | query 参数用 validators 解析 |
| `GET /api/activities/[id]` | id 校验（requireIdentityId） |
| `GET /api/orders` | auth-context 校验身份类型 |
| `GET /api/organization-orders` | auth-context 校验身份类型 |

#### 4. 页面切 API

| 页面 | 切换 |
|------|------|
| `/workspace/orders` | 改用 `order-api.ts` → `/api/orders` |
| `/workspace/organization-orders` | 改用 `order-api.ts` → `/api/organization-orders` |

### 安全说明

> **当前 auth-context 是 Phase 4B.1 临时方案**
> - 前端仍传入 identityId（可被伪造）
> - 无真实 session/JWT/cookie 校验
> - 真实上线前必须替换

### 验证结果

- type-check: 通过
- prisma generate: 通过
- build: 通过

---

## 2026-05-25 Phase 4B API Route 最小后端接口

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/server/api/response.ts` | 统一响应格式 |
| `src/lib/api/client.ts` | 客户端 API 封装 |
| `src/lib/api/auth-api.ts` | 认证 API 封装 |
| `src/lib/api/activity-api.ts` | 活动 API 封装 |
| `src/lib/api/order-api.ts` | 订单 API 封装 |
| `src/app/api/auth/login/route.ts` | POST /api/auth/login |
| `src/app/api/auth/identity/switch/route.ts` | POST /api/auth/identity/switch |
| `src/app/api/activities/route.ts` | GET /api/activities |
| `src/app/api/activities/[id]/route.ts` | GET /api/activities/[id] |
| `src/app/api/orders/route.ts` | GET /api/orders |
| `src/app/api/organization-orders/route.ts` | GET /api/organization-orders |
| `src/server/dev-test/api-smoke-test.ts` | API smoke test 脚本 |

### 新增脚本

```bash
npm run api:smoke-test  # 运行 API smoke test
```

### API Route 清单

| 路由 | 方法 | 调用 service | 说明 |
|------|------|-------------|------|
| `/api/auth/login` | POST | `auth.service.getUserWithIdentities` | 手机号 mock 登录 |
| `/api/auth/identity/switch` | POST | `auth.service.switchIdentityContext` | 切换身份上下文 |
| `/api/activities` | GET | `activity.service.filterActivities` | 筛选活动列表 |
| `/api/activities/[id]` | GET | `activity.service.getActivityById` | 活动详情 |
| `/api/orders` | GET | `order.service.getPersonalOrders` | 个人订单 |
| `/api/organization-orders` | GET | `order.service.getOrgOrders` | 机构订单 |

### 页面切换

- `/activities` - 页面改用 `activity-api.ts` → `/api/activities`

### 安全说明

> **当前 auth API 是 mock/test login，不适合生产**
> - 不做验证码/密码/微信登录
> - 不做 session/JWT/cookie 校验
> - 真实上线前必须加入身份校验和权限校验

### 验证结果

- type-check: 通过
- prisma generate: 通过
- build: 通过 (32 个页面 + 6 个 API route)

---

## 2026-05-25 Phase 4A.4 Auth 数据源切换验证

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/lib/auth/auth-client.ts` | 客户端安全的 auth 封装层 |
| `src/server/services/auth.service.ts` | Auth 业务逻辑层（server 层） |

### 功能改进

#### 1. auth-client.ts 职责
- `src/lib/auth/auth-client.ts`
- 提供 `loginByPhone()` / `getUserWithIdentities()` / `getIdentityContext()` / `switchIdentityContext()`
- 提供 `mockLoginByPhone()` / `mockSwitchIdentity()` - Mock 快速登录
- 封装 repository 调用，客户端可直接 import
- 内部调用 `userRepository` / `identityRepository` / `entitlementRepository` / `membershipRepository`

#### 2. auth.service.ts 职责
- `src/server/services/auth.service.ts`
- Server 层认证业务逻辑
- 未来真实登录的接入点（当前为 mock）
- 不直接在客户端调用（server-only）

#### 3. auth-store.ts 改造
- `src/stores/auth-store.ts`
- 移除对 `@/lib/mock/accounts` 和 `@/lib/mock/entitlements` 的直接 import
- 改用 `@/lib/auth/auth-client` 中的 `mockLoginByPhone()` / `mockSwitchIdentity()`
- 保留 Zustand / persist / mock 手机号登录 / switchIdentity

### 数据链路

```
auth-store (client)
  ↓ 调用
auth-client (client-safe)
  ↓ 调用
userRepository / identityRepository / entitlementRepository / membershipRepository
  ↓
USE_MOCK=true 读 mock
USE_MOCK=false 读 db
```

### 验证结果

- type-check: 通过
- prisma generate: 通过
- build: 通过 (32 个页面)

---

## 2026-05-25 Phase 4A.3 Service 层实现 + 页面切换验证

### 功能改进

#### 1. Order Service 增强
- **文件**：`src/server/services/order.service.ts`
- 新增 `getPersonalOrders(identity)` - 获取个人订单列表（过滤机构订单）
- 新增 `getOrgOrders(organizationId)` - 获取机构订单列表
- 新增 `getOrderSummary(orders)` - 获取订单统计摘要
- 新增 `ORDER_TYPE_LABELS` / `PAYMENT_STATUS_LABELS` 常量
- 移除与 permission.service 重复的 `canAccessOrdersPage` / `canAccessOrganizationOrdersPage`

#### 2. Activity Service 新建
- **文件**：`src/server/services/activity.service.ts`
- 新增 `getActivityList()` - 获取活动列表
- 新增 `filterActivities(filters)` - 筛选活动
- 新增 `getActivityById(id)` - 获取活动详情
- **文件**：`src/server/services/index.ts` - 新增导出

#### 3. 页面切换到 Service 层
- `/workspace/orders` - 从 mock 切换到 `order.service.ts`
  - 移除 `getOrdersByIdentityId` mock 调用
  - 改用 `getPersonalOrders(currentIdentity)` 异步获取
  - 添加 loading 状态
- `/activities` - 从 mock 切换到 `activity.service.ts`
  - 移除 `filterMockActivities` mock 调用
  - 改用 `filterActivities(filterParams)` 异步获取
  - 添加 loading 状态

#### 4. 依赖导入调整
- 移除 `@/lib/permissions` 中不存在的 `isParentOrTeacher` 引用
- 权限检查逻辑直接内联到 service 中

---

## 2026-05-25 Phase 4A.2 数据库种子数据 + Smoke Test

### 新增文件

| 文件 | 说明 |
|------|------|
| `prisma/seed.ts` | 数据库种子数据脚本 |
| `src/server/dev-test/db-smoke-test.ts` | 数据库 smoke test 脚本 |

### 新增脚本

```bash
npm run db:seed       # 填充种子数据
npm run db:smoke-test # 运行数据库 smoke test
```

### Seed 覆盖数据

| 数据类型 | 数量 | 说明 |
|----------|------|------|
| users | 5 | 13800138001-05 |
| organizations | 1 | org-001 |
| user_identities | 5 | parent/operator/teacher/org_admin/org_teacher |
| classes | 2 | 老师班级 + 机构班级 |
| students | 3 | 家长/老师/机构学生各1 |
| publishers | 2 | 杂志 + 组委会 |
| activities | 3 | 夏季刊/作文大赛/长期征稿 |
| essays | 3 | 每学生1篇 |
| essay_versions | 3 | 每作文1个版本 |
| entitlements | 16 | 每身份4条 |
| memberships | 4 | 除operator外 |
| orders | 5 | 家长3条 + 老师2条 |
| self_submissions | 2 | 家长1 + 老师1 |
| agent_submission_tasks | 1 | 家长1 |

### Smoke Test 检查项

7 个 repository 方法：
1. `userRepository.findByPhone()`
2. `identityRepository.findByUserId()`
3. `studentRepository.findByOwner()`
4. `activityRepository.findAll()`
5. `orderRepository.findByIdentity()`
6. `entitlementRepository.findByIdentityId()`
7. `membershipRepository.findByIdentityId()`

### 运行方法

```bash
# 1. 设置环境变量 .env
DATABASE_URL=postgresql://...
USE_MOCK=false

# 2. 同步 schema 到数据库
npm run db:push

# 3. 填充种子数据
npm run db:seed

# 4. 运行 smoke test
npm run db:smoke-test
```

---

## 2026-05-24 Phase 4A 基础设施加固

### 功能改进

#### 1. Repository 数据库分支完善
- **问题**：USE_MOCK=false 时 repository 返回 null/[]，无法真正查询数据库
- **优化**：为以下 9 个 repository 添加完整的 Prisma 查询分支
- **文件**：`src/server/repositories/*.ts`

| Repository | 方法 |
|------------|------|
| user.repository.ts | findById, findByPhone |
| identity.repository.ts | findById, findByUserId |
| student.repository.ts | findById, findByOwner, findByOrganization, findByClass |
| class.repository.ts | findById, findByOrganization, findByTeacher |
| essay.repository.ts | findById, findByOwner, findByStudent, findVersions |
| activity.repository.ts | findById, findAll, filter |
| order.repository.ts | findById, findByIdentity, findByOrganization |
| entitlement.repository.ts | findByIdentityId |
| membership.repository.ts | findByIdentityId |

#### 2. 数据埋点基础设施
- 25 种事件类型完整定义
- 全站页面埋点接入（PAGE_VIEW）
- 事件常量统一管理

---

## 2026-05-24 Phase 2 运营任务池增强

### 功能改进

#### 1. 接单快速模式
- **问题**：原本接单后需要经过"已分配→审核作文→筛选活动→准备投稿→投稿中→已投稿"等多个步骤
- **优化**：接单直接跳转到"已投稿"状态，运营审核作文并完成投递后一键完成
- **文件**：`src/lib/mock/agent-submissions.ts`

#### 2. 代投信息预览弹窗
- **按钮名称**：从"作文"改为"代投信息"
- **展示内容**：
  - **作者资料卡片**（绿色背景）
    - 姓名、学校、年级、联系电话
    - 指导老师（新增）
    - 通讯地址（新增）
    - 右上角"复制资料"按钮
  - **作文正文**（文本框样式）
    - 右上角"复制全文"按钮
    - 可滚动查看全文
  - **目标活动信息**（蓝色背景）
    - 活动标题
    - 投稿邮箱、邮件主题格式
    - "查看详情"按钮 → 跳转到 `/activities/[id]`
- **文件**：`src/app/admin/agent-submissions/page.tsx`

#### 3. 运营操作按钮优化
| 任务状态 | 显示按钮 |
|---------|---------|
| 待分配 (`waiting_assign`) | 接单、代投信息、截图、备注 |
| 其他状态 | 代投信息、截图、**状态**、备注 |

#### 4. 运营人员体验账号
- **手机号**：`13800138002`
- **身份类型**：`operator`
- **功能**：直接访问 `/admin/agent-submissions` 运营任务池
- **文件**：`src/stores/auth-store.ts`

#### 5. localStorage 持久化
- `agentSubmissionsStore`、`screenshotsStore`、`logsStore` 均支持刷新后保留
- 页面加载时调用 `initMockAgentData()` 初始化数据
- **文件**：`src/lib/mock/agent-submissions.ts`

#### 6. Student 类型扩展
- 新增字段：`guideTeacher`（指导老师）、`address`（通讯地址）
- **文件**：`src/types/student.ts`、`src/types/user.ts`

---

## 2026-05-23 Phase 2 平台代投系统加固

### 功能修复

#### 1. 后台上传截图功能
- `confirmAction` 新增 `actionType === "screenshot"` 处理
- 调用 `uploadMockSubmissionScreenshot()` 生成 mock URL
- 刷新后截图保留

#### 2. 后台备注功能
- 新增 `updateMockAgentSubmissionNotes()` 函数
- 内部备注保存到 `operatorNote`
- 用户可见备注保存到 `userVisibleNote`
- 保存时写入 `AgentSubmissionLog`

#### 3. 修复 AgentSubmissionForm 无效逻辑
- 移除无效的 `submittedEssayIds` 逻辑
- 简化作文列表获取

#### 4. 用户前台详情页
- 路由：`/agent-submissions/[id]`
- 展示：作文标题、活动标题、前台状态、用户可见备注、投稿时间、用户可见截图、状态时间线

#### 5. localStorage 持久化修复
- `createMockAgentSubmission`：先 push task → push log → 最后 `persistMockAgentData()`
- `updateMockAgentSubmissionBackendStatus`：先修改 task → push log → `persistMockAgentData()`

---

## 2026-05-22 Phase 2 平台人工代投系统

### 新增页面

| 路由 | 说明 |
|------|------|
| `/agent-submissions` | 用户代投记录列表 |
| `/agent-submissions/new` | 申请代投页面 |
| `/agent-submissions/[id]` | 用户代投详情页 |
| `/admin/agent-submissions` | 运营任务池 |

### 核心数据结构

- `AgentSubmissionTask`：代投任务
- `AgentSubmissionScreenshot`：投稿截图
- `AgentSubmissionLog`：状态变更日志

### 状态流转

**前台状态**（用户可见）：
`pending` → `accepted` → `preparing` → `submitted` → `waiting_reply` → `shortlisted`/`published`/`rejected` → `closed`

**后台状态**（运营可见）：
`waiting_assign` → `assigned` → `reviewing_essay` → `selecting_activity` → `preparing_submission` → `submitting` → `submitted` → ...

### 登录页体验账号

| 账号 | 身份 | 说明 |
|------|------|------|
| `13800138001` | 付费家长 | 完整会员权益 |
| `13800138002` | 运营人员 | 访问运营后台 |

---

## 待优化事项

- [ ] 真实的后端 API 接入（当前全为 Mock 数据）
- [ ] 截图实际上传功能（当前为 Mock URL）
- [ ] 支付流程（当前免费）
- [ ] 消息通知（站内信/短信）
- [ ] OCR 识别投稿结果