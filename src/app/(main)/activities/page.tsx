"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityFilter } from "@/components/activities/ActivityFilter";
import { EmptyState } from "@/components/common";
import { getActivities } from "@/lib/api/activity-api";
import { ACTIVITY_LIST_VIEW, trackEvent } from "@/lib/analytics";

export default function ActivitiesPage() {
  const { isMember } = useAuthStore();
  const [filters, setFilters] = useState<{
    keyword?: string;
    gradeScope?: string[];
    genre?: string[];
    activityStatus?: string;
    hasPayment?: boolean;
    hasCertificate?: boolean;
    hasSampleIssue?: boolean;
    hasBonus?: boolean;
    hasTeacherGuide?: boolean;
    hasOrgAward?: boolean;
  }>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载活动数据
  useEffect(() => {
    async function loadActivities() {
      setLoading(true);
      try {
        const data = await getActivities({
          keyword: filters.keyword,
          gradeScope: filters.gradeScope,
          genre: filters.genre,
          hasPayment: filters.hasPayment,
          hasCertificate: filters.hasCertificate,
        });
        setActivities(data);
      } catch (error) {
        console.error("加载活动失败:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, [filters]);

  // 页面浏览埋点
  useEffect(() => {
    trackEvent(ACTIVITY_LIST_VIEW, {
      keyword: filters.keyword,
      gradeScope: filters.gradeScope,
      genre: filters.genre,
      activityStatus: filters.activityStatus,
      resultCount: activities.length,
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">活动库</h1>
          <p className="text-gray-600 mt-1">
            浏览各类作文征稿活动，找到适合的投稿渠道
            {!isMember() && (
              <span className="text-amber-600 ml-2">（登录后可查看完整投稿方式）</span>
            )}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <ActivityFilter onFilterChange={setFilters} />

      {/* Results */}
      <div className="mt-6">
        <div className="text-sm text-gray-500 mb-4">
          {loading ? "加载中..." : `共找到 ${activities.length} 个活动`}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            variant="no-results"
            title="未找到符合条件的活动"
            description="请尝试调整筛选条件"
            action={{
              label: "清除筛选",
              onClick: () => setFilters({}),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showMemberBadge={isMember()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}