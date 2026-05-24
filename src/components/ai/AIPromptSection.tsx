// ============================================================================
// AI 分析结果展示区组件
// ============================================================================

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, AlertTriangle, CheckCircle, ArrowRight, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AIAnalysisOutput } from "@/types";

interface AIPromptSectionProps {
  analysis: AIAnalysisOutput | null;
  isLoading?: boolean;
  onStartRecommend?: () => void;
  essayContent?: string;
  essayTitle?: string;
  onSaveToEssays?: (title: string) => void;
}

export function AIPromptSection({ analysis, isLoading, onStartRecommend, essayContent, essayTitle, onSaveToEssays }: AIPromptSectionProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [dialogEssayTitle, setDialogEssayTitle] = useState("");

  // 当弹窗打开时，如果已经有标题则预填
  useState(() => {
    if (essayTitle) {
      setDialogEssayTitle(essayTitle);
    }
  });

  const handleSaveToEssays = () => {
    const finalTitle = dialogEssayTitle.trim();
    if (finalTitle && onSaveToEssays) {
      onSaveToEssays(finalTitle);
      setShowSaveDialog(false);
      setDialogEssayTitle("");
    }
  };

  const openSaveDialog = () => {
    setDialogEssayTitle(essayTitle || "");
    setShowSaveDialog(true);
  };
  if (isLoading) {
    return (
      <Card className="border-2 border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI 分析中...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            AI 正在分析您的作文，请稍候...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-500">
            <Sparkles className="h-5 w-5" />
            AI 智能分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            上传作文后，AI 将分析作文内容并推荐适合的活动
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-100 bg-purple-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI 分析结果
          </CardTitle>
          {analysis.qualityScore && (
            <Badge variant="default" className="bg-purple-600">
              质量评分: {analysis.qualityScore}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-3">
          {analysis.qualityScore && (
            <div className="p-3 bg-white rounded-lg border border-purple-200">
              <div className="text-xs text-gray-500 mb-1">质量评分</div>
              <div className="font-medium text-purple-700">{analysis.qualityScore}/100</div>
            </div>
          )}
          {analysis.genre && (
            <div className="p-3 bg-white rounded-lg border">
              <div className="text-xs text-gray-500 mb-1">文章文体</div>
              <div className="font-medium">
                {analysis.genre === "narrative" && "记叙文"}
                {analysis.genre === "argumentative" && "议论文"}
                {analysis.genre === "prose" && "散文"}
                {analysis.genre === "poetry" && "诗歌"}
                {analysis.genre === "letter" && "书信"}
                {analysis.genre === "speech" && "演讲稿"}
                {analysis.genre === "other" && "其他"}
              </div>
            </div>
          )}
        </div>

        {/* 主题标签 */}
        {analysis.theme && analysis.theme.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-2">主题标签</div>
            <div className="flex flex-wrap gap-2">
              {analysis.theme.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 写作建议 */}
        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-2">写作建议</div>
            <div className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 适合活动类型 */}
        {analysis.suitableActivities && analysis.suitableActivities.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-2">适合的活动类型</div>
            <div className="flex flex-wrap gap-2">
              {analysis.suitableActivities.map((type) => (
                <Badge key={type} variant="outline" className="text-purple-700 border-purple-300 bg-purple-50">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 风险提示 */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <div className="font-medium mb-1">投稿注意事项</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>投稿前请确认作文为原创内容</li>
                <li>部分活动可能存在一稿多投限制</li>
                <li>建议留存投稿截图以便跟踪</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        {onStartRecommend && (
          <div className="flex gap-2">
            <Button
              onClick={openSaveDialog}
              variant="outline"
              className="flex-1 gap-2"
              disabled={!essayContent}
            >
              <Save className="h-4 w-4" />
              保存到我的作文
            </Button>
            <Button
              onClick={onStartRecommend}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" />
              获取活动推荐
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* 保存到作文弹窗 */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>保存到我的作文</DialogTitle>
              <DialogDescription>
                为您的作文设置一个标题，然后保存到"我的作文"中
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="essayTitle">作文标题</Label>
                <Input
                  id="essayTitle"
                  placeholder="请输入作文标题"
                  value={dialogEssayTitle}
                  onChange={(e) => setDialogEssayTitle(e.target.value)}
                />
              </div>
              {essayContent && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">作文内容预览</div>
                  <p className="text-sm text-gray-700 line-clamp-3">{essayContent}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                取消
              </Button>
              <Button onClick={handleSaveToEssays} disabled={!dialogEssayTitle.trim()}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}