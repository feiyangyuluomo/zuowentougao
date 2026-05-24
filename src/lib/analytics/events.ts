// ============================================================================
// Analytics Events
// 埋点事件常量定义
// ============================================================================

import type { EventName } from "./types";

// ============================================================================
// 基础访问事件
// ============================================================================

/** 页面浏览 */
export const PAGE_VIEW: EventName = "page_view";

/** 活动列表页浏览 */
export const ACTIVITY_LIST_VIEW: EventName = "activity_list_view";

/** 活动详情页浏览 */
export const ACTIVITY_DETAIL_VIEW: EventName = "activity_detail_view";

/** 工作台进入 */
export const WORKSPACE_ENTER: EventName = "workspace_enter";

/** 订单页浏览 */
export const ORDER_PAGE_VIEW: EventName = "order_page_view";

// ============================================================================
// 活动与投稿事件
// ============================================================================

/** 查看投稿方式点击 */
export const VIEW_SUBMISSION_METHOD_CLICK: EventName = "view_submission_method_click";

/** 自主投稿创建 */
export const SELF_SUBMISSION_CREATE: EventName = "self_submission_create";

/** 平台代投申请点击 */
export const AGENT_SUBMISSION_APPLY_CLICK: EventName = "agent_submission_apply_click";

/** 平台代投创建 */
export const AGENT_SUBMISSION_CREATED: EventName = "agent_submission_created";

/** 平台代投 CTA 点击 */
export const AGENT_SUBMISSION_CTA_CLICK: EventName = "agent_submission_cta_click";

// ============================================================================
// 作文与批改事件
// ============================================================================

/** 作文上传点击 */
export const ESSAY_UPLOAD_CLICK: EventName = "essay_upload_click";

/** 作文批改页浏览 */
export const ESSAY_REVIEW_PAGE_VIEW: EventName = "essay_review_page_view";

/** 作文批改入口点击 */
export const ESSAY_REVIEW_ENTRY_CLICK: EventName = "essay_review_entry_click";

/** 作文批改提交 */
export const ESSAY_REVIEW_SUBMIT_CLICK: EventName = "essay_review_submit_click";

/** AI 推荐点击 */
export const AI_RECOMMEND_CLICK: EventName = "ai_recommend_click";

/** AI 改稿点击 */
export const AI_REWRITE_CLICK: EventName = "ai_rewrite_click";

/** AI 改稿结果查看 */
export const AI_REWRITE_RESULT_VIEW: EventName = "ai_rewrite_result_view";

/** 人工批改申请点击 */
export const MANUAL_REVIEW_APPLY_CLICK: EventName = "manual_review_apply_click";

/** 人工批改订单创建 */
export const MANUAL_REVIEW_ORDER_CREATED: EventName = "manual_review_order_created";

/** 批改支付 CTA 点击 */
export const REVIEW_PAYMENT_CTA_CLICK: EventName = "review_payment_cta_click";

// ============================================================================
// 会员与转化事件
// ============================================================================

/** 会员页浏览 */
export const MEMBERSHIP_PAGE_VIEW: EventName = "membership_page_view";

/** 会员 CTA 点击 */
export const MEMBERSHIP_CTA_CLICK: EventName = "membership_cta_click";

// ============================================================================
// 账号与身份事件
// ============================================================================

/** 登录成功 */
export const LOGIN_SUCCESS: EventName = "login_success";

/** 退出登录点击 */
export const LOGOUT_CLICK: EventName = "logout_click";

/** 身份切换 */
export const IDENTITY_SWITCH: EventName = "identity_switch";

// ============================================================================
// 事件名称映射（用于调试/日志）
// ============================================================================

export const EVENT_NAME_MAP: Record<EventName, string> = {
  // 基础访问
  page_view: "页面浏览",
  activity_list_view: "活动列表浏览",
  activity_detail_view: "活动详情浏览",
  workspace_enter: "进入工作台",
  order_page_view: "订单页浏览",
  // 活动与投稿
  view_submission_method_click: "查看投稿方式点击",
  self_submission_create: "创建自主投稿",
  agent_submission_apply_click: "平台代投申请点击",
  agent_submission_created: "平台代投创建",
  agent_submission_cta_click: "平台代投CTA点击",
  // 作文与批改
  essay_upload_click: "作文上传点击",
  essay_review_page_view: "作文批改页浏览",
  essay_review_entry_click: "作文批改入口点击",
  essay_review_submit_click: "作文批改提交",
  ai_recommend_click: "AI推荐点击",
  ai_rewrite_click: "AI改稿点击",
  ai_rewrite_result_view: "AI改稿结果查看",
  manual_review_apply_click: "人工批改申请点击",
  manual_review_order_created: "人工批改订单创建",
  review_payment_cta_click: "批改支付CTA点击",
  // 会员与转化
  membership_page_view: "会员页浏览",
  membership_cta_click: "会员CTA点击",
  // 账号与身份
  login_success: "登录成功",
  logout_click: "退出登录点击",
  identity_switch: "身份切换",
};