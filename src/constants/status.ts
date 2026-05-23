// ============================================================================
// 状态枚举常量
// ============================================================================

import type {
  ActivityStatus,
  AuditStatus,
  SubmissionMethod,
  SelfSubmissionStatus,
  AgentSubmissionFrontendStatus,
  AgentSubmissionBackendStatus,
  EssayStatus,
  PaymentStatus,
  NotificationType,
} from "@/types/common";

// ============================================================================
// 活动状态
// ============================================================================

export const ACTIVITY_STATUS: Record<ActivityStatus, { label: string; color: string }> = {
  recruiting: { label: "征稿中", color: "bg-green-100 text-green-800" },
  closing_soon: { label: "即将截止", color: "bg-yellow-100 text-yellow-800" },
  closed: { label: "已截止", color: "bg-gray-100 text-gray-800" },
  long_term: { label: "长期征稿", color: "bg-blue-100 text-blue-800" },
};

export const ACTIVITY_STATUS_LIST: ActivityStatus[] = [
  "recruiting",
  "closing_soon",
  "closed",
  "long_term",
];

// ============================================================================
// 审核状态
// ============================================================================

export const AUDIT_STATUS: Record<AuditStatus, { label: string; color: string }> = {
  pending: { label: "待审核", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "已通过", color: "bg-green-100 text-green-800" },
  rejected: { label: "未通过", color: "bg-red-100 text-red-800" },
};

// ============================================================================
// 投稿方式
// ============================================================================

export const SUBMISSION_METHOD: Record<SubmissionMethod, { label: string; icon: string }> = {
  email: { label: "邮箱投稿", icon: "mail" },
  website: { label: "官网投稿", icon: "globe" },
  mini_program: { label: "小程序投稿", icon: "smartphone" },
  wechat: { label: "微信投稿", icon: "message-circle" },
  system: { label: "系统投稿", icon: "database" },
  offline: { label: "线下投稿", icon: "map-pin" },
  other: { label: "其他方式", icon: "more-horizontal" },
};

// ============================================================================
// 自主投稿状态
// ============================================================================

export const SELF_SUBMISSION_STATUS: Record<SelfSubmissionStatus, { label: string; color: string }> = {
  pending: { label: "待投稿", color: "bg-gray-100 text-gray-800" },
  user_submitted: { label: "已投稿", color: "bg-blue-100 text-blue-800" },
  waiting_reply: { label: "等待回复", color: "bg-indigo-100 text-indigo-800" },
  shortlisted: { label: "初审通过", color: "bg-purple-100 text-purple-800" },
  planned_publish: { label: "拟录用", color: "bg-indigo-100 text-indigo-800" },
  suspected_published: { label: "疑似发表", color: "bg-orange-100 text-orange-800" },
  published: { label: "已刊登", color: "bg-green-100 text-green-800" },
  rejected: { label: "未录用", color: "bg-red-100 text-red-800" },
  closed: { label: "已结束", color: "bg-gray-100 text-gray-800" },
};

// ============================================================================
// 平台代投前台状态
// ============================================================================

export const AGENT_SUBMISSION_FRONTEND_STATUS: Record<AgentSubmissionFrontendStatus, { label: string; color: string }> = {
  pending: { label: "待处理", color: "bg-gray-100 text-gray-800" },
  accepted: { label: "已接单", color: "bg-blue-100 text-blue-800" },
  preparing: { label: "投稿准备中", color: "bg-indigo-100 text-indigo-800" },
  submitted: { label: "已投稿", color: "bg-blue-100 text-blue-800" },
  waiting_reply: { label: "等待回复", color: "bg-indigo-100 text-indigo-800" },
  shortlisted: { label: "初审通过", color: "bg-purple-100 text-purple-800" },
  planned_publish: { label: "拟录用", color: "bg-indigo-100 text-indigo-800" },
  suspected_published: { label: "疑似发表", color: "bg-orange-100 text-orange-800" },
  published: { label: "已刊登", color: "bg-green-100 text-green-800" },
  rejected: { label: "未录用", color: "bg-red-100 text-red-800" },
  closed: { label: "已结束", color: "bg-gray-100 text-gray-800" },
};

// ============================================================================
// 平台代投后台状态
// ============================================================================

export const AGENT_SUBMISSION_BACKEND_STATUS: Record<AgentSubmissionBackendStatus, { label: string; color: string; isInternal: boolean }> = {
  waiting_assign: { label: "待分配", color: "bg-gray-100 text-gray-800", isInternal: true },
  assigned: { label: "已分配", color: "bg-blue-100 text-blue-800", isInternal: true },
  reviewing_essay: { label: "审核作文中", color: "bg-indigo-100 text-indigo-800", isInternal: true },
  selecting_activity: { label: "筛选活动中", color: "bg-indigo-100 text-indigo-800", isInternal: true },
  preparing_submission: { label: "准备投稿", color: "bg-indigo-100 text-indigo-800", isInternal: true },
  submitting: { label: "投稿中", color: "bg-blue-100 text-blue-800", isInternal: true },
  submit_failed: { label: "投稿失败", color: "bg-red-100 text-red-800", isInternal: true },
  submitted: { label: "已投稿", color: "bg-blue-100 text-blue-800", isInternal: false },
  waiting_reply: { label: "等待回复", color: "bg-indigo-100 text-indigo-800", isInternal: false },
  need_more_info: { label: "需补充资料", color: "bg-yellow-100 text-yellow-800", isInternal: true },
  suspected_duplicate: { label: "疑似重复", color: "bg-orange-100 text-orange-800", isInternal: true },
  suspected_multi_submission: { label: "疑似一稿多投", color: "bg-orange-100 text-orange-800", isInternal: true },
  shortlisted: { label: "初审通过", color: "bg-purple-100 text-purple-800", isInternal: false },
  planned_publish: { label: "拟录用", color: "bg-indigo-100 text-indigo-800", isInternal: false },
  suspected_published: { label: "疑似发表", color: "bg-orange-100 text-orange-800", isInternal: false },
  published: { label: "已刊登", color: "bg-green-100 text-green-800", isInternal: false },
  rejected: { label: "未录用", color: "bg-red-100 text-red-800", isInternal: false },
  closed: { label: "已关闭", color: "bg-gray-100 text-gray-800", isInternal: false },
};

// ============================================================================
// 作文状态
// ============================================================================

export const ESSAY_STATUS: Record<EssayStatus, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-gray-100 text-gray-800" },
  published: { label: "已发布", color: "bg-green-100 text-green-800" },
  archived: { label: "已归档", color: "bg-gray-100 text-gray-800" },
};

// ============================================================================
// 支付状态
// ============================================================================

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "待支付", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "已支付", color: "bg-green-100 text-green-800" },
  refunded: { label: "已退款", color: "bg-gray-100 text-gray-800" },
  partially_refunded: { label: "部分退款", color: "bg-orange-100 text-orange-800" },
  closed: { label: "已关闭", color: "bg-gray-100 text-gray-800" },
};

// ============================================================================
// 消息类型
// ============================================================================

export const NOTIFICATION_TYPE: Record<NotificationType, { label: string; icon: string }> = {
  activity_deadline: { label: "活动截止提醒", icon: "clock" },
  self_submission_reminder: { label: "自主投稿提醒", icon: "send" },
  agent_submission_update: { label: "代投状态更新", icon: "refresh-cw" },
  screenshot_uploaded: { label: "截图上传提醒", icon: "image" },
  suspected_published: { label: "疑似发表提醒", icon: "check-circle" },
  membership_renew: { label: "会员续费提醒", icon: "credit-card" },
  system_notice: { label: "系统通知", icon: "bell" },
};