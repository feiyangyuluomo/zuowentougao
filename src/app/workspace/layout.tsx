"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Send,
  BookMarked,
  UserCog,
  Heart,
  ShoppingCart,
  Archive,
} from "lucide-react";

const WORKSPACE_MENU = [
  {
    title: "工作台首页",
    href: "/workspace",
    icon: LayoutDashboard,
    roles: ["parent", "teacher", "organization_admin", "organization_teacher", "operator", "admin"],
  },
  // 班级管理 - 个人老师、机构老师、机构管理员
  {
    title: "班级管理",
    href: "/workspace/classes",
    icon: Users,
    roles: ["teacher", "organization_admin", "organization_teacher"],
  },
  // 学生管理 - 个人老师、机构管理员、机构老师、家长
  {
    title: "学生管理",
    href: "/workspace/students",
    icon: BookOpen,
    roles: ["teacher", "organization_admin", "organization_teacher"],
  },
  // 我的孩子 - 家长视角
  {
    title: "我的孩子",
    href: "/workspace/students",
    icon: Heart,
    roles: ["parent"],
  },
  // 老师管理 - 仅机构管理员
  {
    title: "老师管理",
    href: "/workspace/teachers",
    icon: UserCog,
    roles: ["organization_admin"],
  },
  // 作文管理
  {
    title: "作文管理",
    href: "/workspace/essays",
    icon: BookMarked,
    roles: ["parent", "teacher", "organization_admin", "organization_teacher"],
  },
  // 投稿记录
  {
    title: "投稿记录",
    href: "/workspace/submissions",
    icon: Send,
    roles: ["parent", "teacher", "organization_admin", "organization_teacher"],
  },
  // 平台代投记录
  {
    title: "平台代投记录",
    href: "/agent-submissions",
    icon: ShoppingCart,
    roles: ["parent", "teacher", "organization_admin", "organization_teacher"],
  },
  // 成长档案 - 所有角色
  {
    title: "成长档案",
    href: "/growth-records",
    icon: Archive,
    roles: ["parent", "teacher", "organization_admin", "organization_teacher", "operator", "admin"],
  },
  // 批量上传 - 个人老师、机构管理员、机构老师
  {
    title: "批量上传",
    href: "/workspace/essays/batch",
    icon: FileText,
    roles: ["teacher", "organization_admin", "organization_teacher"],
  },
  // 数据统计 - 个人老师、机构老师、机构管理员
  {
    title: "数据统计",
    href: "/workspace/statistics",
    icon: BarChart3,
    roles: ["teacher", "organization_admin", "organization_teacher"],
  },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentIdentity, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">请先登录</h1>
          <p className="mt-2 text-gray-600">正在跳转到登录页...</p>
        </div>
      </div>
    );
  }

  if (!canAccessWorkspace(currentIdentity)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">无权访问</h1>
          <p className="mt-2 text-gray-600">您没有权限访问此工作台</p>
          <Link href="/">
            <Button className="mt-4">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const identityTypeLabels: Record<string, string> = {
    teacher: "个人老师",
    organization_admin: "机构管理员",
    organization_teacher: "机构老师",
    parent: "家长",
    operator: "运营人员",
    admin: "管理员",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-sm">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/workspace" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">我的工作台</span>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {WORKSPACE_MENU.filter(
            (item) =>
              !item.roles ||
              (currentIdentity && item.roles.includes(currentIdentity.identityType))
          ).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/workspace" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="text-sm font-medium text-primary">
            {currentIdentity && identityTypeLabels[currentIdentity.identityType]}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}