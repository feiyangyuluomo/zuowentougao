import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Inbox, Search, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  className?: string;
  variant?: "default" | "no-data" | "no-results" | "no-essays" | "no-students";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantConfig = {
  default: {
    icon: Inbox,
    title: "暂无数据",
    description: "这里还没有任何内容",
  },
  "no-data": {
    icon: FileText,
    title: "暂无数据",
    description: "暂无相关记录，请稍后再试",
  },
  "no-results": {
    icon: Search,
    title: "未找到结果",
    description: "没有找到匹配的内容，请尝试其他筛选条件",
  },
  "no-essays": {
    icon: FileText,
    title: "还没有作文",
    description: "上传第一篇作文，开始您的投稿之旅",
  },
  "no-students": {
    icon: FolderOpen,
    title: "还没有学生",
    description: "添加学生后可以开始管理作文和投稿",
  },
};

export function EmptyState({
  className,
  variant = "default",
  title,
  description,
  action,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-lg border border-dashed bg-gray-50",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || config.title}
      </h3>

      <p className="text-sm text-gray-500 text-center mb-6 max-w-md">
        {description || config.description}
      </p>

      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}