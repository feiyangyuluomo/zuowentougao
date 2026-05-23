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
import { getMockAgentSubmissionsByIdentity, AGENT_SUBMISSION_FRONTEND_STATUSES } from "@/lib/mock/agent-submissions";
import { AgentSubmissionCard } from "@/components/agent/AgentSubmissionCard";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import type { AgentSubmissionListItem, AgentSubmissionFrontendStatus } from "@/types";

export default function AgentSubmissionsPage() {
  const { isAuthenticated, currentIdentity } = useAuthStore();
  const [submissions, setSubmissions] = useState<AgentSubmissionListItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // 加载数据
  useEffect(() => {
    if (isAuthenticated() && currentIdentity) {
      const data = getMockAgentSubmissionsByIdentity(currentIdentity.id);
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
    if (selectedStatus !== "all" && sub.frontendStatus !== selectedStatus) {
      return false;
    }
    return true;
  });

  // 前台状态标签映射
  const statusLabels: Record<string, string> = {
    pending: "待处理",
    accepted: "已接单",
    preparing: "投稿准备中",
    submitted: "已投稿",
    waiting_reply: "等待回复",
    shortlisted: "初审通过",
    planned_publish: "拟录用",
    suspected_published: "疑似发表",
    published: "已刊登",
    rejected: "未录用",
    closed: "已结束",
  };

  // 未登录
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaywallBlock
          title="登录后查看代投记录"
          description="平台代投记录需要登录后才能查看"
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
          <h1 className="text-3xl font-bold text-gray-900">平台代投记录</h1>
          <p className="text-gray-600 mt-1">
            查看您的代投任务进度和投稿结果
          </p>
        </div>
        <Link href="/agent-submissions/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            申请代投
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
          <TabsTrigger value="pending">待处理</TabsTrigger>
          <TabsTrigger value="preparing">投稿准备中</TabsTrigger>
          <TabsTrigger value="submitted">已投稿</TabsTrigger>
          <TabsTrigger value="published">已刊登</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Submission List */}
      {filteredSubmissions.length === 0 ? (
        <EmptyState
          variant="no-data"
          className="mt-8"
          title="暂无代投记录"
          description="申请平台代投，让运营人员为您完成投稿"
          action={{
            label: "申请代投",
            href: "/agent-submissions/new",
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {filteredSubmissions.map((submission) => (
            <AgentSubmissionCard
              key={submission.id}
              submission={submission}
            />
          ))}
        </div>
      )}
    </div>
  );
}