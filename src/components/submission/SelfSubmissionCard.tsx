// ============================================================================
// 自主投稿记录卡片组件
// ============================================================================

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Mail, ExternalLink } from "lucide-react";
import type { SelfSubmissionListItem } from "@/types";
import { formatDate } from "@/lib/utils";
import { getSubmissionStatusBadge } from "@/lib/utils";

interface SelfSubmissionCardProps {
  submission: SelfSubmissionListItem;
}

export function SelfSubmissionCard({ submission }: SelfSubmissionCardProps) {
  const statusBadge = getSubmissionStatusBadge(submission.submissionStatus);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {statusBadge}
              {submission.userSubmissionTime && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(submission.userSubmissionTime)}
                </span>
              )}
            </div>
            <Link href={`/activities/${submission.id}`} className="block">
              <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                {submission.essayTitle}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 mb-2">
          投至：{submission.activityTitle}
        </p>
        <p className="text-xs text-gray-500">
          {submission.activityPublisher}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          记录于 {formatDate(submission.createdAt)}
        </span>
        <Link href={`/self-submissions/${submission.id}`}>
          <Button size="sm" variant="outline" className="h-8">
            查看详情
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}