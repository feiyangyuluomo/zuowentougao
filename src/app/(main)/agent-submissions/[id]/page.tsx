"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { PaywallBlock } from "@/components/common";
import { EmptyState } from "@/components/common";
import { getMockAgentSubmissionById, getMockScreenshotsByTaskId, getMockAgentSubmissionLogs, initMockAgentData } from "@/lib/mock/agent-submissions";
import { MOCK_ACTIVITIES } from "@/lib/mock/activities";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import { MOCK_STUDENTS } from "@/lib/mock/students";
import { getFrontendStatusStyle, getFrontendStatusLabel } from "@/lib/workflow/agent-submission-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Send, Image, MessageSquare, CheckCircle } from "lucide-react";

export default function AgentSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const { isAuthenticated, currentIdentity } = useAuthStore();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initMockAgentData();
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      setRefreshKey(k => k + 1);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaywallBlock
          title="登录后查看代投详情"
          description="代投详情需要登录后才能查看"
          action={{ label: "立即登录", href: "/login" }}
        />
      </div>
    );
  }

  const task = getMockAgentSubmissionById(taskId);

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          variant="no-data"
          title="代投任务不存在"
          description="该代投任务可能已被删除或不存在"
          action={{ label: "返回代投记录", href: "/agent-submissions" }}
        />
      </div>
    );
  }

  // 只能查看自己的任务
  if (task.identityId !== currentIdentity?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">权限不足</h2>
            <p className="text-gray-600 mb-4">您只能查看自己的代投任务</p>
            <Link href="/agent-submissions">
              <Button variant="outline">返回代投记录</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const essay = MOCK_ESSAYS.find(e => e.id === task.essayId);
  const activity = MOCK_ACTIVITIES.find(a => a.id === task.activityId);
  const student = MOCK_STUDENTS.find(s => s.id === task.studentId);
  const screenshots = getMockScreenshotsByTaskId(task.id, true);
  const logs = getMockAgentSubmissionLogs(task.id);
  const frontendStyle = getFrontendStatusStyle(task.frontendStatus);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          <Link href="/agent-submissions" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回代投记录
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${frontendStyle.bgColor} ${frontendStyle.color}`}>
                  {frontendStyle.label}
                </Badge>
                {task.priorityLevel === "high" && (
                  <Badge variant="destructive">加急</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                代投任务详情
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">作文</div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{essay?.title || "未知作文"}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">活动</div>
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{activity?.title || "未知活动"}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">学生</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{student?.studentName || "未知学生"}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">投稿时间</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {task.submissionTime
                        ? new Date(task.submissionTime).toLocaleDateString("zh-CN")
                        : "待投稿"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Visible Note */}
          {task.userVisibleNote && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                  <MessageSquare className="h-4 w-4" />
                  平台提示
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800">
                {task.userVisibleNote}
              </CardContent>
            </Card>
          )}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  投稿截图
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {screenshots.map((shot) => (
                    <div key={shot.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="p-2 text-xs text-gray-500">
                        {shot.screenshotType === "email_sent" && "邮件已发送"}
                        {shot.screenshotType === "submit_success" && "投稿成功"}
                        {shot.screenshotType === "submit_failed" && "投稿失败"}
                        {shot.screenshotType === "publisher_reply" && "征稿方回复"}
                        {shot.screenshotType === "other" && "其他"}
                      </div>
                      <div className="p-2 text-xs text-gray-400">
                        {new Date(shot.createdAt).toLocaleDateString("zh-CN")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                状态时间线
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {logs.map((log, index) => (
                    <div key={log.id} className="relative flex gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        index === logs.length - 1
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {index === logs.length - 1 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {log.note || "状态更新"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleDateString("zh-CN")}{" "}
                          {new Date(log.createdAt).toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}