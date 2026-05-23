// ============================================================================
// 运营工作流状态工具
// ============================================================================

import type { AgentSubmissionFrontendStatus, AgentSubmissionBackendStatus } from "@/types";

// ============================================================================
// 前台状态
// ============================================================================

export const FRONTEND_STATUS_CONFIG: Record<
  AgentSubmissionFrontendStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: { label: "待处理", color: "text-gray-700", bgColor: "bg-gray-100" },
  accepted: { label: "已接单", color: "text-blue-700", bgColor: "bg-blue-100" },
  preparing: { label: "投稿准备中", color: "text-purple-700", bgColor: "bg-purple-100" },
  submitted: { label: "已投稿", color: "text-green-700", bgColor: "bg-green-100" },
  waiting_reply: { label: "等待回复", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  shortlisted: { label: "初审通过", color: "text-teal-700", bgColor: "bg-teal-100" },
  planned_publish: { label: "拟录用", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  suspected_published: { label: "疑似发表", color: "text-orange-700", bgColor: "bg-orange-100" },
  published: { label: "已刊登", color: "text-white", bgColor: "bg-green-600" },
  rejected: { label: "未录用", color: "text-red-700", bgColor: "bg-red-100" },
  closed: { label: "已结束", color: "text-gray-500", bgColor: "bg-gray-100" },
};

// ============================================================================
// 后台状态
// ============================================================================

export const BACKEND_STATUS_CONFIG: Record<
  AgentSubmissionBackendStatus,
  { label: string; color: string; bgColor: string }
> = {
  waiting_assign: { label: "待分配", color: "text-gray-700", bgColor: "bg-gray-100" },
  assigned: { label: "已分配", color: "text-blue-700", bgColor: "bg-blue-100" },
  reviewing_essay: { label: "审核作文", color: "text-purple-700", bgColor: "bg-purple-100" },
  selecting_activity: { label: "筛选活动", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  preparing_submission: { label: "准备投稿", color: "text-cyan-700", bgColor: "bg-cyan-100" },
  submitting: { label: "投稿中", color: "text-orange-700", bgColor: "bg-orange-100" },
  submit_failed: { label: "投稿失败", color: "text-red-700", bgColor: "bg-red-100" },
  submitted: { label: "已投稿", color: "text-green-700", bgColor: "bg-green-100" },
  waiting_reply: { label: "等待回复", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  need_more_info: { label: "需补充资料", color: "text-amber-700", bgColor: "bg-amber-100" },
  suspected_duplicate: { label: "疑似重复", color: "text-orange-700", bgColor: "bg-orange-100" },
  suspected_multi_submission: { label: "疑似一稿多投", color: "text-red-700", bgColor: "bg-red-100" },
  shortlisted: { label: "初审通过", color: "text-teal-700", bgColor: "bg-teal-100" },
  planned_publish: { label: "拟录用", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  suspected_published: { label: "疑似发表", color: "text-orange-700", bgColor: "bg-orange-100" },
  published: { label: "已刊登", color: "text-white", bgColor: "bg-green-600" },
  rejected: { label: "未录用", color: "text-red-700", bgColor: "bg-red-100" },
  closed: { label: "已关闭", color: "text-gray-500", bgColor: "bg-gray-100" },
};

// ============================================================================
// 状态流转操作
// ============================================================================

// 运营可执行的操作
export interface StatusTransition {
  label: string;
  targetStatus: AgentSubmissionBackendStatus;
  targetFrontendStatus: AgentSubmissionFrontendStatus;
  note?: string;
}

export const STATUS_TRANSITIONS: Record<AgentSubmissionBackendStatus, StatusTransition[]> = {
  waiting_assign: [
    { label: "接单", targetStatus: "assigned", targetFrontendStatus: "pending", note: "运营接单" },
  ],
  assigned: [
    { label: "开始审核", targetStatus: "reviewing_essay", targetFrontendStatus: "accepted", note: "开始审核作文" },
  ],
  reviewing_essay: [
    { label: "通过", targetStatus: "selecting_activity", targetFrontendStatus: "accepted", note: "作文审核通过" },
    { label: "需补充资料", targetStatus: "need_more_info", targetFrontendStatus: "pending", note: "需要用户补充资料" },
  ],
  selecting_activity: [
    { label: "确认活动", targetStatus: "preparing_submission", targetFrontendStatus: "preparing", note: "确认投稿活动" },
  ],
  preparing_submission: [
    { label: "开始投稿", targetStatus: "submitting", targetFrontendStatus: "preparing", note: "开始执行投稿" },
  ],
  submitting: [
    { label: "投稿成功", targetStatus: "submitted", targetFrontendStatus: "submitted", note: "投稿成功" },
    { label: "投稿失败", targetStatus: "submit_failed", targetFrontendStatus: "preparing", note: "投稿失败" },
  ],
  submit_failed: [
    { label: "重新投稿", targetStatus: "preparing_submission", targetFrontendStatus: "preparing", note: "重新准备投稿" },
  ],
  submitted: [
    { label: "初审通过", targetStatus: "shortlisted", targetFrontendStatus: "shortlisted", note: "征稿方初审通过" },
    { label: "等待回复", targetStatus: "waiting_reply", targetFrontendStatus: "waiting_reply", note: "等待征稿方回复" },
  ],
  waiting_reply: [
    { label: "拟录用", targetStatus: "planned_publish", targetFrontendStatus: "planned_publish", note: "征稿方拟录用" },
    { label: "未录用", targetStatus: "rejected", targetFrontendStatus: "rejected", note: "征稿方未录用" },
  ],
  need_more_info: [
    { label: "补充完成", targetStatus: "reviewing_essay", targetFrontendStatus: "accepted", note: "用户补充资料完成" },
  ],
  suspected_duplicate: [
    { label: "确认重复", targetStatus: "closed", targetFrontendStatus: "closed", note: "确认重复投稿，关闭任务" },
    { label: "不是重复", targetStatus: "reviewing_essay", targetFrontendStatus: "accepted", note: "确认不是重复投稿" },
  ],
  suspected_multi_submission: [
    { label: "确认一稿多投", targetStatus: "closed", targetFrontendStatus: "closed", note: "确认一稿多投，关闭任务" },
    { label: "不是一稿多投", targetStatus: "reviewing_essay", targetFrontendStatus: "accepted", note: "确认不是一稿多投" },
  ],
  shortlisted: [
    { label: "正式录用", targetStatus: "published", targetFrontendStatus: "published", note: "正式刊登" },
    { label: "拟录用", targetStatus: "planned_publish", targetFrontendStatus: "planned_publish", note: "拟录用待确认" },
  ],
  planned_publish: [
    { label: "正式刊登", targetStatus: "published", targetFrontendStatus: "published", note: "正式刊登" },
    { label: "未刊登", targetStatus: "rejected", targetFrontendStatus: "rejected", note: "最终未刊登" },
  ],
  suspected_published: [
    { label: "确认刊登", targetStatus: "published", targetFrontendStatus: "published", note: "确认已刊登" },
    { label: "未刊登", targetStatus: "rejected", targetFrontendStatus: "rejected", note: "确认未刊登" },
  ],
  published: [
    { label: "关闭", targetStatus: "closed", targetFrontendStatus: "closed", note: "任务完成关闭" },
  ],
  rejected: [
    { label: "关闭", targetStatus: "closed", targetFrontendStatus: "closed", note: "任务关闭" },
  ],
  closed: [],
};

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 获取状态标签
 */
export function getFrontendStatusLabel(status: AgentSubmissionFrontendStatus): string {
  return FRONTEND_STATUS_CONFIG[status]?.label || status;
}

export function getBackendStatusLabel(status: AgentSubmissionBackendStatus): string {
  return BACKEND_STATUS_CONFIG[status]?.label || status;
}

/**
 * 获取状态样式
 */
export function getFrontendStatusStyle(status: AgentSubmissionFrontendStatus) {
  return FRONTEND_STATUS_CONFIG[status] || { label: status, color: "text-gray-700", bgColor: "bg-gray-100" };
}

export function getBackendStatusStyle(status: AgentSubmissionBackendStatus) {
  return BACKEND_STATUS_CONFIG[status] || { label: status, color: "text-gray-700", bgColor: "bg-gray-100" };
}

/**
 * 获取当前状态的可执行操作
 */
export function getAvailableTransitions(status: AgentSubmissionBackendStatus): StatusTransition[] {
  return STATUS_TRANSITIONS[status] || [];
}