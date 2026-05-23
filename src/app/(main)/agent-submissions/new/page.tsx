"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuthStore } from "@/stores";
import { AgentSubmissionForm } from "@/components/agent/AgentSubmissionForm";
import { PaywallBlock } from "@/components/common";
import { getMockActivityById } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function NewAgentSubmissionContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activity");
  const { isAuthenticated } = useAuthStore();

  // 权限检查：需要登录
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaywallBlock
          title="登录后申请代投"
          description="平台代投功能需要登录后才能使用"
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
          <h1 className="text-2xl font-bold text-gray-900">申请平台代投</h1>
          <p className="text-gray-600">平台运营人员将为您完成投稿</p>
        </div>
      </div>

      {/* Form */}
      {activity ? (
        <div className="max-w-xl">
          <AgentSubmissionForm activity={activity} />
        </div>
      ) : (
        <div className="max-w-xl">
          <AgentSubmissionForm />
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

export default function NewAgentSubmissionPage() {
  return (
    <Suspense fallback={<LoadingContent />}>
      <NewAgentSubmissionContent />
    </Suspense>
  );
}