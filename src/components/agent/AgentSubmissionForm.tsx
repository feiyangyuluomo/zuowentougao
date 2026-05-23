// ============================================================================
// 平台代投申请表单组件
// ============================================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import {
  createMockAgentSubmission,
  getMockAgentSubmissionsByIdentity,
} from "@/lib/mock/agent-submissions";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import { MOCK_ACTIVITIES } from "@/lib/mock/activities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Check, Send, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/types";

interface AgentSubmissionFormProps {
  activity?: Activity;
  onSuccess?: () => void;
}

export function AgentSubmissionForm({ activity, onSuccess }: AgentSubmissionFormProps) {
  const router = useRouter();
  const { currentIdentity, isAuthenticated } = useAuthStore();

  const [selectedEssayId, setSelectedEssayId] = useState<string>("");
  const [selectedActivityId, setSelectedActivityId] = useState<string>(activity?.id || "");
  const [riskConfirmed, setRiskConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户已有的作文列表（用于下拉选择）
  const [availableEssays, setAvailableEssays] = useState<typeof MOCK_ESSAYS>([]);

  useEffect(() => {
    if (isAuthenticated() && currentIdentity) {
      // 获取用户已提交的作文ID列表（自主投稿 + 代投）
      const submittedEssays = getMockAgentSubmissionsByIdentity(currentIdentity.id);
      const submittedEssayIds = new Set(submittedEssays.map(s => {
        // 需要从 essayTitle 反查，这里简化处理
        return s.id; // 实际应该根据 essayTitle 匹配
      }));

      // 过滤出用户未投稿的作文作为可选
      const essays = MOCK_ESSAYS.filter(e =>
        e.ownerIdentityId === currentIdentity.id
        // 暂时不过滤已投稿，因为 getMockAgentSubmissionsByIdentity 返回的 id 实际是 task id
      );
      setAvailableEssays(essays);
    }
  }, [isAuthenticated, currentIdentity]);

  const selectedActivity = selectedActivityId
    ? MOCK_ACTIVITIES.find(a => a.id === selectedActivityId)
    : activity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentIdentity) {
      setError("请先登录");
      return;
    }

    if (!selectedEssayId) {
      setError("请选择要投稿的作文");
      return;
    }

    if (!selectedActivityId && !activity) {
      setError("请选择要投稿的活动");
      return;
    }

    if (!riskConfirmed) {
      setError("请确认一稿多投提示");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 获取学生ID（从作文获取）
      const essay = MOCK_ESSAYS.find(e => e.id === selectedEssayId);
      const studentId = essay?.studentId || "";

      // 调用 mock 创建代投任务
      createMockAgentSubmission(
        {
          essayId: selectedEssayId,
          activityId: selectedActivityId || activity?.id || "",
          riskConfirmed: true,
        },
        currentIdentity.id,
        studentId
      );

      setSubmitted(true);
      setIsSubmitting(false);

      // 触发成功回调
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("提交失败，请重试");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            代投申请已提交
          </h3>
          <p className="text-gray-600 mb-4">
            平台运营人员将尽快处理您的代投请求，请耐心等待
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.push("/agent-submissions")}>
              查看代投记录
            </Button>
            <Button variant="outline" onClick={() => router.push("/activities")}>
              返回活动库
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>申请平台代投</CardTitle>
        <CardDescription>
          选择您的作文和目标活动，平台运营人员将为您完成投稿
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 活动信息（如果有） */}
          {activity && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">目标活动</div>
              <div className="font-medium">{activity.title}</div>
              <div className="text-sm text-gray-500">{activity.publisher?.name}</div>
            </div>
          )}

          {/* 作文选择 */}
          <div>
            <Label htmlFor="essaySelect">选择要投稿的作文</Label>
            <Select value={selectedEssayId} onValueChange={setSelectedEssayId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="请选择作文" />
              </SelectTrigger>
              <SelectContent>
                {availableEssays.length > 0 ? (
                  availableEssays.map((essay) => (
                    <SelectItem key={essay.id} value={essay.id}>
                      {essay.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">暂无可投稿的作文</div>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400 mt-1">
              请先在"我的作文"中创建作文
            </p>
          </div>

          {/* 活动选择（如果没有预选活动） */}
          {!activity && (
            <div>
              <Label htmlFor="activitySelect">选择目标活动</Label>
              <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="请选择活动" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ACTIVITIES.filter(a => a.supportAgentSubmission).map((act) => (
                    <SelectItem key={act.id} value={act.id}>
                      {act.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 活动详情预览 */}
          {selectedActivity && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">活动详情</span>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>征稿方：</strong>{selectedActivity.publisher?.name}</p>
                <p><strong>截止时间：</strong>
                  {selectedActivity.isLongTerm
                    ? "长期有效"
                    : selectedActivity.deadline
                      ? new Date(selectedActivity.deadline).toLocaleDateString("zh-CN")
                      : "未知"}
                </p>
                <p><strong>适合年级：</strong>{selectedActivity.gradeScope?.join(", ")}</p>
                {selectedActivity.submissionEmail && (
                  <p><strong>投稿邮箱：</strong>{selectedActivity.submissionEmail}</p>
                )}
              </div>
            </div>
          )}

          {/* 代投说明 */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">平台代投服务说明</h4>
            <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
              <li>平台运营人员将使用平台邮箱为您完成投稿</li>
              <li>代投费用：{selectedActivity?.hasPayment ? "该活动有稿费，平台代投免费" : "待定"}</li>
              <li>预计完成时间：1-3个工作日</li>
              <li>投稿成功后我们会更新状态并可查看投稿截图</li>
            </ul>
          </div>

          {/* 风险确认 */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-2">一稿多投提示</h4>
                <p className="text-sm text-amber-800 mb-3">
                  部分活动可能存在一稿多投限制，请在投稿前确认：
                </p>
                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1 mb-3">
                  <li>该作文是否已投其他活动</li>
                  <li>该活动是否接受一稿多投</li>
                  <li>同一作文多次投稿可能影响录用结果</li>
                </ul>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="riskConfirm"
                    checked={riskConfirmed}
                    onCheckedChange={(checked) => setRiskConfirmed(checked as boolean)}
                  />
                  <Label htmlFor="riskConfirm" className="text-sm font-medium cursor-pointer">
                    我已确认上述提示，理解代投风险
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Mock 支付按钮 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-gray-500">代投费用：</span>
                <span className="text-2xl font-bold text-primary ml-2">¥0</span>
                <span className="text-sm text-gray-400 ml-1">（限时免费）</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              当前为 Mock 支付，点击下方按钮直接创建代投任务
            </div>
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={!riskConfirmed || isSubmitting}
            className="w-full gap-2 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "提交中..." : "确认申请代投"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}