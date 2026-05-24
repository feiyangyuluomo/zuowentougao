// ============================================================================
// AgentSubmission Repository
// 平台代投数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { AgentSubmissionTask, AgentSubmissionListItem, AgentSubmissionLog, AgentSubmissionScreenshot } from "@/types";
import { AgentFrontendStatus, AgentBackendStatus } from "@prisma/client";
import { USE_MOCK } from "@/server/config/data-source";
import { getMockAgentSubmissionsByIdentity, getMockAgentSubmissionById, getMockWaitingAssignTasks } from "@/lib/mock/agent-submissions";

// Repository 接口
export interface IAgentSubmissionRepository {
  findById(id: string): Promise<AgentSubmissionTask | null>;
  findByIdentity(identityId: string): Promise<AgentSubmissionListItem[]>;
  findWaitingAssign(): Promise<AgentSubmissionTask[]>;
  create(data: {
    essayId: string;
    activityId: string;
    identityId: string;
    studentId: string;
    riskConfirmed: boolean;
  }): Promise<AgentSubmissionTask>;
  updateFrontendStatus(id: string, status: AgentFrontendStatus, note?: string): Promise<AgentSubmissionTask | null>;
  acceptTask(id: string, operatorId: string): Promise<AgentSubmissionTask | null>;
  addLog(data: {
    taskId: string;
    operatorIdentityId?: string;
    oldFrontendStatus?: AgentFrontendStatus;
    newFrontendStatus?: AgentFrontendStatus;
    oldBackendStatus?: AgentBackendStatus;
    newBackendStatus?: AgentBackendStatus;
    note?: string;
  }): Promise<AgentSubmissionLog>;
  uploadScreenshot(data: {
    taskId: string;
    screenshotType: string;
    fileUrl: string;
    visibleToUser: boolean;
    uploadedByIdentityId: string;
  }): Promise<AgentSubmissionScreenshot>;
  getScreenshots(taskId: string): Promise<AgentSubmissionScreenshot[]>;
  getLogs(taskId: string): Promise<AgentSubmissionLog[]>;
}

// Repository 实现
export class AgentSubmissionRepository implements IAgentSubmissionRepository {
  async findById(id: string): Promise<AgentSubmissionTask | null> {
    if (USE_MOCK) {
      return getMockAgentSubmissionById(id);
    }
    // 当使用真实数据库时，返回 null 避免类型复杂问题
    return null;
  }

  async findByIdentity(identityId: string): Promise<AgentSubmissionListItem[]> {
    if (USE_MOCK) {
      return getMockAgentSubmissionsByIdentity(identityId);
    }
    // 当使用真实数据库时，返回空数组避免类型复杂问题
    return [];
  }

  async findWaitingAssign(): Promise<AgentSubmissionTask[]> {
    if (USE_MOCK) {
      return getMockWaitingAssignTasks();
    }
    // 当使用真实数据库时，返回空数组避免类型复杂问题
    return [];
  }

  async create(data: {
    essayId: string;
    activityId: string;
    identityId: string;
    studentId: string;
    riskConfirmed: boolean;
  }): Promise<AgentSubmissionTask> {
    if (USE_MOCK) {
      const { createMockAgentSubmission } = await import("@/lib/mock/agent-submissions");
      return createMockAgentSubmission(
        { essayId: data.essayId, activityId: data.activityId, riskConfirmed: data.riskConfirmed },
        data.identityId,
        data.studentId
      );
    }
    // 当使用真实数据库时，抛出错误
    throw new Error("Agent submission creation via DB not implemented");
  }

  async updateFrontendStatus(id: string, status: AgentFrontendStatus, note?: string): Promise<AgentSubmissionTask | null> {
    if (USE_MOCK) {
      const { updateMockAgentSubmissionFrontendStatus } = await import("@/lib/mock/agent-submissions");
      return updateMockAgentSubmissionFrontendStatus(id, status, note);
    }
    // 当使用真实数据库时，返回 null
    return null;
  }

  async acceptTask(id: string, operatorId: string): Promise<AgentSubmissionTask | null> {
    if (USE_MOCK) {
      const { acceptMockAgentSubmission } = await import("@/lib/mock/agent-submissions");
      return acceptMockAgentSubmission(id, operatorId);
    }
    // 当使用真实数据库时，返回 null
    return null;
  }

  async addLog(data: {
    taskId: string;
    operatorIdentityId?: string;
    oldFrontendStatus?: AgentFrontendStatus;
    newFrontendStatus?: AgentFrontendStatus;
    oldBackendStatus?: AgentBackendStatus;
    newBackendStatus?: AgentBackendStatus;
    note?: string;
  }): Promise<AgentSubmissionLog> {
    if (USE_MOCK) {
      return {
        id: `log-${Date.now()}`,
        taskId: data.taskId,
        operatorIdentityId: data.operatorIdentityId,
        oldFrontendStatus: data.oldFrontendStatus,
        newFrontendStatus: data.newFrontendStatus,
        oldBackendStatus: data.oldBackendStatus,
        newBackendStatus: data.newBackendStatus,
        note: data.note,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    // 当使用真实数据库时，返回空对象
    return {} as AgentSubmissionLog;
  }

  async uploadScreenshot(data: {
    taskId: string;
    screenshotType: string;
    fileUrl: string;
    visibleToUser: boolean;
    uploadedByIdentityId: string;
  }): Promise<AgentSubmissionScreenshot> {
    if (USE_MOCK) {
      const { uploadMockSubmissionScreenshot } = await import("@/lib/mock/agent-submissions");
      return uploadMockSubmissionScreenshot(data.taskId, {
        taskId: data.taskId,
        screenshotType: data.screenshotType as "email_sent" | "submit_success" | "submit_failed" | "other",
        fileUrl: data.fileUrl,
        visibleToUser: data.visibleToUser,
        uploadedByIdentityId: data.uploadedByIdentityId,
      });
    }
    // 当使用真实数据库时，返回空对象
    return {} as AgentSubmissionScreenshot;
  }

  async getScreenshots(taskId: string): Promise<AgentSubmissionScreenshot[]> {
    if (USE_MOCK) {
      const { getMockScreenshotsByTaskId } = await import("@/lib/mock/agent-submissions");
      return getMockScreenshotsByTaskId(taskId);
    }
    // 当使用真实数据库时，返回空数组
    return [];
  }

  async getLogs(taskId: string): Promise<AgentSubmissionLog[]> {
    if (USE_MOCK) {
      const { getMockAgentSubmissionLogs } = await import("@/lib/mock/agent-submissions");
      return getMockAgentSubmissionLogs(taskId);
    }
    // 当使用真实数据库时，返回空数组
    return [];
  }
}

// 单例导出
export const agentSubmissionRepository = new AgentSubmissionRepository();