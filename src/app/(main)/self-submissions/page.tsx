"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common";
import { SELF_SUBMISSION_STATUS } from "@/constants";
import {
  Send,
  Plus,
  Search,
  Calendar,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual data

const mockSubmissions = [
  {
    id: "sub-001",
    essayTitle: "我的植物朋友",
    activityTitle: "2024年"童心向未来"主题作文征集",
    activityPublisher: "少年文艺杂志",
    submissionStatus: "user_submitted" as const,
    userSubmissionTime: new Date("2024-04-15"),
    createdAt: new Date("2024-04-10"),
  },
  {
    id: "sub-002",
    essayTitle: "春天的小区",
    activityTitle: "第十届"春之声"作文大赛",
    activityPublisher: "小学生拼音报社",
    submissionStatus: "waiting_reply" as const,
    userSubmissionTime: new Date("2024-04-20"),
    createdAt: new Date("2024-04-18"),
  },
  {
    id: "sub-003",
    essayTitle: "记一次有趣的科学实验",
    activityTitle: "2024年度"创新杯"校园文学征集",
    activityPublisher: "创新作文杂志",
    submissionStatus: "shortlisted" as const,
    userSubmissionTime: new Date("2024-05-01"),
    createdAt: new Date("2024-04-25"),
  },
];

export default function SelfSubmissionsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredSubmissions = mockSubmissions.filter((sub) => {
    if (searchKeyword) {
      if (
        !sub.essayTitle.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !sub.activityTitle.toLowerCase().includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }
    }
    if (selectedStatus && sub.submissionStatus !== selectedStatus) {
      return false;
    }
    return true;
  });

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
          <input
            type="text"
            placeholder="搜索作文或活动..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
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
            onClick: () => {},
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
                      <Badge
                        variant={
                          submission.submissionStatus === "published"
                            ? "success"
                            : submission.submissionStatus === "shortlisted"
                            ? "info"
                            : "secondary"
                        }
                      >
                        {SELF_SUBMISSION_STATUS[submission.submissionStatus]?.label ||
                          submission.submissionStatus}
                      </Badge>
                    </div>
                    <Link href={`/essays/${submission.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary">
                        {submission.essayTitle}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      投给：{submission.activityTitle}
                    </p>
                    <p className="text-sm text-gray-400">
                      {submission.activityPublisher}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        投稿时间：{new Date(submission.userSubmissionTime).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      查看
                    </Button>
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