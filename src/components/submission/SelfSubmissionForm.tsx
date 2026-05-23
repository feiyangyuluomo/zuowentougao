// ============================================================================
// 自主投稿表单组件
// ============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { createMockSelfSubmission } from "@/lib/mock/self-submissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Check, Send } from "lucide-react";
import type { Activity, SubmissionMethod } from "@/types";

interface SelfSubmissionFormProps {
  activity: Activity;
  essayId?: string;
  onSuccess?: () => void;
}

export function SelfSubmissionForm({ activity, essayId, onSuccess }: SelfSubmissionFormProps) {
  const router = useRouter();
  const { currentIdentity } = useAuthStore();
  const [submissionEmail, setSubmissionEmail] = useState("");
  const [submissionMethod, setSubmissionMethod] = useState<SubmissionMethod>(activity.submissionMethod || "email");
  const [userNote, setUserNote] = useState("");
  const [riskConfirmed, setRiskConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentIdentity) {
      setError("请先登录");
      return;
    }

    if (!riskConfirmed) {
      setError("请确认一稿多投提示");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 调用 mock 创建投稿记录
      createMockSelfSubmission(
        {
          essayId: essayId || "",
          activityId: activity.id,
          submissionEmail,
          submissionMethod,
          userNote,
        },
        currentIdentity.id
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
            自主投稿记录已保存
          </h3>
          <p className="text-gray-600 mb-4">
            您可以前往活动详情页查看投稿信息，并自行完成邮箱投稿
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.push(`/activities/${activity.id}`)}>
              查看活动详情
            </Button>
            <Button variant="outline" onClick={() => router.push("/self-submissions")}>
              查看投稿记录
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>记录自主投稿</CardTitle>
        <CardDescription>
          记录您的投稿信息，便于后续跟踪投稿状态
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

          {/* 活动信息 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">当前活动</div>
            <div className="font-medium">{activity.title}</div>
            <div className="text-sm text-gray-500">{activity.publisher?.name}</div>
          </div>

          {/* 投稿邮箱 */}
          <div>
            <Label htmlFor="submissionEmail">您的投稿邮箱</Label>
            <Input
              id="submissionEmail"
              type="email"
              placeholder="请输入您用于投稿的邮箱"
              value={submissionEmail}
              onChange={(e) => setSubmissionEmail(e.target.value)}
              className="mt-2"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              用于记录您投稿时使用的邮箱地址
            </p>
          </div>

          {/* 投稿方式 */}
          <div>
            <Label>投稿方式</Label>
            <Select
              value={submissionMethod}
              onValueChange={(value) => setSubmissionMethod(value as SubmissionMethod)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">邮箱投稿</SelectItem>
                <SelectItem value="website">官网投稿</SelectItem>
                <SelectItem value="wechat">微信投稿</SelectItem>
                <SelectItem value="mini_program">小程序投稿</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 备注 */}
          <div>
            <Label htmlFor="userNote">备注（可选）</Label>
            <Textarea
              id="userNote"
              placeholder="如：已按照格式要求发送，等待回复中..."
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              className="mt-2"
              rows={3}
            />
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
                    我已确认上述提示，理解投稿风险
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={!riskConfirmed || isSubmitting}
            className="w-full gap-2 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "保存中..." : "保存投稿记录"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}