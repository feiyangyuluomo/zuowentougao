// ============================================================================
// Analytics Index
// 埋点基础设施统一导出
// ============================================================================

// 类型导出
export type {
  EventName,
  IdentityType,
  ResourceType,
  BaseEventProperties,
  EventProperties,
  AnalyticsContext,
  AnalyticsProviderConfig,
  AnalyticsEvent,
  // 具体事件属性类型
  ActivityListViewProperties,
  ActivityDetailViewProperties,
  ViewSubmissionMethodClickProperties,
  SelfSubmissionCreateProperties,
  AgentSubmissionApplyClickProperties,
  AgentSubmissionCreatedProperties,
  AgentSubmissionCtaClickProperties,
  EssayUploadClickProperties,
  EssayReviewPageViewProperties,
  EssayReviewEntryClickProperties,
  EssayReviewSubmitProperties,
  AiRecommendClickProperties,
  AiRewriteClickProperties,
  AiRewriteResultViewProperties,
  ManualReviewApplyClickProperties,
  ManualReviewOrderCreatedProperties,
  ReviewPaymentCtaClickProperties,
  MembershipPageViewProperties,
  MembershipCtaClickProperties,
  OrderPageViewProperties,
  LoginSuccessProperties,
  LogoutClickProperties,
  IdentitySwitchProperties,
  WorkspaceEnterProperties,
  PageViewProperties,
} from "./types";

// 事件常量导出
export {
  // 基础访问
  PAGE_VIEW,
  ACTIVITY_LIST_VIEW,
  ACTIVITY_DETAIL_VIEW,
  WORKSPACE_ENTER,
  ORDER_PAGE_VIEW,
  // 活动与投稿
  VIEW_SUBMISSION_METHOD_CLICK,
  SELF_SUBMISSION_CREATE,
  AGENT_SUBMISSION_APPLY_CLICK,
  AGENT_SUBMISSION_CREATED,
  AGENT_SUBMISSION_CTA_CLICK,
  // 作文与批改
  ESSAY_UPLOAD_CLICK,
  ESSAY_REVIEW_PAGE_VIEW,
  ESSAY_REVIEW_ENTRY_CLICK,
  ESSAY_REVIEW_SUBMIT_CLICK,
  AI_RECOMMEND_CLICK,
  AI_REWRITE_CLICK,
  AI_REWRITE_RESULT_VIEW,
  MANUAL_REVIEW_APPLY_CLICK,
  MANUAL_REVIEW_ORDER_CREATED,
  REVIEW_PAYMENT_CTA_CLICK,
  // 会员与转化
  MEMBERSHIP_PAGE_VIEW,
  MEMBERSHIP_CTA_CLICK,
  // 账号与身份
  LOGIN_SUCCESS,
  LOGOUT_CLICK,
  IDENTITY_SWITCH,
  EVENT_NAME_MAP,
} from "./events";

// 埋点方法导出
export {
  trackEvent,
  trackPageView,
  trackActivityDetailView,
  trackActivityListView,
  trackAgentSubmissionCtaClick,
  trackMembershipCtaClick,
  trackLoginSuccess,
  trackLogoutClick,
  trackIdentitySwitch,
  trackWorkspaceEnter,
  trackMembershipPageView,
  trackAiRecommendClick,
  trackAiRewriteClick,
  trackAiRewriteResultView,
  trackEssayUploadClick,
  trackEssayReviewPageView,
  trackEssayReviewEntryClick,
  trackViewSubmissionMethodClick,
  trackSelfSubmissionCreate,
  trackAgentSubmissionApplyClick,
  trackAgentSubmissionCreated,
  trackOrderPageView,
  trackManualReviewApplyClick,
  trackManualReviewOrderCreated,
  trackReviewPaymentCtaClick,
  setAnalyticsProvider,
  getAnalyticsProvider,
} from "./track";