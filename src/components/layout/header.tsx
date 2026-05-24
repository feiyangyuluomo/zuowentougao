"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";
import { MAIN_MENU, USER_MENU, WORKSPACE_MENU_ITEMS, ROUTES, AGENT_SUBMISSION_CTA } from "@/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import type { IdentityType } from "@/types/common";

// 判断是否为运营相关角色
function isOperatorRole(identityType?: IdentityType): boolean {
  return identityType === "operator" || identityType === "admin" || identityType === "editor";
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isMember, currentIdentity } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // 根据角色获取工作台菜单
  const getWorkspaceMenu = () => {
    if (isOperatorRole(currentIdentity?.identityType)) {
      return WORKSPACE_MENU_ITEMS.operator;
    }
    if (currentIdentity?.identityType === "parent") {
      return WORKSPACE_MENU_ITEMS.parent;
    }
    if (currentIdentity?.identityType === "organization_admin") {
      return WORKSPACE_MENU_ITEMS.organization_admin;
    }
    if (currentIdentity?.identityType === "organization_teacher") {
      return WORKSPACE_MENU_ITEMS.organization_teacher;
    }
    if (currentIdentity?.identityType === "teacher") {
      return WORKSPACE_MENU_ITEMS.teacher;
    }
    return WORKSPACE_MENU_ITEMS.teacher;
  };

  const workspaceMenu = getWorkspaceMenu();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            作文投稿平台
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {MAIN_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-gray-600"
              )}
            >
              {item.title}
            </Link>
          ))}
          {/* 申请平台代投 CTA */}
          <Link href={AGENT_SUBMISSION_CTA.href}>
            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              {AGENT_SUBMISSION_CTA.title}
            </Button>
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated() && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.nickname?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  {/* 会员标识 */}
                  {isMember() && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center">
                        <span className="text-[8px] font-medium text-white">VIP</span>
                      </span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.nickname}
                </div>
                <div className="px-2 py-1.5 text-xs text-gray-500">
                  {isMember() ? "年费会员" : "普通用户"}
                </div>
                {isAuthenticated() && (
                  <>
                    <DropdownMenuSeparator />
                    {/* 我的工作台 - 根据角色显示不同内容 */}
                    <div className="px-2 py-1.5 text-xs text-gray-500">
                      我的工作台
                    </div>
                    {workspaceMenu.map((item) => (
                      <DropdownMenuItem key={item.href}>
                        <Link href={item.href} className="flex items-center w-full">
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={ROUTES.IDENTITY_SWITCH} className="flex items-center w-full">
                    身份切换
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  注册
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {MAIN_MENU.map((item) => (
                <DropdownMenuItem key={item.href}>
                  <Link href={item.href}>{item.title}</Link>
                </DropdownMenuItem>
              ))}
              {!isAuthenticated() && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/login">登录</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register">注册</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}