// ============================================================================
// AgentSubmission Service
// 平台代投业务逻辑层
// ============================================================================

import type { AgentSubmissionListItem, AgentSubmissionTask } from "@/types";
import { AgentFrontendStatus } from "@prisma/client";
import { agentSubmissionRepository, essayRepository } from "@/server/repositories";

/**
 * 申请平台代投
 */
export async function applyAgentSubmission(params: {
  essayId: string;
  activityId: string;
  identityId: string;
  studentId: string;
  riskConfirmed: boolean;
}): Promise<AgentSubmissionTask | null> {
  // 验证作文存在
  const essay = await essayRepository.findById(params.essayId);
  if (!essay) return null;

  // 创建代投任务
  return agentSubmissionRepository.create({
    essayId: params.essayId,
    activityId: params.activityId,
    identityId: params.identityId,
    studentId: params.studentId,
    riskConfirmed: params.riskConfirmed,
  });
}

/**
 * 运营接单（快速模式：接单后直接完成投稿）
 */
export async function acceptAgentSubmission(
  taskId: string,
  operatorId: string
): Promise<AgentSubmissionTask | null> {
  return agentSubmissionRepository.acceptTask(taskId, operatorId);
}

/**
 * 更新代投任务状态
 */
export async function updateAgentSubmissionStatus(
  taskId: string,
  status: AgentFrontendStatus,
  note?: string
): Promise<AgentSubmissionTask | null> {
  return agentSubmissionRepository.updateFrontendStatus(taskId, status, note);
}

/**
 * 获取代投任务列表
 */
export async function getAgentSubmissions(identityId: string): Promise<AgentSubmissionListItem[]> {
  return agentSubmissionRepository.findByIdentity(identityId);
}

/**
 * 获取待分配任务列表（运营后台）
 */
export async function getWaitingAssignTasks(): Promise<AgentSubmissionTask[]> {
  return agentSubmissionRepository.findWaitingAssign();
}

/**
 * 上传投稿截图
 */
export async function uploadSubmissionScreenshot(params: {
  taskId: string;
  screenshotType: string;
  fileUrl: string;
  visibleToUser: boolean;
  uploadedByIdentityId: string;
}): Promise<boolean> {
  try {
    await agentSubmissionRepository.uploadScreenshot(params);
    return true;
  } catch {
    return false;
  }
}

/**
 * 校验用户是否可以查看该代投任务
 */
export async function canAccessAgentSubmission(
  identityId: string,
  taskId: string
): Promise<boolean> {
  const tasks = await agentSubmissionRepository.findByIdentity(identityId);
  return tasks.some((t) => t.id === taskId);
}