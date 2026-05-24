// ============================================================================
// Analytics Types
// 埋点数据类型定义
// ============================================================================

// 事件名称类型
export type EventName =
  // 基础访问
  | "page_view"
  | "activity_list_view"
  | "activity_detail_view"
  | "workspace_enter"
  | "order_page_view"
  // 活动与投稿
  | "view_submission_method_click"
  | "self_submission_create"
  | "agent_submission_apply_click"
  | "agent_submission_created"
  | "agent_submission_cta_click"
  // 作文与批改
  | "essay_upload_click"
  | "essay_review_page_view"
  | "essay_review_entry_click"
  | "essay_review_submit_click"
  | "ai_recommend_click"
  | "ai_rewrite_click"
  | "ai_rewrite_result_view"
  | "manual_review_apply_click"
  | "manual_review_order_created"
  | "review_payment_cta_click"
  // 会员与转化
  | "membership_page_view"
  | "membership_cta_click"
  // 账号与身份
  | "login_success"
  | "logout_click"
  | "identity_switch";

// 身份类型
export type IdentityType =
  | "parent"
  | "teacher"
  | "organization_admin"
  | "organization_teacher"
  | "operator"
  | "admin"
  | "guest";

// 资源类型
export type ResourceType =
  | "activity"
  | "essay"
  | "submission"
  | "order"
  | "membership"
  | "student"
  | "workspace"
  | "page";

// 基础事件属性
export interface BaseEventProperties {
  // 自动填充字段（由 trackEvent 自动注入）
  pagePath?: string;
  timestamp?: number;
  // 资源信息
  resourceType?: ResourceType;
  resourceId?: string;
  // 业务扩展字段（各事件自定义）
  [key: string]: unknown;
}

// 活动列表页事件
export interface ActivityListViewProperties extends BaseEventProperties {
  keyword?: string;
  gradeScope?: string[];
  genre?: string[];
  activityStatus?: string;
  resultCount?: number;
}

// 活动详情页事件
export interface ActivityDetailViewProperties extends BaseEventProperties {
  activityId: string;
  activityTitle: string;
  publisherId?: string;
  gradeScope?: string[];
  hasPayment?: boolean;
  hasCertificate?: boolean;
  hasSampleIssue?: boolean;
  publisherType?: string;
}

// 查看投稿方式点击
export interface ViewSubmissionMethodClickProperties extends BaseEventProperties {
  activityId: string;
  activityTitle: string;
  submissionMethod?: string;
  isMember?: boolean;
}

// 自主投稿创建
export interface SelfSubmissionCreateProperties extends BaseEventProperties {
  activityId: string;
  activityTitle: string;
  essayId: string;
  studentId: string;
}

// 平台代投申请点击
export interface AgentSubmissionApplyClickProperties extends BaseEventProperties {
  essayId: string;
  activityId: string;
  studentId: string;
  sourcePage: string;
}

// 平台代投创建
export interface AgentSubmissionCreatedProperties extends BaseEventProperties {
  taskId: string;
  essayId: string;
  activityId: string;
  studentId: string;
}

// 平台代投 CTA 点击
export interface AgentSubmissionCtaClickProperties extends BaseEventProperties {
  sourcePage: string;
  ctaLocation?: string;
}

// 作文上传点击
export interface EssayUploadClickProperties extends BaseEventProperties {
  sourcePage: string;
  identityType?: IdentityType;
}

// 作文批改页浏览
export interface EssayReviewPageViewProperties extends BaseEventProperties {
  essayId?: string;
  studentId?: string;
  reviewType?: "ai" | "manual";
}

// 作文批改入口点击
export interface EssayReviewEntryClickProperties extends BaseEventProperties {
  essayId: string;
  studentId: string;
  sourcePage: string;
  reviewType?: "ai" | "manual";
}

// 作文批改提交
export interface EssayReviewSubmitProperties extends BaseEventProperties {
  essayId: string;
  studentId: string;
  reviewType?: "ai" | "manual";
  wordCount?: number;
}

// AI 推荐点击
export interface AiRecommendClickProperties extends BaseEventProperties {
  essayId: string;
  studentId: string;
  grade?: string;
  sourcePage: string;
}

// AI 改稿点击
export interface AiRewriteClickProperties extends BaseEventProperties {
  essayId: string;
  studentId: string;
  sourcePage: string;
  isPaidUser?: boolean;
}

// AI 改稿结果查看
export interface AiRewriteResultViewProperties extends BaseEventProperties {
  essayId: string;
  studentId: string;
  sourcePage: string;
  versionId?: string;
}

// 人工批改申请点击
export interface ManualReviewApplyClickProperties extends BaseEventProperties {
  essayId: string;
  studentId: string;
  reviewType: string;
}

// 人工批改订单创建
export interface ManualReviewOrderCreatedProperties extends BaseEventProperties {
  orderId: string;
  essayId: string;
  studentId: string;
  reviewType: string;
  amount?: number;
}

// 批改支付 CTA 点击
export interface ReviewPaymentCtaClickProperties extends BaseEventProperties {
  essayId: string;
  studentId: string;
  reviewType: string;
  sourcePage: string;
}

// 会员页浏览
export interface MembershipPageViewProperties extends BaseEventProperties {
  sourcePage?: string;
  membershipType?: string;
}

// 会员 CTA 点击
export interface MembershipCtaClickProperties extends BaseEventProperties {
  sourcePage: string;
  membershipType?: string;
  planType?: string;
}

// 订单页浏览
export interface OrderPageViewProperties extends BaseEventProperties {
  orderPageType: "personal" | "organization";
  identityType?: IdentityType;
}

// 登录成功
export interface LoginSuccessProperties extends BaseEventProperties {
  identityType: IdentityType;
  loginMethod?: string;
  phone?: string;
}

// 退出登录点击
export interface LogoutClickProperties extends BaseEventProperties {
  sourcePage: string;
}

// 身份切换
export interface IdentitySwitchProperties extends BaseEventProperties {
  fromIdentityType: IdentityType;
  toIdentityType: IdentityType;
  toIdentityId: string;
}

// 工作台进入
export interface WorkspaceEnterProperties extends BaseEventProperties {
  identityType: IdentityType;
  organizationId?: string;
}

// 页面浏览（通用）
export interface PageViewProperties extends BaseEventProperties {
  previousPage?: string;
  referrer?: string;
}

// 事件属性联合类型
export type EventProperties =
  | BaseEventProperties
  | ActivityListViewProperties
  | ActivityDetailViewProperties
  | ViewSubmissionMethodClickProperties
  | SelfSubmissionCreateProperties
  | AgentSubmissionApplyClickProperties
  | AgentSubmissionCreatedProperties
  | AgentSubmissionCtaClickProperties
  | EssayUploadClickProperties
  | EssayReviewPageViewProperties
  | EssayReviewEntryClickProperties
  | EssayReviewSubmitProperties
  | AiRecommendClickProperties
  | AiRewriteClickProperties
  | AiRewriteResultViewProperties
  | ManualReviewApplyClickProperties
  | ManualReviewOrderCreatedProperties
  | ReviewPaymentCtaClickProperties
  | MembershipPageViewProperties
  | MembershipCtaClickProperties
  | OrderPageViewProperties
  | LoginSuccessProperties
  | LogoutClickProperties
  | IdentitySwitchProperties
  | WorkspaceEnterProperties
  | PageViewProperties;

// 埋点上下文（自动注入）
export interface AnalyticsContext {
  userId: string | null;
  identityId: string | null;
  identityType: IdentityType;
  organizationId: string | null;
  pagePath: string;
}

// Provider 配置
export interface AnalyticsProviderConfig {
  provider: "console" | "shence" | "ga4" | "customApi";
  appId?: string;
  apiUrl?: string;
  debug?: boolean;
}

// 埋点事件（完整格式）
export interface AnalyticsEvent {
  eventName: EventName;
  context: AnalyticsContext;
  properties: EventProperties;
}