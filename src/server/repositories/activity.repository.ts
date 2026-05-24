// ============================================================================
// Activity Repository
// 活动数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Activity, ActivityListItem } from "@/types";
import { ActivityStatus, AuditStatus, PublisherType } from "@prisma/client";
import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";
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
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { publisher: true },
    });
    if (!activity) return null;
    return {
      id: activity.id,
      publisherId: activity.publisherId,
      publisher: undefined, // db模式需单独查询publisher表获取完整信息
      title: activity.title,
      activityType: activity.activityType ?? undefined,
      gradeScope: activity.gradeScope,
      genre: activity.genre ?? undefined,
      themeTags: activity.themeTags ?? undefined,
      submissionEmail: activity.submissionEmail ?? undefined,
      submissionMethod: activity.submissionMethod ?? undefined,
      submissionFormat: activity.submissionFormat ?? undefined,
      emailSubjectFormat: activity.emailSubjectFormat ?? undefined,
      deadline: activity.deadline ?? undefined,
      isLongTerm: activity.isLongTerm,
      hasPayment: activity.hasPayment,
      hasBonus: activity.hasBonus,
      hasCertificate: activity.hasCertificate,
      hasSampleIssue: activity.hasSampleIssue,
      hasTeacherGuide: activity.hasTeacherGuide,
      hasOrgAward: activity.hasOrgAward,
      supportSelfSubmission: activity.supportSelfSubmission,
      supportAgentSubmission: activity.supportAgentSubmission,
      activityStatus: activity.activityStatus as ActivityStatus,
      auditStatus: activity.auditStatus as AuditStatus,
      sourceUrl: activity.sourceUrl ?? undefined,
      originalDetail: activity.originalDetail ?? undefined,
      publicSummary: activity.publicSummary ?? undefined,
      paidDetail: activity.paidDetail ?? undefined,
      coverImage: activity.coverImage ?? undefined,
      views: activity.views,
      submissions: activity.submissions,
      originalUrl: activity.originalUrl ?? undefined,
      supplementMaterials: activity.supplementMaterials,
      writingSuggestions: activity.writingSuggestions ?? undefined,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
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
      }));
    }
    const activities = await prisma.activity.findMany({
      where: { auditStatus: "approved" },
      include: { publisher: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return activities.map((a) => ({
      id: a.id,
      title: a.title,
      publisherName: a.publisher?.name || "",
      gradeScope: a.gradeScope,
      hasPayment: a.hasPayment,
      hasCertificate: a.hasCertificate,
      deadline: a.deadline ?? undefined,
      isLongTerm: a.isLongTerm,
      activityStatus: a.activityStatus as ActivityStatus,
      publicSummary: a.publicSummary || "",
      coverImage: a.coverImage ?? undefined,
    }));
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
      }));
    }
    const where: Record<string, unknown> = { auditStatus: "approved" };
    if (filters.gradeScope && filters.gradeScope.length > 0) {
      where.gradeScope = { hasSome: filters.gradeScope };
    }
    if (filters.genre && filters.genre.length > 0) {
      where.genre = { hasSome: filters.genre };
    }
    if (filters.activityStatus) {
      where.activityStatus = filters.activityStatus;
    }
    if (filters.hasPayment !== undefined) {
      where.hasPayment = filters.hasPayment;
    }
    if (filters.hasCertificate !== undefined) {
      where.hasCertificate = filters.hasCertificate;
    }
    if (filters.keyword) {
      where.OR = [
        { title: { contains: filters.keyword, mode: "insensitive" } },
        { publicSummary: { contains: filters.keyword, mode: "insensitive" } },
      ];
    }
    const activities = await prisma.activity.findMany({
      where,
      include: { publisher: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return activities.map((a) => ({
      id: a.id,
      title: a.title,
      publisherName: a.publisher?.name || "",
      gradeScope: a.gradeScope,
      hasPayment: a.hasPayment,
      hasCertificate: a.hasCertificate,
      deadline: a.deadline ?? undefined,
      isLongTerm: a.isLongTerm,
      activityStatus: a.activityStatus as ActivityStatus,
      publicSummary: a.publicSummary || "",
      coverImage: a.coverImage ?? undefined,
    }));
  }
}

// 单例导出
export const activityRepository = new ActivityRepository();