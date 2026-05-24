"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { AIPromptSection } from "@/components/ai/AIPromptSection";
import { AIRecommendResultList } from "@/components/ai/AIRecommendResult";
import { PaywallBlock } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Sparkles, Upload, CheckCircle } from "lucide-react";
import { GRADE_OPTIONS } from "@/constants";
import { MOCK_AI_ANALYSIS_RESULT, MOCK_AI_RECOMMEND_RESULTS } from "@/lib/mock/ai-results";
import { createMockEssay } from "@/lib/mock/essays";
import type { AIAnalysisOutput, AIRecommendResult } from "@/types";

export default function AIAssistantPage() {
  const router = useRouter();
  const { isAuthenticated, isMember, currentIdentity } = useAuthStore();
  const [grade, setGrade] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisOutput | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendResult[]>([]);
  const [showRecommend, setShowRecommend] = useState(false);

  // 权限检查：需要登录且是会员
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaywallBlock
          title="登录后使用AI投稿助手"
          description="AI投稿助手需要登录后才能使用，登录后将获得AI分析和推荐功能"
          action={{ label: "立即登录", href: "/login" }}
        />
      </div>
    );
  }

  if (!isMember()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaywallBlock
          title="开通会员使用AI功能"
          description="AI投稿助手是会员专享功能，开通会员后可无限次使用AI分析、推荐、改稿等功能"
          action={{ label: "开通会员", href: "/membership" }}
        />
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!content.trim() && !grade) return;

    setIsAnalyzing(true);
    // 使用 mock 数据模拟 AI 分析
    setTimeout(() => {
      setAnalysisResult(MOCK_AI_ANALYSIS_RESULT);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleGetRecommendations = () => {
    // 使用 mock 数据模拟 AI 推荐
    setTimeout(() => {
      setRecommendations(MOCK_AI_RECOMMEND_RESULTS);
      setShowRecommend(true);
    }, 1000);
  };

  const handleSelectActivity = (activityId: string) => {
    // 跳转到活动详情页面
    router.push(`/activities/${activityId}`);
  };

  const handleSaveToEssays = (dialogTitle: string) => {
    // 优先使用用户输入的标题，否则使用弹窗传入的标题
    const finalTitle = title.trim() || dialogTitle;
    if (!finalTitle) {
      alert("请输入作文标题");
      return;
    }

    if (!currentIdentity) {
      alert("请先登录");
      return;
    }

    // 创建新作文
    const newEssay = createMockEssay({
      title: finalTitle,
      content: content,
      grade: grade,
      ownerIdentityId: currentIdentity.id,
    });

    alert(`作文"${finalTitle}"已保存到"我的作文"中`);
    // 清空标题
    setTitle("");
    // 跳转到我的作文页面
    router.push("/essays");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">AI驱动的智能推荐</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          AI投稿助手
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          上传您的作文，AI将分析内容特点，推荐最适合的投稿活动
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>上传作文</CardTitle>
                <CardDescription>
                  支持直接粘贴作文内容，建议200-800字
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Grade Selection */}
                <div>
                  <Label>学生年级</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="请选择年级" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_OPTIONS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title Input */}
                <div>
                  <Label>作文标题（选填）</Label>
                  <Input
                    placeholder="请输入作文标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Content Input */}
                <div>
                  <Label>作文内容</Label>
                  <Textarea
                    placeholder="请粘贴作文内容..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] mt-2"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    字数：{content.length} 字
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={(!content.trim() && !grade) || isAnalyzing}
                  className="w-full gap-2 bg-primary hover:bg-primary/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      AI分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      开始分析
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="font-medium">AI投稿助手功能</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>智能分析作文内容和特点</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>推荐最适合的投稿活动</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>提供个性化投稿建议</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>一键跳转到活动详情</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis Result */}
            <AIPromptSection
              analysis={analysisResult}
              isLoading={isAnalyzing}
              onStartRecommend={handleGetRecommendations}
              essayContent={content}
              essayTitle={title}
              onSaveToEssays={handleSaveToEssays}
            />

            {/* AI Recommendations */}
            {showRecommend && (
              <AIRecommendResultList
                recommendations={recommendations}
                onSelectActivity={handleSelectActivity}
              />
            )}

            {/* Empty State */}
            {!analysisResult && !isAnalyzing && (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    上传作文后，AI将为您分析内容特点
                  </p>
                  <p className="text-sm text-gray-400">
                    分析完成后，点击「获取活动推荐」查看推荐结果
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}