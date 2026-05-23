"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface PermissionGuardProps {
  children: React.ReactNode;
  isAllowed: boolean;
  fallback?: "login" | "paywall" | "403";
  className?: string;
}

export function PermissionGuard({
  children,
  isAllowed,
  fallback = "login",
  className,
}: PermissionGuardProps) {
  const router = useRouter();

  if (isAllowed) {
    return <div className={className}>{children}</div>;
  }

  const fallbackContent = {
    login: {
      icon: AlertCircle,
      title: "请先登录",
      description: "登录后即可访问此功能",
      action: () => router.push("/login"),
      actionText: "去登录",
    },
    paywall: {
      icon: AlertCircle,
      title: "开通会员",
      description: "此功能需要开通会员才能使用",
      action: () => router.push("/membership"),
      actionText: "开通会员",
    },
    403: {
      icon: AlertCircle,
      title: "无权访问",
      description: "您没有权限访问此功能",
      action: () => router.push("/"),
      actionText: "返回首页",
    },
  };

  const content = fallbackContent[fallback];
  const Icon = content.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-lg border border-gray-200 bg-gray-50",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <Icon className="h-6 w-6 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>

      <p className="text-sm text-gray-500 text-center mb-6">
        {content.description}
      </p>

      <Button onClick={content.action}>{content.actionText}</Button>
    </div>
  );
}