"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common";
import { getMockSelfSubmissionsByIdentity } from "@/lib/mock/self-submissions";
import { getMockAgentSubmissionsByIdentity } from "@/lib/mock/agent-submissions";
import { getSubmissionStatusBadge } from "@/lib/utils";
import { Search, Calendar, Eye, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SelfSubmissionListItem, AgentSubmissionListItem } from "@/types";

export default function WorkspaceSubmissionsPage() {
  const { currentIdentity } = useAuthStore();
  const [selfSubmissions, setSelfSubmissions] = useState<SelfSubmissionListItem[]>([]);
  const [agentSubmissions, setAgentSubmissions] = useState<AgentSubmissionListItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTab, setSelectedTab] = useState<"self" | "agent">("self");

  useEffect(() => {
    if (currentIdentity) {
      const selfSubs = getMockSelfSubmissionsByIdentity(currentIdentity.id);
      const agentSubs = getMockAgentSubmissionsByIdentity(currentIdentity.id);
      setSelfSubmissions(selfSubs);
      setAgentSubmissions(agentSubs);
    }
  }, [currentIdentity]);

  if (!canAccessWorkspace(currentIdentity)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              您没有权限访问此页面
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 筛选
  const filterSubmissions = <T extends { essayTitle: string; activityTitle: string }>(
    items: T[]
  ) => {
    return items.filter((item) => {
      if (!searchKeyword) return true;
      const keyword = searchKeyword.toLowerCase();
      return (
        item.essayTitle.toLowerCase().includes(keyword) ||
        item.activityTitle.toLowerCase().includes(keyword)
      );
    });
  };

  const filteredSelfSubs = filterSubmissions(selfSubmissions);
  const filteredAgentSubs = filterSubmissions(agentSubmissions);
  const currentList = selectedTab === "self" ? filteredSelfSubs : filteredAgentSubs;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">投稿管理</h1>
        <p className="text-gray-500 mt-1">管理所有投稿记录，包括自主投稿和平台代投</p>
      </div>

      {/* Tab切换 */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as "self" | "agent")}>
        <TabsList className="mb-4">
          <TabsTrigger value="self">
            自主投稿 ({selfSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="agent">
            平台代投 ({agentSubmissions.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 搜索 */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="搜索作文或活动..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 投稿列表 */}
      {currentList.length === 0 ? (
        <EmptyState
          variant="no-data"
          title="暂无投稿记录"
          description="还没有任何投稿记录"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {currentList.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={selectedTab === "self" ? "default" : "secondary"}>
                        {selectedTab === "self" ? "自主投稿" : "平台代投"}
                      </Badge>
                      {getSubmissionStatusBadge(
                        "submissionStatus" in submission
                          ? submission.submissionStatus
                          : submission.frontendStatus
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {submission.essayTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      投给：{submission.activityTitle}
                    </p>
                    {"activityPublisher" in submission && submission.activityPublisher && (
                      <p className="text-sm text-gray-400">
                        {submission.activityPublisher}
                      </p>
                    )}
                    {"studentName" in submission && (
                      <p className="text-sm text-gray-400">
                        学生：{submission.studentName}
                      </p>
                    )}
                    {"userSubmissionTime" in submission && submission.userSubmissionTime && (
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          投稿时间：{new Date(submission.userSubmissionTime).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                    )}
                    {"createdAt" in submission && (
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          申请时间：{new Date(submission.createdAt).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedTab === "self" && "activityId" in submission && (
                      <Link href={`/activities/${submission.activityId}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          查看活动
                        </Button>
                      </Link>
                    )}
                    {selectedTab === "agent" && (
                      <Link href={`/agent-submissions/${submission.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          查看详情
                        </Button>
                      </Link>
                    )}
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