// ============================================================================
// 通用枚举和常量
// ============================================================================

// 身份类型
export type IdentityType =
  | "parent"           // 家长
  | "teacher"         // 个人老师
  | "organization_admin" // 机构管理员
  | "organization_teacher" // 机构老师
  | "editor"          // 编辑
  | "operator"        // 平台运营
  | "admin";          // 超级管理员

// 会员类型
export type MembershipType =
  | "yearly"           // 年费会员
  | "lifetime"         // 终身会员
  | "organization_primary" // 机构版-小学
  | "organization_middle"  // 机构版-中学
  | "organization_all";     // 机构版-中小学

// 登录凭证类型
export type AuthType =
  | "wechat_mini_program"  // 微信小程序
  | "wechat_web"           // 微信网页
  | "phone";              // 手机号

// 账号状态
export type AccountStatus = "active" | "frozen" | "closed";

// 性别
export type Gender = "male" | "female" | "other";

// ============================================================================
// 活动相关枚举
// ============================================================================

// 活动状态
export type ActivityStatus = "recruiting" | "closing_soon" | "closed" | "long_term";

// 活动审核状态
export type AuditStatus = "pending" | "approved" | "rejected";

// 投稿方式
export type SubmissionMethod =
  | "email"           // 邮箱投稿
  | "website"          // 官网投稿
  | "mini_program"     // 小程序投稿
  | "wechat"           // 微信投稿
  | "system"           // 系统投稿
  | "offline"          // 线下投稿
  | "other";           // 其他

// 征稿方类型
export type PublisherType =
  | "newspaper"       // 报纸
  | "magazine"        // 杂志
  | "official_account" // 公众号
  | "organization"    // 机构
  | "school"          // 学校
  | "other";          // 其他

// ============================================================================
// 作文相关枚举
// ============================================================================

// 作文文体
export type EssayGenre =
  | "narrative"       // 记叙文
  | "argumentative"    // 议论文
  | "prose"           // 散文
  | "poetry"          // 诗歌
  | "letter"          // 书信
  | "speech"          // 演讲稿
  | "other";          // 其他

// 作文状态
export type EssayStatus = "draft" | "published" | "archived";

// 作文版本类型
export type EssayVersionType =
  | "original"        // 原稿
  | "ai_rewrite"      // AI改稿版
  | "manual_edit"      // 人工批改版
  | "final_submission" // 最终投稿版
  | "agent_submission"; // 代投使用版

// ============================================================================
// 投稿相关枚举
// ============================================================================

// 自主投稿状态
export type SelfSubmissionStatus =
  | "pending"             // 待投稿
  | "user_submitted"      // 用户已投稿
  | "waiting_reply"       // 等待回复
  | "shortlisted"         // 初审通过
  | "planned_publish"     // 拟录用
  | "suspected_published" // 疑似发表
  | "published"           // 已刊登
  | "rejected"            // 未录用
  | "closed";             // 已结束

// 平台代投前台状态
export type AgentSubmissionFrontendStatus =
  | "pending"             // 待处理
  | "accepted"            // 已接单
  | "preparing"           // 投稿准备中
  | "submitted"           // 已投稿
  | "waiting_reply"       // 等待回复
  | "shortlisted"         // 初审通过
  | "planned_publish"     // 拟录用
  | "suspected_published" // 疑似发表
  | "published"           // 已刊登
  | "rejected"            // 未录用
  | "closed";             // 已结束

// 平台代投后台状态
export type AgentSubmissionBackendStatus =
  | "waiting_assign"           // 待分配
  | "assigned"                 // 已分配运营
  | "reviewing_essay"          // 待审核作文
  | "selecting_activity"       // 待筛选活动
  | "preparing_submission"     // 待投稿
  | "submitting"               // 投稿中
  | "submit_failed"            // 投稿失败
  | "submitted"                // 已投稿
  | "waiting_reply"            // 等待回复
  | "need_more_info"           // 需补充资料
  | "suspected_duplicate"       // 疑似重复投稿
  | "suspected_multi_submission" // 疑似一稿多投
  | "shortlisted"               // 初审通过
  | "planned_publish"           // 拟录用
  | "suspected_published"       // 疑似发表
  | "published"                // 已刊登
  | "rejected"                  // 未录用
  | "closed";                   // 已关闭

// 代投任务优先级
export type PriorityLevel = "low" | "medium" | "high" | "urgent";

// 截图类型
export type ScreenshotType =
  | "email_sent"        // 邮件已发送
  | "submit_success"   // 投稿成功
  | "submit_failed"    // 投稿失败
  | "publisher_reply"  // 征稿方回复
  | "other";           // 其他

// ============================================================================
// AI相关枚举
// ============================================================================

// AI任务类型
export type AITaskType =
  | "rewrite"          // AI改稿
  | "recommend_activity" // AI推荐活动
  | "title_suggestion"   // AI标题建议
  | "column_match"       // AI栏目匹配
  | "submission_advice"; // AI投稿建议

// ============================================================================
// 订单相关枚举
// ============================================================================

// 订单类型
export type OrderType =
  | "membership"        // 会员订单
  | "ai_rewrite"        // AI改稿
  | "ai_recommend"      // AI推荐
  | "agent_submission"  // 代投
  | "manual_review"     // 人工批改
  | "organization_package" // 机构套餐
  | "balance_recharge";    // 余额充值

// 支付状态
export type PaymentStatus = "pending" | "paid" | "refunded" | "partially_refunded" | "closed";

// ============================================================================
// 售后相关枚举
// ============================================================================

// 售后类型
export type AfterSaleType =
  | "full_refund"        // 全额退款
  | "partial_refund"     // 部分退款
  | "balance_transfer"   // 转余额
  | "service_exchange"   // 换服务
  | "manual_process";    // 人工处理

// 售后状态
export type AfterSaleStatus = "pending" | "approved" | "rejected" | "completed";

// ============================================================================
// 发表识别相关枚举
// ============================================================================

// 检测来源
export type DetectSource = "pdf" | "image" | "official_account_article" | "user_upload" | "operator_upload";

// 检测状态
export type DetectStatus = "pending" | "suspected_match" | "confirmed" | "rejected";

// ============================================================================
// 消息相关枚举
// ============================================================================

// 消息类型
export type NotificationType =
  | "activity_deadline"       // 活动截止提醒
  | "self_submission_reminder" // 自主投稿提醒
  | "agent_submission_update"  // 代投状态更新
  | "screenshot_uploaded"      // 截图上传提醒
  | "suspected_published"      // 疑似发表提醒
  | "membership_renew"         // 会员续费提醒
  | "system_notice";          // 系统通知

// ============================================================================
// GEO相关枚举
// ============================================================================

// GEO页面类型
export type GEOPageType =
  | "grade_recommendation"     // 年级推荐
  | "theme_recommendation"     // 主题推荐
  | "condition_aggregation"    // 条件聚合
  | "faq"                     // FAQ
  | "comparison"              // 对比
  | "guide";                  // 攻略

// ============================================================================
// 通用接口
// ============================================================================

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页结果
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 时间戳
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// 通用状态响应
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}