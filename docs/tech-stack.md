# docs/tech-stack.md

# 技术架构文档

---

# 一、整体技术架构

| 模块 | 技术方案 |
|---|---|
| Web前端 | Next.js + React |
| 小程序 | Taro + React |
| UI组件 | Tailwind CSS + shadcn/ui |
| 图标 | lucide-react |
| 后端 | NestJS |
| 数据库 | PostgreSQL |
| ORM | Prisma |
| AI模型 | DeepSeek / 文心一言 |
| OCR | 腾讯云 OCR / PaddleOCR |
| 文件存储 | 腾讯云 COS |
| 登录 | 微信登录 + 手机号验证码 |
| 支付 | 微信支付 |
| 搜索 | PostgreSQL Full Text Search |
| SEO/GEO | Next.js SSR + SSG |
| 部署 | Vercel + 腾讯云服务器 |

---

# 二、前端架构

采用：

Next.js App Router

目录：

```text
src/app
```

推荐路由：

```text
src/app/
├── page.tsx
├── activities/
├── ai-assistant/
├── essays/
├── students/
├── self-submissions/
├── agent-submissions/
├── growth-records/
├── membership/
├── workspace/
├── editor/
└── admin/
```

优势：

- SSR友好
- SEO友好
- GEO友好
- 路由清晰
- 适合内容页与后台系统并存

---

# 三、UI体系

采用：

- Tailwind CSS
- shadcn/ui
- lucide-react

视觉方向：

- 教育服务感
- SaaS管理感
- 清爽可信
- 高信息密度
- 不幼稚
- 不花哨

核心组件：

- Button
- Card
- Badge
- Tabs
- Table
- Dialog
- Drawer
- Form
- Input
- Textarea
- Select
- Checkbox
- DatePicker
- Toast
- Pagination
- DropdownMenu

业务组件：

- ActivityCard
- ActivityFilter
- ActivityDetailPanel
- EssayUploader
- AiResultPanel
- SelfSubmissionCard
- AgentSubmissionTaskCard
- SubmissionStatusTimeline
- ScreenshotGallery
- IdentitySwitcher
- PermissionGuard
- PaywallBlock
- AdminDataTable
- BatchActionBar

---

# 四、后端架构

采用：

NestJS

推荐模块：

```text
src/modules/
├── auth/
├── users/
├── identities/
├── memberships/
├── activities/
├── publishers/
├── students/
├── essays/
├── ai/
├── self-submissions/
├── agent-submissions/
├── operations/
├── payments/
├── notifications/
├── seo/
├── geo/
├── ocr/
└── admin/
```

后端原则：

- 模块化
- 权限统一
- 状态统一
- 日志统一
- 服务端校验资源归属

---

# 五、数据库

采用：

PostgreSQL

原因：

- 结构化强
- 适合复杂关系
- 支持全文搜索
- 支持 JSON 字段
- 适合后续数据统计

---

# 六、ORM

采用：

Prisma

原因：

- TypeScript 类型友好
- 迁移方便
- 关系清晰
- 适合快速开发

---

# 七、AI架构

支持功能：

- AI改稿
- AI推荐活动
- AI标题建议
- AI栏目匹配
- AI投稿建议

模型：

- DeepSeek
- 文心一言

AI原则：

- AI输出必须可追踪
- AI不能覆盖原文
- AI结果必须保存记录
- AI推荐仅供参考
- 作文禁止用于模型训练

---

# 八、OCR系统

支持：

- PDF识别
- 图片识别
- 报刊识别
- 用户上传样刊识别
- 公众号文章识别

技术：

- 腾讯云 OCR
- PaddleOCR

用途：

- 自动识别发表结果
- 匹配作文标题
- 匹配作者
- 匹配学校
- 匹配正文片段

---

# 九、文件存储

使用：

腾讯云 COS

存储：

- 作文附件
- 投稿截图
- 投稿邮件截图
- 投稿成功截图
- 样刊图片
- OCR识别图片
- 用户上传文件

文件规则：

- 文件必须绑定用户或身份
- 敏感文件禁止公开直链
- 下载必须校验权限
- 删除必须记录日志

---

# 十、支付系统

采用：

微信支付

支持：

- 会员支付
- AI改稿支付
- AI推荐支付
- 平台代投支付
- 人工批改支付
- 机构套餐支付
- 余额充值

支付后需要：

- 创建订单
- 更新权益
- 创建代投任务
- 记录支付流水

---

# 十一、搜索系统

初期：

PostgreSQL Full Text Search

用于：

- 活动搜索
- 征稿方搜索
- SEO文章搜索
- 投稿攻略搜索

后期可扩展：

- Meilisearch
- Elasticsearch

---

# 十二、SEO/GEO系统

采用：

Next.js SSR + SSG

支持：

- 投稿攻略页
- 年级推荐页
- 主题推荐页
- 条件聚合页
- FAQ页
- AI摘要页
- 征稿方主页

页面必须包含：

- 结构化摘要
- FAQ
- 更新时间
- 推荐活动
- 相关推荐
- AI友好总结

---

# 十三、小程序架构

采用：

Taro + React

适合承载：

- 活动库
- AI推荐
- AI改稿
- 我的作文
- 自主投稿记录
- 代投进度
- 成长档案
- 消息提醒

不优先承载：

- 完整后台
- 大规模表格管理
- 编辑工作台
- 复杂机构后台

---

# 十四、部署方案

前端：

- Vercel

后端：

- 腾讯云服务器

数据库：

- 腾讯云 PostgreSQL

对象存储：

- 腾讯云 COS

小程序：

- 微信小程序平台

---

# 十五、环境配置建议

环境：

- development
- staging
- production

必须区分：

- 数据库
- 支付配置
- AI Key
- COS配置
- 微信小程序配置

禁止：

- 生产密钥写入代码
- 将 .env 上传 GitHub
- 在前端暴露后端密钥
```