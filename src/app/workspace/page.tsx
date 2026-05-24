"use client";

import { useAuthStore } from "@/stores";
import { canAccessWorkspace, isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getWorkspaceStats, getWorkspaceClasses } from "@/lib/workspace";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, BookOpen, FileText, BarChart3, ArrowRight, GraduationCap } from "lucide-react";

export default function WorkspacePage() {
  const { currentIdentity } = useAuthStore();

  if (!canAccessWorkspace(currentIdentity)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              您没有权限访问此页面
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const identityType = currentIdentity?.identityType;

  // 使用数据层获取统计数据
  const stats = getWorkspaceStats(currentIdentity);
  const classes = getWorkspaceClasses(currentIdentity);

  const isOrgAdmin = isOrganizationAdmin(currentIdentity);
  const isOrgTeacher = isOrganizationTeacher(currentIdentity);
  const isTeacher = identityType === "teacher";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">工作台首页</h1>
        <p className="text-gray-500 mt-1">欢迎回来，快速访问您的管理功能</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.classCount}</p>
                <p className="text-sm text-gray-500">班级数量</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.studentCount}</p>
                <p className="text-sm text-gray-500">学生数量</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.essayCount}</p>
                <p className="text-sm text-gray-500">作文数量</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.submissionCount}</p>
                <p className="text-sm text-gray-500">投稿数量</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 班级管理 - 老师/机构管理员 */}
        {(isTeacher || isOrgAdmin) && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/workspace/classes">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <CardTitle className="mt-4 text-lg">班级管理</CardTitle>
                <CardDescription>管理班级和学生</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">进入管理</Button>
              </CardContent>
            </Link>
          </Card>
        )}

        {/* 学生管理 */}
        {(isTeacher || isOrgAdmin || isOrgTeacher) && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/workspace/students">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <CardTitle className="mt-4 text-lg">学生管理</CardTitle>
                <CardDescription>查看和编辑学生信息</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">查看学生</Button>
              </CardContent>
            </Link>
          </Card>
        )}

        {/* 批量操作 */}
        {(isTeacher || isOrgAdmin) && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/workspace/essays/batch">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <CardTitle className="mt-4 text-lg">批量上传</CardTitle>
                <CardDescription>批量上传学生作文</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">开始上传</Button>
              </CardContent>
            </Link>
          </Card>
        )}

        {/* 数据统计 - 机构管理员 */}
        {isOrgAdmin && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/workspace/statistics">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <CardTitle className="mt-4 text-lg">数据统计</CardTitle>
                <CardDescription>查看机构投稿数据</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">查看统计</Button>
              </CardContent>
            </Link>
          </Card>
        )}
      </div>

      {/* Recent Classes */}
      {(isTeacher || isOrgAdmin) && classes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>最近班级</CardTitle>
            <CardDescription>您管理的班级列表</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classes.slice(0, 5).map((cls) => (
                <Link
                  key={cls.id}
                  href={`/workspace/classes/${cls.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{cls.className}</p>
                    <p className="text-sm text-gray-500">
                      {cls.grade ? `年级：${cls.grade}` : "未设置年级"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}