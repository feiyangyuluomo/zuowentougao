// ============================================================================
// 活动详情面板组件
// ============================================================================

import { useAuthStore } from "@/stores";
import { canViewFullActivity, canViewSubmissionEmail } from "@/lib/permissions/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Mail, Globe, Send, FileText, AlertTriangle, Check, Star, Award } from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/types";
import { formatDate } from "@/lib/utils";
import { GRADE_LABELS } from "@/constants";

interface ActivityDetailPanelProps {
  activity: Activity;
}

export function ActivityDetailPanel({ activity }: ActivityDetailPanelProps) {
  const { currentIdentity, entitlements, isMember } = useAuthStore();

  const canViewFull = canViewFullActivity(currentIdentity, entitlements);
  const canViewEmail = canViewSubmissionEmail(currentIdentity, entitlements);

  return (
    <div className="space-y-6">
      {/* 基础信息 */}
      <Card>
        <CardHeader>
          <CardTitle>活动详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 状态标签 */}
          <div className="flex flex-wrap gap-2">
            {activity.activityStatus === "recruiting" && (
              <Badge className="bg-green-600">征稿中</Badge>
            )}
            {activity.activityStatus === "closing_soon" && (
              <Badge className="bg-amber-500">即将截止</Badge>
            )}
            {activity.activityStatus === "long_term" && (
              <Badge variant="outline" className="border-blue-500 text-blue-600">长期征稿</Badge>
            )}
            {activity.hasCertificate && (
              <Badge variant="secondary">
                <Award className="h-3 w-3 mr-1" />
                有证书
              </Badge>
            )}
            {activity.hasPayment && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                有稿费
              </Badge>
            )}
            {activity.hasSampleIssue && (
              <Badge variant="secondary">
                <FileText className="h-3 w-3 mr-1" />
                有样刊
              </Badge>
            )}
          </div>

          {/* 基本信息列表 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">征稿方：</span>
              <span className="font-medium">{activity.publisher?.name || "未知"}</span>
            </div>
            <div>
              <span className="text-gray-500">截止时间：</span>
              <span className="font-medium">
                {activity.deadline ? formatDate(activity.deadline) : "长期有效"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">适合年级：</span>
              <span className="font-medium">{activity.gradeScope?.map(g => GRADE_LABELS[g] || g).join(", ") || "不限"}</span>
            </div>
            <div>
              <span className="text-gray-500">征稿主题：</span>
              <span className="font-medium">{activity.themeTags?.join(", ") || "不限"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 征稿详情 - 公开 */}
      <Card>
        <CardHeader>
          <CardTitle>征稿详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {activity.originalDetail ? (
              <div className="whitespace-pre-wrap text-gray-700">
                {activity.originalDetail}
              </div>
            ) : (
              <p className="text-gray-500">暂无详细征稿信息</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 投稿方式 - 会员可见 */}
      <Card className={!canViewEmail ? "opacity-60" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              投稿方式
            </CardTitle>
            {!canViewEmail && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                <Lock className="h-3 w-3 mr-1" />
                会员专享
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {canViewEmail ? (
            <>
              {/* 投稿邮箱 */}
              {activity.submissionEmail && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">投稿邮箱</div>
                    <div className="font-semibold text-blue-700">{activity.submissionEmail}</div>
                  </div>
                </div>
              )}

              {/* 投稿方式 */}
              {activity.submissionMethod && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  {activity.submissionMethod === "email" && <Mail className="h-5 w-5 text-gray-600" />}
                  {activity.submissionMethod === "website" && <Globe className="h-5 w-5 text-gray-600" />}
                  <div>
                    <div className="text-sm text-gray-500">投稿方式</div>
                    <div className="font-medium">
                      {activity.submissionMethod === "email" && "邮箱投稿"}
                      {activity.submissionMethod === "website" && "官网投稿"}
                      {activity.submissionMethod === "mini_program" && "小程序投稿"}
                      {activity.submissionMethod === "wechat" && "微信投稿"}
                      {activity.submissionMethod === "system" && "系统投稿"}
                      {activity.submissionMethod === "offline" && "线下投稿"}
                      {activity.submissionMethod === "other" && "其他方式"}
                    </div>
                  </div>
                </div>
              )}

              {/* 投稿格式 */}
              {activity.submissionFormat && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">投稿格式要求</div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {activity.submissionFormat}
                  </div>
                </div>
              )}

              {/* 邮件主题格式 */}
              {activity.emailSubjectFormat && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">邮件主题格式</div>
                  <div className="font-mono text-sm text-gray-700">
                    {activity.emailSubjectFormat}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                登录并开通会员后查看完整投稿方式
              </p>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90">
                  登录/开通会员
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 投稿建议 - 会员可见 */}
      {canViewEmail && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              投稿建议
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>投稿前请仔细阅读征稿要求，确保作文符合主题</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>严格按照格式要求填写邮件主题和正文</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>建议留存投稿截图，以便后续跟踪投稿状态</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>注意截止时间，建议提前投稿避免错过</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 一稿多投风险提示 */}
      {canViewEmail && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              重要提示
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-800">
            <p>
              部分活动可能存在一稿多投限制，请在投稿前确认该作文是否已投其他活动。
              同一作文多次投稿可能影响录用结果。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}