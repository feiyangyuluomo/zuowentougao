// ============================================================================
// 平台代投 Mock 数据
// ============================================================================

import type {
  AgentSubmissionTask,
  AgentSubmissionLog,
  AgentSubmissionScreenshot,
  AgentSubmissionListItem,
  AgentSubmissionFrontendStatus,
  AgentSubmissionBackendStatus,
  ApplyAgentSubmissionParams,
} from "@/types";
import { MOCK_ACTIVITIES } from "./activities";
import { MOCK_ESSAYS } from "./essays";
import { MOCK_STUDENTS } from "./students";

// ============================================================================
// 代投状态枚举
// ============================================================================

export const AGENT_SUBMISSION_FRONTEND_STATUSES: AgentSubmissionFrontendStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "submitted",
  "waiting_reply",
  "shortlisted",
  "planned_publish",
  "suspected_published",
  "published",
  "rejected",
  "closed",
];

export const AGENT_SUBMISSION_BACKEND_STATUSES: AgentSubmissionBackendStatus[] = [
  "waiting_assign",
  "assigned",
  "reviewing_essay",
  "selecting_activity",
  "preparing_submission",
  "submitting",
  "submit_failed",
  "submitted",
  "waiting_reply",
  "need_more_info",
  "suspected_duplicate",
  "suspected_multi_submission",
  "shortlisted",
  "planned_publish",
  "suspected_published",
  "published",
  "rejected",
  "closed",
];

// ============================================================================
// Mock 数据
// ============================================================================

let agentSubmissionsStore: AgentSubmissionTask[] = [
  {
    id: "agent-001",
    essayId: "essay-001",
    activityId: "act-001",
    identityId: "id-001",
    studentId: "stu-001",
    orderId: "order-001",
    operatorIdentityId: "op-001",
    platformSubmissionEmail: "agent@tougao.com",
    frontendStatus: "submitted",
    backendStatus: "submitted",
    priorityLevel: "medium",
    submissionTime: new Date("2024-05-15"),
    operatorNote: "已使用平台邮箱完成投稿",
    userVisibleNote: "您的作文已于5月15日完成投稿，请耐心等待回复",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-05-10"),
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "agent-002",
    essayId: "essay-002",
    activityId: "act-002",
    identityId: "id-001",
    studentId: "stu-001",
    orderId: "order-002",
    operatorIdentityId: "op-001",
    platformSubmissionEmail: "agent@tougao.com",
    frontendStatus: "waiting_reply",
    backendStatus: "waiting_reply",
    priorityLevel: "high",
    submissionTime: new Date("2024-04-20"),
    operatorNote: "已投稿，等待初审结果",
    userVisibleNote: "作文已投稿，等待征稿方回复",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-04-18"),
    createdAt: new Date("2024-04-18"),
    updatedAt: new Date("2024-04-20"),
  },
  {
    id: "agent-003",
    essayId: "essay-003",
    activityId: "act-003",
    identityId: "id-001",
    studentId: "stu-002",
    orderId: "order-003",
    operatorIdentityId: undefined,
    platformSubmissionEmail: undefined,
    frontendStatus: "preparing",
    backendStatus: "selecting_activity",
    priorityLevel: "medium",
    submissionTime: undefined,
    operatorNote: undefined,
    userVisibleNote: "运营人员正在为您筛选适合的活动",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-05-18"),
    createdAt: new Date("2024-05-18"),
    updatedAt: new Date("2024-05-19"),
  },
  {
    id: "agent-004",
    essayId: "essay-004",
    activityId: "act-004",
    identityId: "id-001",
    studentId: "stu-001",
    orderId: "order-004",
    operatorIdentityId: undefined,
    platformSubmissionEmail: undefined,
    frontendStatus: "pending",
    backendStatus: "waiting_assign",
    priorityLevel: "low",
    submissionTime: undefined,
    operatorNote: undefined,
    userVisibleNote: undefined,
    riskConfirmed: false,
    riskConfirmedAt: undefined,
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "agent-005",
    essayId: "essay-005",
    activityId: "act-005",
    identityId: "id-002",
    studentId: "stu-003",
    orderId: "order-005",
    operatorIdentityId: "op-002",
    platformSubmissionEmail: "agent@tougao.com",
    frontendStatus: "shortlisted",
    backendStatus: "shortlisted",
    priorityLevel: "high",
    submissionTime: new Date("2024-03-15"),
    operatorNote: "初审通过，进入拟录用阶段",
    userVisibleNote: "恭喜！您的作文已通过初审",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-04-01"),
  },
  {
    id: "agent-006",
    essayId: "essay-006",
    activityId: "act-006",
    identityId: "id-002",
    studentId: "stu-003",
    orderId: "order-006",
    operatorIdentityId: "op-002",
    platformSubmissionEmail: "agent@tougao.com",
    frontendStatus: "published",
    backendStatus: "published",
    priorityLevel: "high",
    submissionTime: new Date("2024-02-10"),
    operatorNote: "已刊登于《中学生报》",
    userVisibleNote: "恭喜！您的作文已于《中学生报》刊登",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-02-08"),
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-03-05"),
  },
];

// 截图存储
let screenshotsStore: AgentSubmissionScreenshot[] = [
  {
    id: "shot-001",
    taskId: "agent-001",
    screenshotType: "email_sent",
    fileUrl: "/images/screenshots/agent-001-email.png",
    visibleToUser: true,
    uploadedByIdentityId: "op-001",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "shot-002",
    taskId: "agent-001",
    screenshotType: "submit_success",
    fileUrl: "/images/screenshots/agent-001-success.png",
    visibleToUser: true,
    uploadedByIdentityId: "op-001",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "shot-003",
    taskId: "agent-002",
    screenshotType: "email_sent",
    fileUrl: "/images/screenshots/agent-002-email.png",
    visibleToUser: true,
    uploadedByIdentityId: "op-001",
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-04-20"),
  },
];

// 日志存储
let logsStore: AgentSubmissionLog[] = [
  {
    id: "log-001",
    taskId: "agent-001",
    operatorIdentityId: "op-001",
    oldFrontendStatus: undefined,
    newFrontendStatus: "pending",
    oldBackendStatus: undefined,
    newBackendStatus: "waiting_assign",
    note: "系统自动创建代投任务",
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-05-10"),
  },
  {
    id: "log-002",
    taskId: "agent-001",
    operatorIdentityId: "op-001",
    oldFrontendStatus: "pending",
    newFrontendStatus: "pending",
    oldBackendStatus: "waiting_assign",
    newBackendStatus: "assigned",
    note: "运营接单",
    createdAt: new Date("2024-05-11"),
    updatedAt: new Date("2024-05-11"),
  },
  {
    id: "log-003",
    taskId: "agent-001",
    operatorIdentityId: "op-001",
    oldFrontendStatus: "pending",
    newFrontendStatus: "accepted",
    oldBackendStatus: "assigned",
    newBackendStatus: "reviewing_essay",
    note: "审核作文通过",
    createdAt: new Date("2024-05-12"),
    updatedAt: new Date("2024-05-12"),
  },
  {
    id: "log-004",
    taskId: "agent-001",
    operatorIdentityId: "op-001",
    oldFrontendStatus: "accepted",
    newFrontendStatus: "accepted",
    oldBackendStatus: "reviewing_essay",
    newBackendStatus: "selecting_activity",
    note: "筛选活动：2024年\"童心向未来\"主题作文征集",
    createdAt: new Date("2024-05-13"),
    updatedAt: new Date("2024-05-13"),
  },
  {
    id: "log-005",
    taskId: "agent-001",
    operatorIdentityId: "op-001",
    oldFrontendStatus: "accepted",
    newFrontendStatus: "preparing",
    oldBackendStatus: "selecting_activity",
    newBackendStatus: "preparing_submission",
    note: "确认使用 tongxincjb@163.com 邮箱投稿",
    createdAt: new Date("2024-05-14"),
    updatedAt: new Date("2024-05-14"),
  },
  {
    id: "log-006",
    taskId: "agent-001",
    operatorIdentityId: "op-001",
    oldFrontendStatus: "preparing",
    newFrontendStatus: "submitted",
    oldBackendStatus: "preparing_submission",
    newBackendStatus: "submitted",
    note: "投稿成功，上传截图",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
];

// ============================================================================
// 查询函数
// ============================================================================

/**
 * 获取所有代投任务
 */
export function getMockAgentSubmissions(): AgentSubmissionTask[] {
  return agentSubmissionsStore;
}

/**
 * 根据 identityId 获取代投任务列表
 */
export function getMockAgentSubmissionsByIdentity(identityId: string): AgentSubmissionListItem[] {
  const tasks = agentSubmissionsStore.filter((t) => t.identityId === identityId);

  return tasks.map((task) => {
    const essay = MOCK_ESSAYS.find((e) => e.id === task.essayId);
    const activity = MOCK_ACTIVITIES.find((a) => a.id === task.activityId);
    const student = MOCK_STUDENTS.find((s) => s.id === task.studentId);

    return {
      id: task.id,
      essayTitle: essay?.title || "未知作文",
      activityTitle: activity?.title || "未知活动",
      studentName: student?.studentName || "未知学生",
      frontendStatus: task.frontendStatus,
      priorityLevel: task.priorityLevel,
      createdAt: task.createdAt,
      submissionTime: task.submissionTime,
    };
  });
}

/**
 * 获取单个代投任务详情
 */
export function getMockAgentSubmissionById(id: string): AgentSubmissionTask | null {
  return agentSubmissionsStore.find((t) => t.id === id) || null;
}

/**
 * 获取代投任务的截图
 */
export function getMockScreenshotsByTaskId(taskId: string, visibleToUser?: boolean): AgentSubmissionScreenshot[] {
  return screenshotsStore.filter((s) => {
    if (s.taskId !== taskId) return false;
    if (visibleToUser !== undefined && s.visibleToUser !== visibleToUser) return false;
    return true;
  });
}

/**
 * 获取代投任务的状态日志
 */
export function getMockAgentSubmissionLogs(taskId: string): AgentSubmissionLog[] {
  return logsStore.filter((l) => l.taskId === taskId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

// ============================================================================
// 写入函数
// ============================================================================

/**
 * 创建新的代投任务
 */
export function createMockAgentSubmission(
  params: ApplyAgentSubmissionParams,
  identityId: string,
  studentId: string
): AgentSubmissionTask {
  const newTask: AgentSubmissionTask = {
    id: `agent-${Date.now()}`,
    essayId: params.essayId,
    activityId: params.activityId,
    identityId: identityId,
    studentId: studentId,
    orderId: `order-${Date.now()}`,
    operatorIdentityId: undefined,
    platformSubmissionEmail: undefined,
    frontendStatus: "pending",
    backendStatus: "waiting_assign",
    priorityLevel: "medium",
    submissionTime: undefined,
    failureReason: undefined,
    operatorNote: undefined,
    userVisibleNote: undefined,
    riskConfirmed: params.riskConfirmed,
    riskConfirmedAt: params.riskConfirmed ? new Date() : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  agentSubmissionsStore.push(newTask);

  // 添加日志
  const log: AgentSubmissionLog = {
    id: `log-${Date.now()}`,
    taskId: newTask.id,
    operatorIdentityId: undefined,
    oldFrontendStatus: undefined,
    newFrontendStatus: "pending",
    oldBackendStatus: undefined,
    newBackendStatus: "waiting_assign",
    note: "用户提交代投申请",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  logsStore.push(log);

  return newTask;
}

/**
 * 更新代投任务前台状态
 */
export function updateMockAgentSubmissionFrontendStatus(
  taskId: string,
  status: AgentSubmissionFrontendStatus,
  note?: string
): AgentSubmissionTask | null {
  const task = agentSubmissionsStore.find((t) => t.id === taskId);
  if (!task) return null;

  const log: AgentSubmissionLog = {
    id: `log-${Date.now()}`,
    taskId: taskId,
    operatorIdentityId: undefined,
    oldFrontendStatus: task.frontendStatus,
    newFrontendStatus: status,
    oldBackendStatus: task.backendStatus,
    newBackendStatus: task.backendStatus,
    note: note || `前台状态更新为 ${status}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  logsStore.push(log);

  task.frontendStatus = status;
  task.updatedAt = new Date();

  return task;
}

/**
 * 更新代投任务后台状态
 */
export function updateMockAgentSubmissionBackendStatus(
  taskId: string,
  backendStatus: AgentSubmissionBackendStatus,
  frontendStatus: AgentSubmissionFrontendStatus,
  operatorId: string,
  note?: string,
  userVisibleNote?: string
): AgentSubmissionTask | null {
  const task = agentSubmissionsStore.find((t) => t.id === taskId);
  if (!task) return null;

  const log: AgentSubmissionLog = {
    id: `log-${Date.now()}`,
    taskId: taskId,
    operatorIdentityId: operatorId,
    oldFrontendStatus: task.frontendStatus,
    newFrontendStatus: frontendStatus,
    oldBackendStatus: task.backendStatus,
    newBackendStatus: backendStatus,
    note: note,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  logsStore.push(log);

  task.backendStatus = backendStatus;
  task.frontendStatus = frontendStatus;
  task.operatorIdentityId = operatorId;
  if (userVisibleNote) {
    task.userVisibleNote = userVisibleNote;
  }
  task.updatedAt = new Date();

  return task;
}

/**
 * 上传代投任务截图
 */
export function uploadMockSubmissionScreenshot(
  taskId: string,
  screenshot: Omit<AgentSubmissionScreenshot, "id" | "createdAt" | "updatedAt">
): AgentSubmissionScreenshot {
  const newScreenshot: AgentSubmissionScreenshot = {
    id: `shot-${Date.now()}`,
    taskId: screenshot.taskId,
    screenshotType: screenshot.screenshotType,
    fileUrl: screenshot.fileUrl,
    visibleToUser: screenshot.visibleToUser,
    uploadedByIdentityId: screenshot.uploadedByIdentityId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  screenshotsStore.push(newScreenshot);
  return newScreenshot;
}

/**
 * 运营接单
 */
export function acceptMockAgentSubmission(taskId: string, operatorId: string): AgentSubmissionTask | null {
  return updateMockAgentSubmissionBackendStatus(
    taskId,
    "assigned",
    "pending",
    operatorId,
    "运营接单",
    undefined
  );
}

/**
 * 获取所有待分配的任务
 */
export function getMockWaitingAssignTasks(): AgentSubmissionTask[] {
  return agentSubmissionsStore.filter((t) => t.backendStatus === "waiting_assign");
}

/**
 * 获取所有任务（用于运营后台）
 */
export function getMockAllAgentSubmissions(): AgentSubmissionTask[] {
  return agentSubmissionsStore;
}