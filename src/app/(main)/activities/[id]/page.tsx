"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores";
import { ActivityDetailPanel } from "@/components/activities/ActivityDetailPanel";
import { SubmissionMethodCard } from "@/components/activities/SubmissionMethodCard";
import { LoadingState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMockActivityById } from "@/lib/mock";
import { canViewSubmissionMethod, canCreateSelfSubmission } from "@/lib/permissions/activity";
import { ArrowLeft, Bookmark, Share2, Lock, Send, Sparkles } from "lucide-react";

export default function ActivityDetailPage() {
  const params = useParams();
  const activityId = params.id as string;
  const { isAuthenticated, currentIdentity, entitlements } = useAuthStore();

  const activity = getMockActivityById(activityId);
  const canViewEmail = canViewSubmissionMethod(currentIdentity, entitlements);
  const canRecordSelfSubmission = canCreateSelfSubmission(currentIdentity, entitlements);

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">活动不存在</h1>
          <p className="text-gray-600 mb-6">该活动可能已下架或不存在</p>
          <Link href="/activities">
            <Button>返回活动库</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          <Link href="/activities" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回活动库
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {activity.activityStatus === "recruiting" && (
                  <Badge className="bg-green-600">征稿中</Badge>
                )}
                {activity.activityStatus === "closing_soon" && (
                  <Badge className="bg-amber-500">即将截止</Badge>
                )}
                {activity.activityStatus === "long_term" && (
                  <Badge variant="outline" className="border-blue-500 text-blue-600">长期征稿</Badge>
                )}
                {activity.hasPayment && (
                  <Badge variant="secondary">有稿费</Badge>
                )}
                {activity.hasCertificate && (
                  <Badge variant="secondary">有证书</Badge>
                )}
                {activity.hasSampleIssue && (
                  <Badge variant="secondary">有样刊</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {activity.title}
              </h1>
              <p className="text-gray-500">
                {activity.publisher?.name} | 发布于{" "}
                {new Date(activity.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </CardContent>
          </Card>

          {/* Activity Detail Panel */}
          <ActivityDetailPanel activity={activity} />

          {/* AI Advice Card - Only for members */}
          {isAuthenticated() && canViewEmail && (
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Sparkles className="h-5 w-5" />
                  AI投稿建议
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-purple-800">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">1.</span>
                  <span>建议在截止日期前3天完成投稿，避免意外情况</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">2.</span>
                  <span>投稿前请仔细检查邮件主题格式，确保格式正确</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">3.</span>
                  <span>建议留存投稿截图，以便后续跟踪投稿状态</span>
                </div>
                <Link href={`/ai-assistant?activity=${activity.id}`}>
                  <Button variant="outline" className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-100">
                    <Sparkles className="h-4 w-4 mr-2" />
                    获取更详细的AI分析
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submission Action */}
          <Card>
            <CardHeader>
              <CardTitle>投稿操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAuthenticated() ? (
                <Link href="/login">
                  <Button variant="outline" className="w-full gap-2">
                    <Lock className="h-4 w-4" />
                    登录后记录投稿
                  </Button>
                </Link>
              ) : !canRecordSelfSubmission ? (
                <Link href="/membership">
                  <Button variant="outline" className="w-full gap-2">
                    <Lock className="h-4 w-4" />
                    开通会员记录投稿
                  </Button>
                </Link>
              ) : (
                <>
                  {activity.supportSelfSubmission && (
                    <Link href={`/self-submissions/new?activity=${activity.id}`}>
                      <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                        <Send className="h-4 w-4" />
                        自主投稿
                      </Button>
                    </Link>
                  )}
                  {activity.supportAgentSubmission && (
                    <Link href={`/agent-submissions/new?activity=${activity.id}`}>
                      <Button variant="outline" className="w-full gap-2 bg-orange-500 text-white hover:bg-orange-600">
                        <Send className="h-4 w-4" />
                        平台代投
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Submission Method - Only for members */}
          {canViewEmail && activity.submissionEmail && (
            <SubmissionMethodCard
              email={activity.submissionEmail}
              method={activity.submissionMethod}
              format={activity.submissionFormat}
              emailSubjectFormat={activity.emailSubjectFormat}
            />
          )}

          {/* Publisher Info */}
          <Card>
            <CardHeader>
              <CardTitle>征稿方</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/media-library/publishers/${activity.publisherId}`} className="block">
                <div className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-semibold">
                    {activity.publisher?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="font-medium">
                      {activity.publisher?.name || "未知"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.publisher?.publisherType === "magazine" && "杂志社"}
                      {activity.publisher?.publisherType === "newspaper" && "报社"}
                      {activity.publisher?.publisherType === "official_account" && "公众号"}
                      {activity.publisher?.publisherType === "organization" && "机构"}
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>数据统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {activity.views || 0}
                  </div>
                  <div className="text-sm text-gray-500">浏览次数</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {activity.submissions || 0}
                  </div>
                  <div className="text-sm text-gray-500">已投稿数</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}