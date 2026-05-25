// ============================================================================
// AI 推荐结果展示组件
// ============================================================================

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Star, Send } from "lucide-react";
import type { AIRecommendResult } from "@/types";
import { getMockActivityById } from "@/lib/mock";

interface AIRecommendResultProps {
  recommendations: AIRecommendResult[];
  onSelectActivity?: (activityId: string) => void;
  essayTitle?: string;
  essayContent?: string;
  essayId?: string | null;
}

export function AIRecommendResultList({
  recommendations,
  onSelectActivity,
  essayTitle = "",
  essayContent = "",
  essayId = null
}: AIRecommendResultProps) {
  const router = useRouter();

  const handleAgentSubmission = (activityId: string) => {
    // 构建URL参数
    const params = new URLSearchParams();
    params.set("activity", activityId);
    if (essayId) {
      // 有 essayId 时只传 essayId，不传 title/content 避免重复创建
      params.set("essayId", essayId);
    } else {
      // 没有 essayId 时才传 title/content 作为 fallback
      if (essayTitle) params.set("title", essayTitle);
      if (essayContent) params.set("content", essayContent);
    }
    router.push(`/agent-submissions/new?${params.toString()}`);
  };
  if (recommendations.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-500">
            <Sparkles className="h-5 w-5" />
            AI 活动推荐
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            暂无推荐活动，请先上传作文进行分析
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI 推荐活动
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((result, index) => {
          const activity = getMockActivityById(result.activityId);
          if (!activity) return null;

          return (
            <div
              key={result.activityId}
              className="p-4 border rounded-lg hover:border-primary/30 transition-colors"
            >
              {/* 匹配度 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={index === 0 ? "default" : "secondary"} className={index === 0 ? "bg-primary" : ""}>
                    #{index + 1}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-700">
                      匹配度 {result.matchScore}%
                    </span>
                  </div>
                </div>
                {result.isSelfSubmissionRecommended && (
                  <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                    <Send className="h-3 w-3 mr-1" />
                    自主投稿
                  </Badge>
                )}
              </div>

              {/* 活动标题 */}
              <Link href={`/activities/${result.activityId}`} className="block">
                <h4 className="font-semibold text-gray-900 hover:text-primary transition-colors mb-2">
                  {activity.title}
                </h4>
              </Link>
              <p className="text-sm text-gray-500 mb-3">
                {activity.publisher?.name}
              </p>

              {/* 匹配理由 */}
              {result.matchReasons.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">匹配理由</div>
                  <div className="space-y-1">
                    {result.matchReasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-1 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 风险提示 */}
              {result.risks.length > 0 && (
                <div className="mb-3 p-2 bg-amber-50 rounded border border-amber-100">
                  <div className="flex items-start gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-600 mt-1 flex-shrink-0" />
                    <span className="text-xs text-amber-800">{result.risks[0]}</span>
                  </div>
                </div>
              )}

              {/* 投稿建议 */}
              {result.advice && (
                <p className="text-sm text-gray-600 mb-3 italic">
                  💡 {result.advice}
                </p>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Link href={`/activities/${result.activityId}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    查看详情
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="gap-1 bg-primary hover:bg-primary/90"
                  onClick={() => onSelectActivity?.(result.activityId)}
                >
                  <Send className="h-3 w-3" />
                  自主投稿
                </Button>
                <Button
                  size="sm"
                  className="gap-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAgentSubmission(result.activityId)}
                >
                  <Send className="h-3 w-3" />
                  平台代投
                </Button>
              </div>
            </div>
          );
        })}

        {/* 提示信息 */}
        <div className="text-xs text-gray-500 text-center pt-2">
          AI 推荐仅供参考，请以活动官方信息为准
        </div>
      </CardContent>
    </Card>
  );
}