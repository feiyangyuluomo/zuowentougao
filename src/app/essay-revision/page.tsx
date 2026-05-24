"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import {
  calculateRevisionFee,
  calculateTotalFee,
  getRushMultiplier,
  getFeeTable,
  ESSAY_LEVEL_LABELS,
  RUSH_TYPE_LABELS,
  AI_REVISION_FEE_PER_TIME,
  type EssayLevel,
  type RushType,
} from "@/lib/pricing/essay-revision";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  ESSAY_REVIEW_PAGE_VIEW,
  ESSAY_REVIEW_ENTRY_CLICK,
  ESSAY_REVIEW_SUBMIT_CLICK,
  MANUAL_REVIEW_APPLY_CLICK,
  REVIEW_PAYMENT_CTA_CLICK,
  trackEvent,
} from "@/lib/analytics";

/**
 * 作文批改服务页面
 */
export default function EssayRevisionPage() {
  const { currentIdentity } = useAuthStore();
  const [selectedEssayId, setSelectedEssayId] = useState<string | null>(null);
  const [newEssayContent, setNewEssayContent] = useState("");
  const [newEssayTitle, setNewEssayTitle] = useState("");
  const [revisionType, setRevisionType] = useState<"ai" | "manual">("ai");
  const [essayLevel, setEssayLevel] = useState<EssayLevel>("primary");
  const [rushType, setRushType] = useState<RushType>("none");
  const [sourceType, setSourceType] = useState<"new" | "existing">("new");

  // 获取用户的作文列表
  const userEssays = currentIdentity
    ? MOCK_ESSAYS.filter((e) => e.ownerIdentityId === currentIdentity.id)
    : [];

  // 选中的作文
  const selectedEssay = selectedEssayId
    ? MOCK_ESSAYS.find((e) => e.id === selectedEssayId)
    : null;

  // 当前作文内容
  const currentContent = selectedEssay?.content || newEssayContent;
  const currentTitle = selectedEssay?.title || newEssayTitle;

  // 计算字数
  const wordCount = currentContent.replace(/\s/g, "").length;

  // 计算费用
  const manualFee = revisionType === "manual" ? calculateRevisionFee(wordCount, essayLevel) : 0;
  const rushMultiplier = getRushMultiplier(rushType);
  const totalFee = revisionType === "manual"
    ? calculateTotalFee(wordCount, essayLevel, rushType)
    : AI_REVISION_FEE_PER_TIME;

  // 费用明细
  const feeTable = getFeeTable(essayLevel);

  // 页面浏览埋点
  useEffect(() => {
    trackEvent(ESSAY_REVIEW_PAGE_VIEW, {
      pagePath: "/essay-revision",
      reviewType: revisionType,
    });
  }, []);

  // 作文选择埋点
  const handleEssaySelect = (essayId: string) => {
    setSelectedEssayId(essayId);
    const essay = MOCK_ESSAYS.find((e) => e.id === essayId);
    trackEvent(ESSAY_REVIEW_ENTRY_CLICK, {
      essayId,
      studentId: "",
      sourcePage: "/essay-revision",
      reviewType: revisionType,
    });
  };

  // 批改类型切换埋点
  const handleRevisionTypeChange = (type: "ai" | "manual") => {
    setRevisionType(type);
    trackEvent(ESSAY_REVIEW_ENTRY_CLICK, {
      essayId: selectedEssayId || "",
      studentId: "",
      sourcePage: "/essay-revision",
      reviewType: type,
    });
  };

  // 提交批改申请埋点
  const handleSubmitRevision = () => {
    if (revisionType === "manual") {
      trackEvent(MANUAL_REVIEW_APPLY_CLICK, {
        essayId: selectedEssayId || "",
        studentId: "",
        reviewType: "manual",
      });
    }
    trackEvent(ESSAY_REVIEW_SUBMIT_CLICK, {
      essayId: selectedEssayId || "",
      studentId: "",
      reviewType: revisionType,
      wordCount,
    });
  };

  // 支付按钮埋点
  const handlePaymentClick = () => {
    trackEvent(REVIEW_PAYMENT_CTA_CLICK, {
      essayId: selectedEssayId || "",
      studentId: "",
      reviewType: revisionType,
      sourcePage: "/essay-revision",
    });
  };

  const handleSourceChange = (source: "new" | "existing") => {
    setSourceType(source);
    if (source === "new") {
      setNewEssayContent("");
      setNewEssayTitle("");
      setSelectedEssayId(null);
    } else {
      setNewEssayContent("");
      setNewEssayTitle("");
    }
  };

  if (!currentIdentity) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle className="h-12 w-12 mb-4 text-gray-300" />
            <p>请先登录并选择身份</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">作文批改服务</h1>
        <p className="text-gray-500 mt-1">上传作文或选择已有作文，享受专业批改服务</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：作文选择 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 选择作文来源 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">选择作文</CardTitle>
              <CardDescription>上传新作文或选择已有的作文</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant={sourceType === "new" ? "default" : "outline"}
                  onClick={() => handleSourceChange("new")}
                >
                  上传新作文
                </Button>
                <Button
                  variant={sourceType === "existing" ? "default" : "outline"}
                  onClick={() => handleSourceChange("existing")}
                >
                  选择已有作文
                </Button>
              </div>

              {sourceType === "existing" ? (
                // 已有作文列表
                <div className="space-y-2">
                  <Select value={selectedEssayId || ""} onValueChange={handleEssaySelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择作文" />
                    </SelectTrigger>
                    <SelectContent>
                      {userEssays.length === 0 ? (
                        <SelectItem value="none" disabled>
                          暂无作文，请上传新作文
                        </SelectItem>
                      ) : (
                        userEssays.map((essay) => (
                          <SelectItem key={essay.id} value={essay.id}>
                            {essay.title} ({essay.wordCount}字)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedEssay && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{selectedEssay.title}</h4>
                        <Badge variant="outline">{selectedEssay.wordCount}字</Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{selectedEssay.content}</p>
                    </div>
                  )}
                </div>
              ) : (
                // 上传新作文
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">作文标题</Label>
                    <Input
                      id="title"
                      value={newEssayTitle}
                      onChange={(e) => setNewEssayTitle(e.target.value)}
                      placeholder="请输入作文标题"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">作文内容</Label>
                    <Textarea
                      id="content"
                      value={newEssayContent}
                      onChange={(e) => setNewEssayContent(e.target.value)}
                      placeholder="请粘贴或输入作文内容..."
                      className="mt-1 min-h-[200px]"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 批改类型选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">批改服务</CardTitle>
              <CardDescription>选择 AI 批改或人工精批</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={revisionType === "ai" ? "default" : "outline"}
                  onClick={() => handleRevisionTypeChange("ai")}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Zap className="h-6 w-6 text-yellow-500" />
                  <span className="font-medium">AI 批改</span>
                  <span className="text-xs opacity-70">快速、经济</span>
                </Button>
                <Button
                  variant={revisionType === "manual" ? "default" : "outline"}
                  onClick={() => handleRevisionTypeChange("manual")}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  <FileText className="h-6 w-6 text-blue-500" />
                  <span className="font-medium">人工精批</span>
                  <span className="text-xs opacity-70">专业深度批改</span>
                </Button>
              </div>

              {revisionType === "ai" ? (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">AI 智能批改</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        快速、专业、经济的批改服务。由 AI 提供语法检查、表达优化、结构建议等服务。
                      </p>
                      <p className="text-lg font-semibold text-yellow-900 mt-2">
                        费用：{AI_REVISION_FEE_PER_TIME}元/次
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* 作文类型 */}
                  <div>
                    <Label className="mb-2 block">作文类型</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={essayLevel === "primary" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEssayLevel("primary")}
                      >
                        小学作文
                      </Button>
                      <Button
                        variant={essayLevel === "middle" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEssayLevel("middle")}
                      >
                        中学作文
                      </Button>
                    </div>
                  </div>

                  {/* 加急服务 */}
                  <div>
                    <Label className="mb-2 block">批改时效</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={rushType === "none" ? "default" : "outline"}
                        onClick={() => setRushType("none")}
                        className="flex flex-col items-center py-3"
                      >
                        <span>普通</span>
                      </Button>
                      <Button
                        variant={rushType === "24h" ? "default" : "outline"}
                        onClick={() => setRushType("24h")}
                        className="flex flex-col items-center py-3"
                      >
                        <span>24小时</span>
                        <span className="text-xs opacity-70">×1.5</span>
                      </Button>
                      <Button
                        variant={rushType === "12h" ? "default" : "outline"}
                        onClick={() => setRushType("12h")}
                        className="flex flex-col items-center py-3"
                      >
                        <span>12小时</span>
                        <span className="text-xs opacity-70">×2</span>
                      </Button>
                    </div>
                  </div>

                  {/* 费用说明 */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">人工精批服务</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          由专业老师进行深度批改，包括文章结构、表达方式、写作技巧等全方位指导。
                        </p>

                        <div className="mt-3 p-3 bg-white rounded border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">当前作文字数：</span>
                            <span className="font-semibold">{wordCount} 字</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">作文类型：</span>
                            <span className="font-semibold">{ESSAY_LEVEL_LABELS[essayLevel]}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">批改时效：</span>
                            <span className="font-semibold">{RUSH_TYPE_LABELS[rushType]}</span>
                          </div>
                          {rushType !== "none" && (
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                              <span>基础费用 × {rushMultiplier}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-gray-600">费用合计：</span>
                            <span className="text-xl font-bold text-blue-600">¥{totalFee}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：费用明细 */}
        <div className="space-y-6">
          {/* 费用预览 */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">费用预览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wordCount > 0 ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">作文字数</span>
                    <span className="font-medium">{wordCount} 字</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">批改方式</span>
                    <span className="font-medium">
                      {revisionType === "ai" ? "AI 批改" : "人工精批"}
                    </span>
                  </div>
                  {revisionType === "manual" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">作文类型</span>
                        <span className="font-medium">{ESSAY_LEVEL_LABELS[essayLevel]}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">批改时效</span>
                        <span className="font-medium">{RUSH_TYPE_LABELS[rushType]}</span>
                      </div>
                    </>
                  )}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">应付金额</span>
                      <span className="text-2xl font-bold text-primary">
                        ¥{totalFee}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {revisionType === "ai"
                        ? "AI批改服务费"
                        : `基础费¥${manualFee}${rushType !== "none" ? ` × ${rushMultiplier}` : ""}`}
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={wordCount === 0}
                    onClick={() => {
                      handleSubmitRevision();
                      handlePaymentClick();
                    }}
                  >
                    提交批改申请
                  </Button>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>请先选择或上传作文</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 收费明细表 */}
          {revisionType === "manual" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{ESSAY_LEVEL_LABELS[essayLevel]}收费报价单</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left py-2">字数范围</th>
                      <th className="text-right py-2">费用</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeTable.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2 text-gray-600">{item.wordRange}</td>
                        <td className="py-2 text-right font-medium">¥{item.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 mt-3 text-center">更多字数依次类推</p>
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">
                  <p className="font-medium text-gray-700 mb-1">加急服务说明：</p>
                  <p>• 加急24小时：基础费用 × 1.5</p>
                  <p>• 加急12小时：基础费用 × 2</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 常见问题 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">服务说明</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>AI 批改：快速、经济，适合日常练习，但不建议投递AI批改稿件</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>人工精批：专业老师深度批改，适合重要作品</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>批改完成后可在"我的作文"中查看结果</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>如有多篇作文，每篇单独报价</p>
              </div>
            </CardContent>
          </Card>

          {/* 链接到我的作文 */}
          <Link href="/essays">
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              查看我的作文
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}