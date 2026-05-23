// ============================================================================
// Mock 自主投稿记录数据
// ============================================================================

import type { SelfSubmission, SelfSubmissionListItem, CreateSelfSubmissionParams, SelfSubmissionStatus } from "@/types";
import { MOCK_ACTIVITIES } from "./activities";
import { MOCK_ESSAYS } from "./essays";

// 内存中的投稿记录（可持久化到 localStorage）
let selfSubmissionsStore: SelfSubmission[] = [
  {
    id: "sub-001",
    essayId: "essay-001",
    activityId: "act-001",
    identityId: "id-001",
    studentId: "stu-001",
    submissionEmail: "tongxincjb@163.com",
    submissionMethod: "email",
    userSubmissionTime: new Date("2024-05-10"),
    userNote: "已按要求格式投稿",
    submissionStatus: "waiting_reply",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-05-10"),
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-05-10"),
  },
  {
    id: "sub-002",
    essayId: "essay-002",
    activityId: "act-002",
    identityId: "id-001",
    studentId: "stu-001",
    submissionEmail: "zuowen@pinyinbao.com",
    submissionMethod: "email",
    userSubmissionTime: new Date("2024-04-15"),
    userNote: "等待初赛结果",
    submissionStatus: "shortlisted",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-04-15"),
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "sub-003",
    essayId: "essay-003",
    activityId: "act-004",
    identityId: "id-001",
    studentId: "stu-002",
    submissionEmail: "haogao@zuowenbang.com",
    submissionMethod: "email",
    userSubmissionTime: new Date("2024-05-15"),
    userNote: "",
    submissionStatus: "published",
    riskConfirmed: true,
    riskConfirmedAt: new Date("2024-05-15"),
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "sub-004",
    essayId: "essay-004",
    activityId: "act-005",
    identityId: "id-001",
    studentId: "stu-001",
    submissionEmail: "tonghua@fairytaleking.com",
    submissionMethod: "email",
    userSubmissionTime: undefined,
    userNote: "准备投稿中",
    submissionStatus: "pending",
    riskConfirmed: false,
    createdAt: new Date("2024-05-18"),
    updatedAt: new Date("2024-05-18"),
  },
];

// 统一状态枚举
export const SELF_SUBMISSION_STATUSES: SelfSubmissionStatus[] = [
  "pending",
  "user_submitted",
  "waiting_reply",
  "shortlisted",
  "planned_publish",
  "suspected_published",
  "published",
  "rejected",
  "closed",
];

/**
 * 获取所有自主投稿记录
 */
export function getMockSelfSubmissions(): SelfSubmission[] {
  return selfSubmissionsStore;
}

/**
 * 根据 identityId 获取自主投稿记录列表
 */
export function getMockSelfSubmissionsByIdentity(identityId: string): SelfSubmissionListItem[] {
  const submissions = selfSubmissionsStore.filter((s) => s.identityId === identityId);

  return submissions.map((sub) => {
    const essay = MOCK_ESSAYS.find((e) => e.id === sub.essayId);
    const activity = MOCK_ACTIVITIES.find((a) => a.id === sub.activityId);

    return {
      id: sub.id,
      essayTitle: essay?.title || "未知作文",
      activityTitle: activity?.title || "未知活动",
      activityPublisher: activity?.publisher?.name || "未知征稿方",
      submissionStatus: sub.submissionStatus,
      userSubmissionTime: sub.userSubmissionTime,
      createdAt: sub.createdAt,
    };
  });
}

/**
 * 创建新的自主投稿记录
 */
export function createMockSelfSubmission(
  params: CreateSelfSubmissionParams,
  identityId: string
): SelfSubmission {
  const newSubmission: SelfSubmission = {
    id: `sub-${Date.now()}`,
    essayId: params.essayId,
    activityId: params.activityId,
    identityId: identityId,
    studentId: "",
    submissionEmail: params.submissionEmail || "",
    submissionMethod: params.submissionMethod || "email",
    userSubmissionTime: new Date(),
    userNote: params.userNote || "",
    submissionStatus: "user_submitted",
    riskConfirmed: true,
    riskConfirmedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  selfSubmissionsStore.push(newSubmission);
  return newSubmission;
}

/**
 * 更新自主投稿状态
 */
export function updateMockSelfSubmissionStatus(
  submissionId: string,
  status: SelfSubmissionStatus,
  note?: string
): SelfSubmission | null {
  const submission = selfSubmissionsStore.find((s) => s.id === submissionId);
  if (!submission) return null;

  submission.submissionStatus = status;
  submission.updatedAt = new Date();

  if (note !== undefined) {
    submission.userNote = note;
  }

  return submission;
}

/**
 * 根据 ID 获取自主投稿详情
 */
export function getMockSelfSubmissionById(id: string): SelfSubmission | null {
  return selfSubmissionsStore.find((s) => s.id === id) || null;
}

/**
 * 获取某作文的所有自主投稿记录
 */
export function getMockSelfSubmissionsByEssayId(essayId: string): SelfSubmission[] {
  return selfSubmissionsStore.filter((s) => s.essayId === essayId);
}

/**
 * 获取某活动的所有自主投稿记录
 */
export function getMockSelfSubmissionsByActivityId(activityId: string): SelfSubmission[] {
  return selfSubmissionsStore.filter((s) => s.activityId === activityId);
}

/**
 * 删除自主投稿记录（仅 pending 状态可删除）
 */
export function deleteMockSelfSubmission(submissionId: string): boolean {
  const index = selfSubmissionsStore.findIndex((s) => s.id === submissionId);
  if (index === -1) return false;

  const submission = selfSubmissionsStore[index];
  if (submission.submissionStatus !== "pending") return false;

  selfSubmissionsStore.splice(index, 1);
  return true;
}