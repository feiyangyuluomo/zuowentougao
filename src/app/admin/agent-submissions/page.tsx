"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores";
import {
  getMockAllAgentSubmissions,
  updateMockAgentSubmissionBackendStatus,
  uploadMockSubmissionScreenshot,
  getMockScreenshotsByTaskId,
  getMockAgentSubmissionLogs,
  acceptMockAgentSubmission,
} from "@/lib/mock/agent-submissions";
import { MOCK_ACTIVITIES } from "@/lib/mock/activities";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import { MOCK_STUDENTS } from "@/lib/mock/students";
import {
  getBackendStatusStyle,
  getFrontendStatusStyle,
  getBackendStatusLabel,
  getFrontendStatusLabel,
  getAvailableTransitions,
} from "@/lib/workflow/agent-submission-status";
import type { AgentSubmissionTask, AgentSubmissionBackendStatus, AgentSubmissionFrontendStatus, ScreenshotType } from "@/types";
import {
  Search,
  Clock,
  User,
  BookOpen,
  CheckCircle,
  Upload,
  MessageSquare,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function AdminAgentSubmissionsPage() {
  const { isAuthenticated, currentIdentity, entitlements } = useAuthStore();
  const [tasks, setTasks] = useState<AgentSubmissionTask[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // 运营操作弹窗状态
  const [selectedTask, setSelectedTask] = useState<AgentSubmissionTask | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"status" | "screenshot" | "note">("status");
  const [targetStatus, setTargetStatus] = useState<AgentSubmissionBackendStatus | "">("");
  const [targetFrontendStatus, setTargetFrontendStatus] = useState<AgentSubmissionFrontendStatus | "">("");
  const [operatorNote, setOperatorNote] = useState("");
  const [userVisibleNote, setUserVisibleNote] = useState("");
  const [screenshotType, setScreenshotType] = useState<ScreenshotType>("email_sent");

  // 检查是否为运营身份
  const isOperator = currentIdentity?.identityType === "operator" || currentIdentity?.identityType === "admin";

  // 加载数据
  useEffect(() => {
    if (isAuthenticated()) {
      const data = getMockAllAgentSubmissions();
      setTasks(data);
    }
  }, [isAuthenticated, refreshKey]);

  // 过滤任务
  const filteredTasks = tasks.filter((task) => {
    // 状态筛选
    if (selectedStatus !== "all") {
      if (selectedStatus === "waiting") {
        if (task.backendStatus !== "waiting_assign") return false;
      } else if (selectedStatus === "processing") {
        if (["waiting_assign", "submitted", "waiting_reply", "shortlisted", "planned_publish", "suspected_published", "published", "rejected", "closed"].includes(task.backendStatus)) return false;
      } else if (selectedStatus === "done") {
        if (!["submitted", "waiting_reply", "shortlisted", "planned_publish", "suspected_published", "published", "rejected", "closed"].includes(task.backendStatus)) return false;
      }
    }

    // 关键词搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const essay = MOCK_ESSAYS.find(e => e.id === task.essayId);
      const activity = MOCK_ACTIVITIES.find(a => a.id === task.activityId);
      if (
        !essay?.title.toLowerCase().includes(keyword) &&
        !activity?.title.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }

    return true;
  });

  // 处理运营操作
  const handleAction = (task: AgentSubmissionTask, type: "status" | "screenshot" | "note") => {
    setSelectedTask(task);
    setActionType(type);
    setShowActionDialog(true);
    setOperatorNote("");
    setUserVisibleNote("");
  };

  // 确认操作
  const confirmAction = () => {
    if (!selectedTask || !currentIdentity) return;

    if (actionType === "status" && targetStatus && targetFrontendStatus) {
      updateMockAgentSubmissionBackendStatus(
        selectedTask.id,
        targetStatus as AgentSubmissionBackendStatus,
        targetFrontendStatus as AgentSubmissionFrontendStatus,
        currentIdentity.id,
        operatorNote,
        userVisibleNote || undefined
      );
    }

    setShowActionDialog(false);
    setRefreshKey(k => k + 1);
  };

  // 运营接单
  const handleAccept = (taskId: string) => {
    if (!currentIdentity) return;
    acceptMockAgentSubmission(taskId, currentIdentity.id);
    setRefreshKey(k => k + 1);
  };

  // 计算统计数据
  const stats = {
    total: tasks.length,
    waiting: tasks.filter(t => t.backendStatus === "waiting_assign").length,
    processing: tasks.filter(t =>
      !["waiting_assign", "submitted", "waiting_reply", "shortlisted", "planned_publish", "suspected_published", "published", "rejected", "closed"].includes(t.backendStatus)
    ).length,
    done: tasks.filter(t =>
      ["submitted", "waiting_reply", "shortlisted", "planned_publish", "suspected_published", "published", "rejected", "closed"].includes(t.backendStatus)
    ).length,
  };

  // 非运营身份显示提示
  if (!isOperator) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">权限不足</h2>
            <p className="text-gray-600">此页面仅对运营人员开放</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">平台代投任务池</h1>
        <p className="text-gray-600 mt-1">管理所有平台代投任务，处理投稿状态</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">总任务数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-amber-600">{stats.waiting}</div>
            <div className="text-sm text-gray-500">待分配</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            <div className="text-sm text-gray-500">处理中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm text-gray-500">已完成</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索作文或活动..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs - 状态筛选 */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="waiting">待分配</TabsTrigger>
          <TabsTrigger value="processing">处理中</TabsTrigger>
          <TabsTrigger value="done">已完成</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task Table */}
      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">作文</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">活动</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">前台状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">后台状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map((task) => {
                  const essay = MOCK_ESSAYS.find(e => e.id === task.essayId);
                  const activity = MOCK_ACTIVITIES.find(a => a.id === task.activityId);
                  const student = MOCK_STUDENTS.find(s => s.id === task.studentId);
                  const frontendStyle = getFrontendStatusStyle(task.frontendStatus);
                  const backendStyle = getBackendStatusStyle(task.backendStatus);
                  const screenshots = getMockScreenshotsByTaskId(task.id);
                  const logs = getMockAgentSubmissionLogs(task.id);

                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{task.id}</div>
                        <div className="text-xs text-gray-500">
                          {task.priorityLevel === "high" && <Badge variant="destructive" className="text-xs">加急</Badge>}
                          {task.priorityLevel === "urgent" && <Badge variant="destructive" className="text-xs">紧急</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{essay?.title || "未知"}</div>
                        <div className="text-xs text-gray-500">{student?.studentName || "未知学生"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 max-w-[200px] truncate">{activity?.title || "未知"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${frontendStyle.bgColor} ${frontendStyle.color}`}>
                          {frontendStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${backendStyle.bgColor} ${backendStyle.color}`}>
                          {backendStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {task.backendStatus === "waiting_assign" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAccept(task.id)}
                            >
                              接单
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(task, "status")}
                          >
                            更新状态
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(task, "screenshot")}
                          >
                            上传截图
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(task, "note")}
                          >
                            备注
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              暂无任务
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionType === "status" && "更新任务状态"}
              {actionType === "screenshot" && "上传投稿截图"}
              {actionType === "note" && "填写备注"}
            </DialogTitle>
            <DialogDescription>
              {selectedTask?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionType === "status" && selectedTask && (
              <>
                <div>
                  <Label>当前后台状态</Label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {getBackendStatusLabel(selectedTask.backendStatus)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>选择新状态</Label>
                  <Select value={targetStatus} onValueChange={(v) => {
                    setTargetStatus(v as AgentSubmissionBackendStatus);
                    const transitions = getAvailableTransitions(v as AgentSubmissionBackendStatus);
                    if (transitions.length > 0) {
                      setTargetFrontendStatus(transitions[0].targetFrontendStatus);
                    }
                  }}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTransitions(selectedTask.backendStatus).map((t) => (
                        <SelectItem key={t.targetStatus} value={t.targetStatus}>
                          {t.label} → {getBackendStatusLabel(t.targetStatus)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>前台状态</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {targetFrontendStatus ? getFrontendStatusLabel(targetFrontendStatus as AgentSubmissionFrontendStatus) : "请先选择后台状态"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="operatorNote">运营备注（内部）</Label>
                  <Textarea
                    id="operatorNote"
                    value={operatorNote}
                    onChange={(e) => setOperatorNote(e.target.value)}
                    className="mt-2"
                    placeholder="记录操作原因..."
                  />
                </div>

                <div>
                  <Label htmlFor="userVisibleNote">用户可见备注</Label>
                  <Textarea
                    id="userVisibleNote"
                    value={userVisibleNote}
                    onChange={(e) => setUserVisibleNote(e.target.value)}
                    className="mt-2"
                    placeholder="用户可见的提示信息..."
                  />
                </div>
              </>
            )}

            {actionType === "screenshot" && (
              <>
                <div>
                  <Label>截图类型</Label>
                  <Select value={screenshotType} onValueChange={(v) => setScreenshotType(v as ScreenshotType)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email_sent">邮件已发送</SelectItem>
                      <SelectItem value="submit_success">投稿成功</SelectItem>
                      <SelectItem value="submit_failed">投稿失败</SelectItem>
                      <SelectItem value="publisher_reply">征稿方回复</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>上传截图（Mock）</Label>
                  <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">点击或拖拽上传截图</p>
                    <p className="text-xs text-gray-400 mt-1">（当前为 Mock，上传后将生成模拟 URL）</p>
                  </div>
                </div>
              </>
            )}

            {actionType === "note" && (
              <>
                <div>
                  <Label htmlFor="operatorNote">运营备注（内部）</Label>
                  <Textarea
                    id="operatorNote"
                    value={operatorNote}
                    onChange={(e) => setOperatorNote(e.target.value)}
                    className="mt-2"
                    placeholder="仅运营可见的备注..."
                  />
                </div>

                <div>
                  <Label htmlFor="userVisibleNote">用户可见备注</Label>
                  <Textarea
                    id="userVisibleNote"
                    value={userVisibleNote}
                    onChange={(e) => setUserVisibleNote(e.target.value)}
                    className="mt-2"
                    placeholder="用户可见的提示信息..."
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              取消
            </Button>
            <Button onClick={confirmAction}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}