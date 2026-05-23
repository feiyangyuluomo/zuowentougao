"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/common";
import { PaywallBlock } from "@/components/common";
import {
  Upload,
  FileText,
  Sparkles,
  Lightbulb,
  Send,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual auth check and AI API
const mockIsLoggedIn = false;
const mockIsMember = false;

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedEssay, setUploadedEssay] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload
      setUploadedEssay(file.name);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedEssay) return;
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        grade: "4年级",
        genre: "记叙文",
        theme: "植物、成长、友情",
        wordCount: 356,
        suggestions: [
          "文章结构清晰，开头结尾呼应",
          "细节描写较为生动，如'叶子绿油油的，像小爱心'",
          "可以增加一些环境描写来烘托氛围",
          "结尾的感悟可以更深入一些",
        ],
        recommendedActivities: [
          { id: "act-001", title: "2024年"童心向未来"主题作文征集" },
          { id: "act-004", title: "每周好稿精选征集" },
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">AI驱动的智能推荐</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          AI投稿助手
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          上传您的作文，AI将分析内容特点，推荐最适合的投稿活动，并提供改稿建议
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Panel - Upload & Input */}
        <Card>
          <CardHeader>
            <CardTitle>上传作文</CardTitle>
            <CardDescription>
              支持上传Word文档或直接粘贴作文内容
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div>
              <Label>上传文件</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors mt-2">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  点击选择文件或拖拽文件到此处
                </p>
                <p className="text-xs text-gray-400">
                  支持 .doc, .docx, .txt 格式
                </p>
                <input
                  type="file"
                  accept=".doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {uploadedEssay && (
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {uploadedEssay}
                </div>
              )}
            </div>

            {/* Text Input */}
            <div>
              <Label>或粘贴作文内容</Label>
              <Textarea
                placeholder="请将作文内容粘贴在这里..."
                className="min-h-[200px] mt-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                字数建议在200-1000字之间
              </p>
            </div>

            {/* Student Info */}
            <div>
              <Label>学生年级</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="请选择年级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1年级</SelectItem>
                  <SelectItem value="2">2年级</SelectItem>
                  <SelectItem value="3">3年级</SelectItem>
                  <SelectItem value="4">4年级</SelectItem>
                  <SelectItem value="5">5年级</SelectItem>
                  <SelectItem value="6">6年级</SelectItem>
                  <SelectItem value="7">初一</SelectItem>
                  <SelectItem value="8">初二</SelectItem>
                  <SelectItem value="9">初三</SelectItem>
                  <SelectItem value="10">高一</SelectItem>
                  <SelectItem value="11">高二</SelectItem>
                  <SelectItem value="12">高三</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button
              onClick={handleAnalyze}
              disabled={!uploadedEssay || isAnalyzing}
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
                  开始AI分析
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right Panel - Results */}
        <Card>
          <CardHeader>
            <CardTitle>AI分析结果</CardTitle>
          </CardHeader>
          <CardContent>
            {!analysisResult ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Lightbulb className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  上传作文后，AI将为您分析并推荐活动
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Analysis Summary */}
                <div>
                  <h4 className="font-medium mb-3">AI分析摘要</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">年级</div>
                      <div className="font-medium">{analysisResult.grade}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">文体</div>
                      <div className="font-medium">{analysisResult.genre}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">主题</div>
                      <div className="font-medium">{analysisResult.theme}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">字数</div>
                      <div className="font-medium">{analysisResult.wordCount}</div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <h4 className="font-medium mb-3">写作建议</h4>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Activities */}
                <div>
                  <h4 className="font-medium mb-3">推荐活动</h4>
                  <div className="space-y-2">
                    {analysisResult.recommendedActivities.map((act: any) => (
                      <Link
                        key={act.id}
                        href={`/activities/${act.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors">
                          <span className="text-sm">{act.title}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI改稿
                  </Button>
                  <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                    自主投稿
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">智能分析</h3>
            <p className="text-sm text-gray-600">
              AI自动分析作文内容、主题、文体，精准匹配适合的活动
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">改稿建议</h3>
            <p className="text-sm text-gray-600">
              AI提供专业的改稿建议，帮助您提升作文质量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">一键投稿</h3>
            <p className="text-sm text-gray-600">
              获取投稿方式后可直接自主投稿或申请平台代投
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}