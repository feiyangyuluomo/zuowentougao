// ============================================================================
// 征稿方详情页面
// ============================================================================

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMockPublisherById } from "@/lib/mock/publishers";
import { MOCK_ACTIVITIES } from "@/lib/mock/activities";
import type { PublisherType } from "@/types";
import { BookOpen, Globe, Mail, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

// 征稿方类型标签
const PUBLISHER_TYPE_LABELS: Record<PublisherType, string> = {
  newspaper: "报纸",
  magazine: "杂志",
  official_account: "公众号",
  organization: "机构",
  school: "学校",
  other: "其他",
};

interface PublisherDetailPageProps {
  params: { id: string };
}

export default function PublisherDetailPage({ params }: PublisherDetailPageProps) {
  const publisher = getMockPublisherById(params.id);

  if (!publisher) {
    notFound();
  }

  // 获取该征稿方的所有活动
  const activities = MOCK_ACTIVITIES.filter((a) => a.publisherId === publisher.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回链接 */}
      <Link
        href="/media-library"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回媒体库
      </Link>

      {/* 征稿方信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* 左侧 - 基本信息 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {/* Logo占位 */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {publisher.name}
                    </h1>
                    <Badge variant="secondary">
                      {PUBLISHER_TYPE_LABELS[publisher.publisherType]}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {publisher.description || "暂无描述"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {publisher.website && (
                      <a
                        href={publisher.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        官网
                      </a>
                    )}
                    {publisher.contactInfo && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {publisher.contactInfo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧 - 统计信息 */}
        <div>
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {activities.length}
                  </div>
                  <div className="text-sm text-gray-500">进行中的活动</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {activities.filter((a) => a.hasPayment).length}
                  </div>
                  <div className="text-sm text-gray-500">有稿费的活动</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 该征稿方的活动列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">征稿活动</h2>
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <Link key={activity.id} href={`/activities/${activity.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {activity.title}
                      </h3>
                      <Badge
                        variant={
                          activity.activityStatus === "recruiting"
                            ? "default"
                            : activity.activityStatus === "closing_soon"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {activity.activityStatus === "recruiting"
                          ? "征稿中"
                          : activity.activityStatus === "closing_soon"
                          ? "即将截止"
                          : "已结束"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {activity.publicSummary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        截止：
                        {activity.isLongTerm
                          ? "长期有效"
                          : activity.deadline
                          ? new Date(activity.deadline).toLocaleDateString("zh-CN")
                          : "未知"}
                      </span>
                      <span>适合{activity.gradeScope.join("、")}年级</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              暂无进行中的活动
            </CardContent>
          </Card>
        )}
      </div>

      {/* SEO友好的内容区块 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">关于{publisher.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="mb-2">
            {publisher.name}是一个权威的{PUBLISHER_TYPE_LABELS[publisher.publisherType]}，
            长期征集中小学生的优秀作文。我们欢迎广大学生积极投稿，展示你的写作才华。
          </p>
          <p>
            投稿要求：请根据各活动的具体要求准备作文，确保内容真实、原创，
            并在规定时间内提交。如有任何问题，可通过官方联系方式咨询。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}