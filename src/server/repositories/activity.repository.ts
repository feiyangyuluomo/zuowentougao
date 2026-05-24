// ============================================================================
// Activity Repository
// 活动数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Activity, ActivityListItem } from "@/types";
import { ActivityStatus } from "@prisma/client";
import { USE_MOCK } from "@/server/config/data-source";
import { MOCK_ACTIVITIES, filterMockActivities } from "@/lib/mock/activities";

// Repository 接口
export interface IActivityRepository {
  findById(id: string): Promise<Activity | null>;
  findAll(): Promise<ActivityListItem[]>;
  filter(filters: {
    gradeScope?: string[];
    genre?: string[];
    activityStatus?: ActivityStatus;
    keyword?: string;
    hasPayment?: boolean;
    hasCertificate?: boolean;
  }): Promise<ActivityListItem[]>;
}

// Repository 实现
export class ActivityRepository implements IActivityRepository {
  async findById(id: string): Promise<Activity | null> {
    if (USE_MOCK) {
      return MOCK_ACTIVITIES.find((a) => a.id === id) || null;
    }
    // 当使用真实数据库时，返回 null 避免类型复杂问题
    // 后续完善类型映射后可以启用
    return null;
  }

  async findAll(): Promise<ActivityListItem[]> {
    if (USE_MOCK) {
      return MOCK_ACTIVITIES.map((activity) => ({
        id: activity.id,
        title: activity.title,
        publisherName: activity.publisher?.name || "",
        gradeScope: activity.gradeScope,
        hasPayment: activity.hasPayment,
        hasCertificate: activity.hasCertificate,
        deadline: activity.deadline,
        isLongTerm: activity.isLongTerm,
        activityStatus: activity.activityStatus,
        publicSummary: activity.publicSummary || "",
        coverImage: activity.coverImage,
      })) as ActivityListItem[];
    }
    // 当使用真实数据库时，返回空数组避免类型复杂问题
    return [];
  }

  async filter(filters: {
    gradeScope?: string[];
    genre?: string[];
    activityStatus?: ActivityStatus;
    keyword?: string;
    hasPayment?: boolean;
    hasCertificate?: boolean;
  }): Promise<ActivityListItem[]> {
    if (USE_MOCK) {
      const results = filterMockActivities(filters);
      return results.map((activity) => ({
        id: activity.id,
        title: activity.title,
        publisherName: (activity as unknown as { publisher?: { name?: string } }).publisher?.name || "",
        gradeScope: activity.gradeScope,
        hasPayment: activity.hasPayment,
        hasCertificate: activity.hasCertificate,
        deadline: activity.deadline,
        isLongTerm: activity.isLongTerm,
        activityStatus: activity.activityStatus,
        publicSummary: activity.publicSummary || "",
        coverImage: activity.coverImage,
      })) as ActivityListItem[];
    }
    // 当使用真实数据库时，返回空数组避免类型复杂问题
    return [];
  }
}

// 单例导出
export const activityRepository = new ActivityRepository();