// ============================================================================
// 代投记录卡片组件
// ============================================================================

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import type { AgentSubmissionListItem, AgentSubmissionFrontendStatus } from "@/types";

// 前台状态标签映射
const FRONTEND_STATUS_LABELS: Record<AgentSubmissionFrontendStatus, string> = {
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

// 前台状态颜色映射
const FRONTEND_STATUS_COLORS: Record<AgentSubmissionFrontendStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  submitted: "bg-green-100 text-green-700",
  waiting_reply: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-teal-100 text-teal-700",
  planned_publish: "bg-indigo-100 text-indigo-700",
  suspected_published: "bg-orange-100 text-orange-700",
  published: "bg-green-600 text-white",
  rejected: "bg-red-100 text-red-700",
  closed: "bg-gray-100 text-gray-500",
};

interface AgentSubmissionCardProps {
  submission: AgentSubmissionListItem;
}

export function AgentSubmissionCard({ submission }: AgentSubmissionCardProps) {
  const statusLabel = FRONTEND_STATUS_LABELS[submission.frontendStatus] || submission.frontendStatus;
  const statusColor = FRONTEND_STATUS_COLORS[submission.frontendStatus] || "bg-gray-100 text-gray-700";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}>
                {statusLabel}
              </span>
              {submission.priorityLevel === "high" && (
                <Badge variant="outline" className="text-red-500 border-red-200">
                  加急
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {submission.essayTitle}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              投给：{submission.activityTitle}
            </p>
            <p className="text-sm text-gray-400">
              学生：{submission.studentName}
            </p>
            {submission.submissionTime && (
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  投稿时间：{new Date(submission.submissionTime).toLocaleDateString("zh-CN")}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/agent-submissions/${submission.id}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                查看详情
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}