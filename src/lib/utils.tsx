import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ActivityStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle, Calendar } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// 时间格式化
// ============================================================================

export function formatDeadline(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return "已截止";
  } else if (days === 0) {
    return "今日截止";
  } else if (days <= 7) {
    return `${days}天后截止`;
  } else if (days <= 30) {
    return `${Math.ceil(days / 7)}周后截止`;
  } else {
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    });
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================================
// 活动状态徽章
// ============================================================================

export function getActivityStatusBadge(status: ActivityStatus) {
  switch (status) {
    case "recruiting":
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          征稿中
        </Badge>
      );
    case "closing_soon":
      return (
        <Badge variant="destructive" className="bg-amber-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          即将截止
        </Badge>
      );
    case "closed":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          已截止
        </Badge>
      );
    case "long_term":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-600">
          <Calendar className="h-3 w-3 mr-1" />
          长期征稿
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

// ============================================================================
// 投稿状态格式化
// ============================================================================

export function getSubmissionStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; variant: string }> = {
    pending: { label: "待投稿", variant: "secondary" },
    user_submitted: { label: "已投稿", variant: "default" },
    waiting_reply: { label: "等待回复", variant: "secondary" },
    shortlisted: { label: "初审通过", variant: "default" },
    planned_publish: { label: "拟录用", variant: "default" },
    suspected_published: { label: "疑似发表", variant: "warning" },
    published: { label: "已刊登", variant: "success" },
    rejected: { label: "未录用", variant: "destructive" },
    closed: { label: "已结束", variant: "secondary" },
  };

  const config = statusMap[status] || { label: status, variant: "secondary" };
  return <Badge variant={config.variant as any}>{config.label}</Badge>;
}