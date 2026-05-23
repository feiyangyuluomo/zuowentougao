"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuthStore } from "@/stores";
import { SelfSubmissionForm } from "@/components/submission/SelfSubmissionForm";
import { PaywallBlock } from "@/components/common";
import { getMockActivityById } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function NewSelfSubmissionContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activity");
  const { isAuthenticated, currentIdentity } = useAuthStore();

  // 权限检查：需要登录
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaywallBlock
          title="登录后记录投稿"
          description="自主投稿记录功能需要登录后才能使用"
          action={{ label: "立即登录", href: "/login" }}
        />
      </div>
    );
  }

  // 获取活动信息
  const activity = activityId ? getMockActivityById(activityId) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/activities">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">记录自主投稿</h1>
          <p className="text-gray-600">记录您的投稿信息，便于后续跟踪状态</p>
        </div>
      </div>

      {/* Form */}
      {activity ? (
        <div className="max-w-xl">
          <SelfSubmissionForm activity={activity} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">请先选择一个活动</p>
          <Link href="/activities">
            <Button>浏览活动库</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function LoadingContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    </div>
  );
}

export default function NewSelfSubmissionPage() {
  return (
    <Suspense fallback={<LoadingContent />}>
      <NewSelfSubmissionContent />
    </Suspense>
  );
}