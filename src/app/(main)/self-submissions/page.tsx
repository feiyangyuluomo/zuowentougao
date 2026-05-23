"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common";
import { PaywallBlock } from "@/components/common";
import { useAuthStore } from "@/stores";
import { getMockSelfSubmissionsByIdentity, SELF_SUBMISSION_STATUSES } from "@/lib/mock/self-submissions";
import { getSubmissionStatusBadge } from "@/lib/utils";
import { Plus, Search, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import type { SelfSubmissionListItem, SelfSubmissionStatus } from "@/types";

export default function SelfSubmissionsPage() {
  const { isAuthenticated, currentIdentity } = useAuthStore();
  const [submissions, setSubmissions] = useState<SelfSubmissionListItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // 加载数据
  useEffect(() => {
    if (isAuthenticated() && currentIdentity) {
      const data = getMockSelfSubmissionsByIdentity(currentIdentity.id);
      setSubmissions(data);
    }
  }, [isAuthenticated, currentIdentity, refreshKey]);

  // 过滤
  const filteredSubmissions = submissions.filter((sub) => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      if (
        !sub.essayTitle.toLowerCase().includes(keyword) &&
        !sub.activityTitle.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }
    if (selectedStatus !== "all" && sub.submissionStatus !== selectedStatus) {
      return false;
    }
    return true;
  });

  // 未登录
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaywallBlock
          title="登录后查看投稿记录"
          description="自主投稿记录需要登录后才能查看"
          action={{ label: "立即登录", href: "/login" }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">自主投稿记录</h1>
          <p className="text-gray-600 mt-1">
            记录您自主完成的投稿，跟踪投稿状态和结果
          </p>
        </div>
        <Link href="/self-submissions/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            记录投稿
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索作文或活动..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs - 状态筛选 */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">待投稿</TabsTrigger>
          <TabsTrigger value="user_submitted">已投稿</TabsTrigger>
          <TabsTrigger value="waiting_reply">等待回复</TabsTrigger>
          <TabsTrigger value="published">已刊登</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Submission List */}
      {filteredSubmissions.length === 0 ? (
        <EmptyState
          variant="no-data"
          className="mt-8"
          title="暂无投稿记录"
          description="记录您的第一次自主投稿，开始您的投稿之旅"
          action={{
            label: "记录投稿",
            href: "/activities",
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSubmissionStatusBadge(submission.submissionStatus)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {submission.essayTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      投给：{submission.activityTitle}
                    </p>
                    <p className="text-sm text-gray-400">
                      {submission.activityPublisher}
                    </p>
                    {submission.userSubmissionTime && (
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          投稿时间：{new Date(submission.userSubmissionTime).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/activities/${submission.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        查看
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}