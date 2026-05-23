// ============================================================================
// 活动卡片组件
// ============================================================================

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Mail, Award, Clock } from "lucide-react";
import type { Activity } from "@/types";
import { formatDeadline, getActivityStatusBadge } from "@/lib/utils";
import { GRADE_LABELS } from "@/constants";

// 文体标签
const GENRE_LABELS: Record<string, string> = {
  narrative: "记叙文",
  argumentative: "议论文",
  prose: "散文",
  poetry: "诗歌",
  letter: "书信",
  speech: "演讲稿",
};

interface ActivityCardProps {
  activity: Activity;
  showMemberBadge?: boolean;
}

export function ActivityCard({ activity, showMemberBadge = false }: ActivityCardProps) {
  const statusBadge = getActivityStatusBadge(activity.activityStatus);
  const deadlineText = activity.isLongTerm
    ? "长期征稿"
    : activity.deadline
      ? formatDeadline(activity.deadline)
      : "暂无截止日期";

  return (
    <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {statusBadge}
              {activity.hasCertificate && (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  <Award className="h-3 w-3 mr-1" />
                  证书
                </Badge>
              )}
            </div>
            <Link href={`/activities/${activity.id}`} className="block">
              <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                {activity.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {activity.publisher?.name || "未知征稿方"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {activity.publicSummary || activity.originalDetail?.slice(0, 150) + "..."}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {activity.gradeScope?.map(g => GRADE_LABELS[g] || g).join(", ") || "不限年级"}
          </span>
          {activity.genre && activity.genre.length > 0 && (
            <span className="px-2 py-0.5 bg-gray-100 rounded">
              {activity.genre.map(g => GENRE_LABELS[g] || g).join("/")}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          {activity.activityStatus !== "closed" && (
            <>
              <Clock className="h-4 w-4" />
              <span className={activity.activityStatus === "closing_soon" ? "text-amber-600" : ""}>
                {deadlineText}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showMemberBadge && activity.submissionEmail && (
            <Badge variant="secondary" className="text-xs">
              <Mail className="h-3 w-3 mr-1" />
              可投稿
            </Badge>
          )}
          <Link href={`/activities/${activity.id}`}>
            <Button size="sm" variant="outline" className="h-8">
              查看详情
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}