"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/common";
import { PaywallBlock } from "@/components/common";
import { getMockActivityById } from "@/lib/mock";
import { ACTIVITY_STATUS, SUBMISSION_METHOD } from "@/constants";
import { GRADE_LABELS } from "@/constants";
import {
  Calendar,
  Award,
  Mail,
  FileText,
  Share2,
  Bookmark,
  Star,
  Clock,
  Globe,
  Printer,
  Sparkles,
  Send,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual auth check
const mockIsLoggedIn = false;
const mockIsMember = false;

export default function ActivityDetailPage() {
  const params = useParams();
  const activityId = params.id as string;

  // Simulate loading
  const isLoading = false;
  const activity = getMockActivityById(activityId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState variant="detail" />
      </div>
    );
  }

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
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/activities" className="hover:text-primary">
          活动库
        </Link>
        <span className="mx-2">/</span>
        <span>{activity.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant={
                        activity.activityStatus === "recruiting"
                          ? "success"
                          : activity.activityStatus === "closing_soon"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {ACTIVITY_STATUS[activity.activityStatus]?.label}
                    </Badge>
                    {activity.hasPayment && (
                      <Badge variant="info">有稿费</Badge>
                    )}
                    {activity.hasCertificate && (
                      <Badge variant="info">有证书</Badge>
                    )}
                    {activity.hasSampleIssue && (
                      <Badge variant="info">有样刊</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    {activity.title}
                  </CardTitle>
                  <CardDescription>
                    {activity.publisher?.name} | 发布于{" "}
                    {new Date(activity.createdAt).toLocaleDateString("zh-CN")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{activity.publicSummary}</p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">活动详情</TabsTrigger>
              <TabsTrigger value="submission">投稿方式</TabsTrigger>
              <TabsTrigger value="advice">AI建议</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>活动详情</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">适合年级</div>
                      <div className="flex flex-wrap gap-1">
                        {activity.gradeScope.map((grade) => (
                          <Badge key={grade} variant="outline">
                            {GRADE_LABELS[grade] || grade}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">截止时间</div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {activity.isLongTerm
                          ? "长期征稿"
                          : activity.deadline
                          ? new Date(activity.deadline).toLocaleDateString("zh-CN")
                          : "未设置"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">投稿方式</div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {activity.submissionMethod
                          ? SUBMISSION_METHOD[activity.submissionMethod]?.label
                          : "未设置"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">活动状态</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {ACTIVITY_STATUS[activity.activityStatus]?.label}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Original Detail */}
                  <div>
                    <h3 className="font-semibold mb-3">征稿原文</h3>
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                      {activity.originalDetail}
                    </div>
                  </div>

                  {/* Theme Tags */}
                  {activity.themeTags && activity.themeTags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-3">主题标签</h3>
                        <div className="flex flex-wrap gap-2">
                          {activity.themeTags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submission" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>投稿方式</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activity.submissionMethod && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {SUBMISSION_METHOD[activity.submissionMethod]?.label}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {activity.submissionFormat || "请按照活动要求格式投稿"}
                        </p>
                      </div>
                    </div>
                  )}

                  {activity.submissionEmail && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">投稿邮箱</h4>
                        <p className="text-sm text-gray-500">{activity.submissionEmail}</p>
                      </div>
                    </div>
                  )}

                  {activity.emailSubjectFormat && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">邮件标题格式</h4>
                        <p className="text-sm text-gray-500">
                          {activity.emailSubjectFormat}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advice" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI投稿建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockIsLoggedIn ? (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        AI将根据这篇作文的特点，为您提供个性化的投稿建议。
                      </p>
                      <Link href={`/ai-assistant?activity=${activity.id}`}>
                        <Button className="gap-2">
                          <Sparkles className="h-4 w-4" />
                          获取AI建议
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <PaywallBlock
                      title="登录后获取AI建议"
                      description="AI将分析您的作文内容，给出最适合的投稿建议"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>投稿操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.supportSelfSubmission && (
                <Link href={`/self-submissions/new?activity=${activity.id}`}>
                  <Button className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    自主投稿
                  </Button>
                </Link>
              )}
              {activity.supportAgentSubmission && (
                <Link href={`/agent-submissions/new?activity=${activity.id}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Star className="h-4 w-4" />
                    申请平台代投
                  </Button>
                </Link>
              )}
              <Button variant="ghost" className="w-full">
                收藏活动
              </Button>
            </CardContent>
          </Card>

          {/* Publisher Info */}
          <Card>
            <CardHeader>
              <CardTitle>征稿方</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  {activity.publisher?.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">
                    {activity.publisher?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.publisher?.publisherType}
                  </div>
                </div>
              </div>
              {activity.sourceUrl && (
                <a
                  href={activity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  访问原始页面
                </a>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>数据统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {activity.views || 0}
                  </div>
                  <div className="text-sm text-gray-500">浏览次数</div>
                </div>
                <div className="text-center">
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

// Need to import Separator
function Separator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`shrink-0 bg-border h-[1px] w-full my-6 ${className || ""}`}
      {...props}
    />
  );
}