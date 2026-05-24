// ============================================================================
// Analytics Track
// 统一埋点方法 - 支持 mock 模式和多种 provider 扩展
// ============================================================================

import type {
  EventName,
  EventProperties,
  AnalyticsContext,
  AnalyticsProviderConfig,
  AnalyticsEvent,
  IdentityType,
} from "./types";
import { EVENT_NAME_MAP } from "./events";

// ============================================================================
// Provider 配置
// ============================================================================

let currentProvider: AnalyticsProviderConfig = {
  provider: "console",
  debug: false,
};

export function setAnalyticsProvider(config: AnalyticsProviderConfig): void {
  currentProvider = config;
}

export function getAnalyticsProvider(): AnalyticsProviderConfig {
  return currentProvider;
}

// ============================================================================
// 获取当前上下文（从 auth-store）
// ============================================================================

function getCurrentContext(): AnalyticsContext {
  // 动态导入避免循环依赖
  let userId: string | null = null;
  let identityId: string | null = null;
  let identityType: IdentityType = "guest";
  let organizationId: string | null = null;

  if (typeof window !== "undefined") {
    try {
      // 从 localStorage 获取 auth-store 状态
      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        const parsed = JSON.parse(authData);
        const state = parsed.state || parsed;
        userId = state.user?.id || null;
        identityId = state.currentIdentity?.id || null;
        identityType = state.currentIdentity?.identityType || "guest";
        organizationId = state.currentIdentity?.organizationId || null;
      }
    } catch {
      // 读取失败，使用默认值
    }
  }

  return {
    userId,
    identityId,
    identityType,
    organizationId,
    pagePath: typeof window !== "undefined" ? window.location.pathname : "",
  };
}

// ============================================================================
// Provider 实现
// ============================================================================

/**
 * Console Provider - 开发调试用
 */
function trackWithConsole(event: AnalyticsEvent): void {
  const { provider, debug } = currentProvider;
  if (provider !== "console" && !debug) return;

  const timestamp = new Date().toISOString();
  const displayName = EVENT_NAME_MAP[event.eventName] || event.eventName;

  console.log(
    `%c[Analytics]%c ${displayName}`,
    "color: #2563EB; font-weight: bold;",
    "color: #333;",
    {
      eventName: event.eventName,
      userId: event.context.userId,
      identityId: event.context.identityId,
      identityType: event.context.identityType,
      pagePath: event.context.pagePath,
      timestamp: event.properties.timestamp,
      properties: event.properties,
    }
  );
}

/**
 * 神策 Provider - 预留接口
 */
function trackWithShence(event: AnalyticsEvent): void {
  // TODO: 接入神策 SDK
  // 神策接入方式：
  // sensors.track(eventName, properties)
  if (currentProvider.provider !== "shence") return;

  console.warn("[Analytics] Shence provider not implemented yet", event);
}

/**
 * GA4 Provider - 预留接口
 */
function trackWithGa4(event: AnalyticsEvent): void {
  // TODO: 接入 GA4
  // GA4 接入方式：
  // gtag('event', eventName, properties)
  if (currentProvider.provider !== "ga4") return;

  console.warn("[Analytics] GA4 provider not implemented yet", event);
}

/**
 * Custom API Provider - 预留接口
 */
function trackWithCustomApi(event: AnalyticsEvent): void {
  // TODO: 接入自定义 API
  if (currentProvider.provider !== "customApi") return;

  const { apiUrl } = currentProvider;
  if (!apiUrl) {
    console.warn("[Analytics] Custom API URL not configured");
    return;
  }

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  }).catch((err) => {
    console.error("[Analytics] Custom API track failed:", err);
  });
}

// ============================================================================
// 统一埋点方法
// ============================================================================

/**
 * 发送埋点事件
 *
 * @param eventName - 事件名称（使用常量，如 PAGE_VIEW）
 * @param properties - 事件属性（业务扩展字段）
 */
export function trackEvent(
  eventName: EventName,
  properties: EventProperties = {}
): void {
  // 异步执行，避免阻塞业务
  setTimeout(() => {
    try {
      // 1. 获取当前上下文
      const context = getCurrentContext();

      // 2. 添加时间戳（如果未提供）
      const timestamp = properties.timestamp || Date.now();

      // 3. 构建完整事件
      const event: AnalyticsEvent = {
        eventName,
        context,
        properties: {
          ...properties,
          pagePath: context.pagePath,
          timestamp,
        },
      };

      // 4. 根据 provider 发送
      switch (currentProvider.provider) {
        case "console":
          trackWithConsole(event);
          break;
        case "shence":
          trackWithShence(event);
          break;
        case "ga4":
          trackWithGa4(event);
          break;
        case "customApi":
          trackWithCustomApi(event);
          break;
        default:
          trackWithConsole(event);
      }
    } catch (error) {
      // 埋点失败不阻断业务
      console.error("[Analytics] Track event failed:", error);
    }
  }, 0);
}

// ============================================================================
// 便捷方法
// ============================================================================

/**
 * 页面浏览事件
 */
export function trackPageView(pagePath: string, properties: Partial<EventProperties> = {}): void {
  trackEvent("page_view", { ...properties, pagePath } as EventProperties);
}

/**
 * 活动详情页浏览
 */
export function trackActivityDetailView(
  activityId: string,
  activityTitle: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("activity_detail_view", {
    activityId,
    activityTitle,
    resourceType: "activity",
    resourceId: activityId,
    ...properties,
  } as EventProperties);
}

/**
 * 活动列表页浏览
 */
export function trackActivityListView(
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("activity_list_view", {
    resourceType: "activity",
    ...properties,
  } as EventProperties);
}

/**
 * 平台代投 CTA 点击
 */
export function trackAgentSubmissionCtaClick(
  sourcePage: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("agent_submission_cta_click", {
    sourcePage,
    ...properties,
  } as EventProperties);
}

/**
 * 会员 CTA 点击
 */
export function trackMembershipCtaClick(
  sourcePage: string,
  membershipType?: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("membership_cta_click", {
    sourcePage,
    membershipType,
    ...properties,
  } as EventProperties);
}

/**
 * 登录成功
 */
export function trackLoginSuccess(
  identityType: IdentityType,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("login_success", {
    identityType,
    ...properties,
  } as EventProperties);
}

/**
 * 退出登录
 */
export function trackLogoutClick(
  sourcePage: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("logout_click", { sourcePage, ...properties } as EventProperties);
}

/**
 * 身份切换
 */
export function trackIdentitySwitch(
  fromIdentityType: IdentityType,
  toIdentityType: IdentityType,
  toIdentityId: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("identity_switch", {
    fromIdentityType,
    toIdentityType,
    toIdentityId,
    ...properties,
  } as EventProperties);
}

/**
 * 工作台进入
 */
export function trackWorkspaceEnter(
  identityType: IdentityType,
  organizationId?: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("workspace_enter", {
    identityType,
    organizationId,
    ...properties,
  } as EventProperties);
}

/**
 * 会员页浏览
 */
export function trackMembershipPageView(
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("membership_page_view", {
    resourceType: "membership",
    ...properties,
  } as EventProperties);
}

/**
 * AI 推荐点击
 */
export function trackAiRecommendClick(
  essayId: string,
  studentId: string,
  sourcePage: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("ai_recommend_click", {
    essayId,
    studentId,
    sourcePage,
    resourceType: "essay",
    resourceId: essayId,
    ...properties,
  } as EventProperties);
}

/**
 * AI 改稿点击
 */
export function trackAiRewriteClick(
  essayId: string,
  studentId: string,
  sourcePage: string,
  isPaidUser: boolean = false,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("ai_rewrite_click", {
    essayId,
    studentId,
    sourcePage,
    isPaidUser,
    resourceType: "essay",
    resourceId: essayId,
    ...properties,
  } as EventProperties);
}

/**
 * AI 改稿结果查看
 */
export function trackAiRewriteResultView(
  essayId: string,
  studentId: string,
  sourcePage: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("ai_rewrite_result_view", {
    essayId,
    studentId,
    sourcePage,
    resourceType: "essay",
    resourceId: essayId,
    ...properties,
  } as EventProperties);
}

/**
 * 作文上传点击
 */
export function trackEssayUploadClick(
  sourcePage: string,
  identityType?: IdentityType,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("essay_upload_click", {
    sourcePage,
    identityType,
    resourceType: "essay",
    ...properties,
  } as EventProperties);
}

/**
 * 作文批改页浏览
 */
export function trackEssayReviewPageView(
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("essay_review_page_view", {
    resourceType: "essay",
    ...properties,
  } as EventProperties);
}

/**
 * 作文批改入口点击
 */
export function trackEssayReviewEntryClick(
  essayId: string,
  studentId: string,
  sourcePage: string,
  reviewType: "ai" | "manual" = "ai",
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("essay_review_entry_click", {
    essayId,
    studentId,
    sourcePage,
    reviewType,
    resourceType: "essay",
    resourceId: essayId,
    ...properties,
  } as EventProperties);
}

/**
 * 查看投稿方式点击
 */
export function trackViewSubmissionMethodClick(
  activityId: string,
  activityTitle: string,
  submissionMethod?: string,
  isMember: boolean = false,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("view_submission_method_click", {
    activityId,
    activityTitle,
    submissionMethod,
    isMember,
    resourceType: "activity",
    resourceId: activityId,
    ...properties,
  } as EventProperties);
}

/**
 * 自主投稿创建
 */
export function trackSelfSubmissionCreate(
  activityId: string,
  activityTitle: string,
  essayId: string,
  studentId: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("self_submission_create", {
    activityId,
    activityTitle,
    essayId,
    studentId,
    resourceType: "submission",
    ...properties,
  } as EventProperties);
}

/**
 * 平台代投申请点击
 */
export function trackAgentSubmissionApplyClick(
  essayId: string,
  activityId: string,
  studentId: string,
  sourcePage: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("agent_submission_apply_click", {
    essayId,
    activityId,
    studentId,
    sourcePage,
    resourceType: "submission",
    ...properties,
  } as EventProperties);
}

/**
 * 平台代投创建
 */
export function trackAgentSubmissionCreated(
  taskId: string,
  essayId: string,
  activityId: string,
  studentId: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("agent_submission_created", {
    taskId,
    essayId,
    activityId,
    studentId,
    resourceType: "submission",
    resourceId: taskId,
    ...properties,
  } as EventProperties);
}

/**
 * 订单页浏览
 */
export function trackOrderPageView(
  orderPageType: "personal" | "organization",
  identityType?: IdentityType,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("order_page_view", {
    orderPageType,
    identityType,
    resourceType: "order",
    ...properties,
  } as EventProperties);
}

/**
 * 人工批改申请点击
 */
export function trackManualReviewApplyClick(
  essayId: string,
  studentId: string,
  reviewType: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("manual_review_apply_click", {
    essayId,
    studentId,
    reviewType,
    resourceType: "essay",
    resourceId: essayId,
    ...properties,
  } as EventProperties);
}

/**
 * 人工批改订单创建
 */
export function trackManualReviewOrderCreated(
  orderId: string,
  essayId: string,
  studentId: string,
  reviewType: string,
  amount?: number,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("manual_review_order_created", {
    orderId,
    essayId,
    studentId,
    reviewType,
    amount,
    resourceType: "order",
    resourceId: orderId,
    ...properties,
  } as EventProperties);
}

/**
 * 批改支付 CTA 点击
 */
export function trackReviewPaymentCtaClick(
  essayId: string,
  studentId: string,
  reviewType: string,
  sourcePage: string,
  properties: Partial<EventProperties> = {}
): void {
  trackEvent("review_payment_cta_click", {
    essayId,
    studentId,
    reviewType,
    sourcePage,
    resourceType: "essay",
    resourceId: essayId,
    ...properties,
  } as EventProperties);
}