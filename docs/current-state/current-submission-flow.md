# 当前投稿流程

系统支持两种投稿模式：自主投稿 和 平台代投。

## 自主投稿流程

### 用户路径

```
上传作文 → AI推荐活动 → 查看投稿方式 → 自主投稿 → 记录状态
```

### 详细步骤

1. **上传作文** (`/essays`)
   - 选择/创建学生
   - 填写作文标题和正文
   - 系统计算字数

2. **AI推荐活动** (`/ai-assistant`)
   - 上传作文或粘贴内容
   - AI分析作文（年级、文体、主题）
   - AI推荐适合的征稿活动
   - 显示匹配度、匹配理由、风险提示、投稿建议

3. **查看投稿方式** (`/activities/[id]`)
   - 征稿详情
   - 投稿邮箱（自主投稿区域）
   - 投稿格式要求
   - 其他补充（活动原文链接、补充资料、写作建议）

4. **自主投稿**
   - 用户自行按邮箱投稿
   - 在平台记录投稿信息（投稿时间、邮箱、备注）
   - 确认一稿多投风险

5. **记录状态**
   - 等待回复 → 初审通过 → 拟录用 → 已刊登 / 未录用

### 自主投稿状态

```typescript
type SelfSubmissionStatus =
  | "pending"              // 待投稿
  | "user_submitted"       // 用户已投稿
  | "waiting_reply"        // 等待回复
  | "shortlisted"          // 初审通过
  | "planned_publish"      // 拟录用
  | "suspected_published"  // 疑似刊登
  | "published"           // 已刊登
  | "rejected"            // 未录用
  | "closed";             // 已关闭
```

### 自主投稿记录页面

- **列表** `/self-submissions` - 当前身份的投稿记录列表
- **新建** `/self-submissions/new` - 创建新的投稿记录

### 数据结构

```typescript
interface SelfSubmission {
  id: string;
  essayId: string;
  activityId: string;
  identityId: string;
  studentId: string;
  submissionEmail?: string;     // 投稿邮箱
  submissionMethod?: SubmissionMethod;
  userSubmissionTime?: Date;   // 用户投稿时间
  userNote?: string;           // 用户备注
  submissionStatus: SelfSubmissionStatus;
  resultStatus?: SelfSubmissionStatus;
  riskConfirmed: boolean;      // 是否已确认一稿多投风险
  riskConfirmedAt?: Date;
}
```

---

## 平台代投流程

### 用户路径

```
上传作文 → 申请代投 → 支付 → 等待接单 → 运营投稿 → 查看状态
```

### 详细步骤

1. **上传作文** (同自主投稿)

2. **申请代投** (`/agent-submissions/new`)
   - 选择作文
   - 选择活动（可AI推荐或自主选择）
   - 确认一稿多投风险
   - 提交申请

3. **支付代投费用**
   - 创建订单
   - 完成支付

4. **等待运营接单**
   - 任务进入「待分配」池
   - 运营人员接单

5. **运营人工投稿**
   - 运营审核作文
   - 筛选活动
   - 人工完成投稿
   - 上传投稿截图
   - 更新状态

6. **用户查看状态** (`/agent-submissions/[id]`)
   - 查看代投状态
   - 查看投稿截图（用户可见部分）
   - 查看运营备注

### 平台代投状态

**用户前台状态（Frontend Status）**：

```typescript
type AgentSubmissionFrontendStatus =
  | "pending"           // 待处理
  | "accepted"          // 已接单
  | "preparing"         // 投稿准备中
  | "submitted"        // 已投稿
  | "waiting_reply"    // 等待回复
  | "shortlisted"      // 初审通过
  | "planned_publish"  // 拟录用
  | "suspected_published" // 疑似刊登
  | "published"        // 已刊登
  | "rejected"         // 未录用
  | "closed";          // 已关闭
```

**后台运营状态（Backend Status）**：

```typescript
type AgentSubmissionBackendStatus =
  | "waiting_assign"         // 待分配
  | "assigned"               // 已分配
  | "reviewing_essay"        // 审核作文中
  | "selecting_activity"     // 筛选活动中
  | "preparing_submission"   // 准备投稿
  | "submitting"             // 投稿中
  | "submit_failed"          // 投稿失败
  | "submitted"              // 已投稿
  | "waiting_reply"          // 等待回复
  | "need_more_info"         // 需要更多信息
  | "suspected_duplicate"     // 疑似重复
  | "suspected_multi_submission" // 疑似一稿多投
  | "shortlisted"            // 初审通过
  | "planned_publish"        // 拟录用
  | "suspected_published"    // 疑似刊登
  | "published"             // 已刊登
  | "rejected"               // 未录用
  | "closed";                // 已关闭
```

### 代投记录页面

- **列表** `/agent-submissions` - 当前身份的代投任务列表
- **新建** `/agent-submissions/new` - 申请新的代投
- **详情** `/agent-submissions/[id]` - 查看代投任务详情（含截图、日志）

### 数据结构

```typescript
interface AgentSubmissionTask {
  id: string;
  essayId: string;
  activityId: string;
  identityId: string;
  studentId: string;
  orderId?: string;
  operatorIdentityId?: string;
  platformSubmissionEmail?: string;
  frontendStatus: AgentSubmissionFrontendStatus;
  backendStatus: AgentSubmissionBackendStatus;
  priorityLevel: PriorityLevel;
  submissionTime?: Date;
  failureReason?: string;
  operatorNote?: string;        // 运营备注（内部）
  userVisibleNote?: string;     // 用户可见备注
  riskConfirmed: boolean;
  riskConfirmedAt?: Date;
}
```

### 截图类型

```typescript
type ScreenshotType =
  | "email_sent"         // 邮件已发送
  | "submit_success"     // 投稿成功
  | "submit_failed"     // 投稿失败
  | "other";            // 其他
```

---

## 运营任务池

**页面** `/admin/agent-submissions`

- 运营人员查看所有待分配的代投任务
- 可以接单并完成投稿

### 运营可执行操作

1. **接单** - 领取任务，开始处理
2. **完成投稿** - 快速模式：接单后直接完成投稿
3. **更新状态** - 更新前后台状态
4. **上传截图** - 上传投稿截图
5. **填写备注** - 填写运营备注和用户可见备注
6. **记录失败原因** - 投稿失败时记录原因

---

## 权限控制

### 自主投稿权限

- 查看自己的投稿记录：全部登录身份
- 创建投稿记录：全部登录身份
- 查看他人记录：禁止

### 平台代投权限

- 查看自己的代投记录：全部登录身份
- 申请代投：全部登录身份
- 查看任务池：operator / admin
- 运营操作（接单、上传截图等）：operator / admin

### 数据隔离

自主投稿和平台代投都按 `identityId` + `studentId` 隔离，用户只能看到自己或自己名下学生的投稿记录。