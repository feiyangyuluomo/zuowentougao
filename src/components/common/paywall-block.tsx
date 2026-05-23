"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";

interface PaywallBlockProps {
  title?: string;
  description?: string;
  price?: string;
  features?: string[];
  className?: string;
  onUnlock?: () => void;
}

export function PaywallBlock({
  title = "开通会员查看完整内容",
  description = "会员专享：查看投稿邮箱、获取详细投稿方式、使用AI推荐功能",
  price = "99.9元/年",
  features = [
    "查看所有活动完整详情",
    "查看投稿邮箱和投稿方式",
    "使用AI推荐活动功能",
    "使用AI改稿功能",
    "记录自主投稿",
    "申请平台代投服务",
  ],
  className,
  onUnlock,
}: PaywallBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed bg-gray-50",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
        <Lock className="h-6 w-6 text-primary" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      <p className="text-sm text-gray-500 text-center mb-6 max-w-md">
        {description}
      </p>

      <div className="bg-white rounded-lg p-4 mb-6 w-full max-w-sm">
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-primary">{price}</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90"
        onClick={onUnlock}
      >
        立即开通会员
      </Button>

      <p className="text-xs text-gray-400 mt-4">
        登录后可查看会员价格，已登录可跳过此步骤
      </p>
    </div>
  );
}