// ============================================================================
// 自主投稿记录列表组件
// ============================================================================

import { SelfSubmissionCard } from "./SelfSubmissionCard";
import { EmptyState } from "@/components/common";
import type { SelfSubmissionListItem } from "@/types";

interface SelfSubmissionListProps {
  submissions: SelfSubmissionListItem[];
  isLoading?: boolean;
}

export function SelfSubmissionList({ submissions, isLoading }: SelfSubmissionListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        variant="no-results"
        title="暂无投稿记录"
        description="您还没有创建任何自主投稿记录"
        action={{
          label: "去活动库看看",
          href: "/activities",
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {submissions.map((submission) => (
        <SelfSubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
}