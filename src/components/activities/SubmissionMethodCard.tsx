// ============================================================================
// 投稿方式卡片组件
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Globe, MessageSquare, Send, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { SubmissionMethod } from "@/types";

interface SubmissionMethodCardProps {
  email?: string;
  method?: SubmissionMethod;
  format?: string;
  emailSubjectFormat?: string;
  onCopyEmail?: () => void;
}

export function SubmissionMethodCard({
  email,
  method,
  format,
  emailSubjectFormat,
}: SubmissionMethodCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (email) {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getMethodIcon = (m?: SubmissionMethod) => {
    switch (m) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "website":
        return <Globe className="h-5 w-5" />;
      case "wechat":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Send className="h-5 w-5" />;
    }
  };

  const getMethodLabel = (m?: SubmissionMethod) => {
    switch (m) {
      case "email":
        return "邮箱投稿";
      case "website":
        return "官网投稿";
      case "mini_program":
        return "小程序投稿";
      case "wechat":
        return "微信投稿";
      case "system":
        return "系统投稿";
      case "offline":
        return "线下投稿";
      default:
        return "其他方式";
    }
  };

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-blue-50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getMethodIcon(method)}
            投稿方式
          </CardTitle>
          <Badge variant="default" className="bg-blue-600">
            {getMethodLabel(method)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* 邮箱 */}
        {email && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-500 mb-1">投稿邮箱</div>
              <div className="font-semibold text-lg">{email}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制
                </>
              )}
            </Button>
          </div>
        )}

        {/* 邮件主题格式 */}
        {emailSubjectFormat && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-2">邮件主题格式</div>
            <div className="font-mono text-sm bg-white p-3 rounded border border-blue-100">
              {emailSubjectFormat}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              请将上述格式中的占位符替换为实际内容后发送
            </div>
          </div>
        )}

        {/* 投稿格式要求 */}
        {format && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-2">投稿格式要求</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {format}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}