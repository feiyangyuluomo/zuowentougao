// ============================================================================
// Activity Service
// 活动业务逻辑层
// ============================================================================

import { ActivityStatus } from "@prisma/client";
import { activityRepository } from "@/server/repositories";
import type { ActivityListItem } from "@/types";

// 活动状态中文名称
export const ACTIVITY_STATUS_LABELS: Record<string, string> = {
  upcoming: "即将开始",
  ongoing: "进行中",
  ended: "已结束",
  published: "已公布",
};

/**
 * 获取活动列表
 */
export async function getActivityList(): Promise<ActivityListItem[]> {
  return activityRepository.findAll();
}

/**
 * 筛选活动
 */
export async function filterActivities(filters: {
  gradeScope?: string[];
  genre?: string[];
  activityStatus?: ActivityStatus;
  keyword?: string;
  hasPayment?: boolean;
  hasCertificate?: boolean;
}): Promise<ActivityListItem[]> {
  return activityRepository.filter(filters);
}

/**
 * 获取单个活动详情
 */
export async function getActivityById(id: string) {
  return activityRepository.findById(id);
}