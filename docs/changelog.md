# 更新日志

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