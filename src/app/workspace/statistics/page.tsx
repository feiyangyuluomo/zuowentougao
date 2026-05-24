"use client";

import { useAuthStore } from "@/stores";
import { isOrganizationAdmin, isTeacher } from "@/lib/permissions";
import { getWorkspaceStats, getWorkspaceClasses } from "@/lib/workspace";
import { getMockOrganizationById, getMockClassesByTeacher } from "@/lib/mock/classes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, GraduationCap, BookOpen, FileText, TrendingUp, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function StatisticsPage() {
  const { currentIdentity } = useAuthStore();

  // 只允许机构管理员和个人老师查看
  if (!isOrganizationAdmin(currentIdentity) && !isTeacher(currentIdentity)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              只有机构管理员或个人老师可以查看数据统计
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOrgAdmin = isOrganizationAdmin(currentIdentity);
  const orgId = currentIdentity?.organizationId;
  const organization = orgId ? getMockOrganizationById(orgId) : null;
  const isTeacherRole = isTeacher(currentIdentity);

  // 个人老师：显示老师视角的数据（无机构信息标题）
  if (isTeacherRole && !isOrgAdmin && currentIdentity) {
    const stats = getWorkspaceStats(currentIdentity);
    const teacherClasses = getMockClassesByTeacher(currentIdentity.id);

    const statsData = {
      totalStudents: stats.studentCount,
      totalClasses: teacherClasses.length,
      totalEssays: stats.essayCount,
      totalSubmissions: stats.submissionCount,
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/workspace">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">数据统计</h1>
              <p className="text-gray-500 mt-1">个人老师视角</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            导出数据
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{statsData.totalStudents}</p>
                  <p className="text-sm text-gray-500">学生总数</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{statsData.totalClasses}</p>
                  <p className="text-sm text-gray-500">班级总数</p>
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
                  <p className="text-2xl font-semibold">{statsData.totalEssays}</p>
                  <p className="text-sm text-gray-500">作文总数</p>
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
                  <p className="text-2xl font-semibold">{statsData.totalSubmissions}</p>
                  <p className="text-sm text-gray-500">投稿总数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Stats */}
        <Card>
          <CardHeader>
            <CardTitle>班级统计</CardTitle>
            <CardDescription>您名下的班级情况</CardDescription>
          </CardHeader>
          <CardContent>
            {teacherClasses.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">暂无班级</h3>
                <p className="mt-2 text-sm text-gray-500">还没有创建任何班级</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teacherClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{cls.className}</p>
                        <p className="text-sm text-gray-500">
                          {cls.grade ? `年级：${cls.grade}` : "未设置年级"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-gray-500">学生数</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-gray-500">作文数</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-gray-500">投稿数</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              投稿趋势
            </CardTitle>
            <CardDescription>近6个月的投稿情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40">
              {[0, 0, 0, 0, 0, 0].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-lg flex items-end justify-center" style={{ height: '20%' }}>
                    <div className="w-full bg-primary/20 rounded-lg" style={{ height: '20%' }} />
                  </div>
                  <span className="text-xs text-gray-500">{["1月", "2月", "3月", "4月", "5月", "6月"][i]}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-4 text-sm text-gray-500">
              暂无投稿数据
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 机构管理员逻辑（原有逻辑）
  if (!organization) {
    return (
      <div className="space-y-6">
        <Link href="/workspace">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工作台
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">机构信息不存在</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 使用数据层获取统计数据
  const stats = getWorkspaceStats(currentIdentity);
  const classes = getWorkspaceClasses(currentIdentity);

  // 统计数据
  const statsData = {
    totalStudents: stats.studentCount,
    totalClasses: stats.classCount,
    totalEssays: stats.essayCount,
    totalSubmissions: stats.submissionCount,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/workspace">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">数据统计</h1>
            <p className="text-gray-500 mt-1">{organization.name}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          导出数据
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{statsData.totalStudents}</p>
                <p className="text-sm text-gray-500">学生总数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{statsData.totalClasses}</p>
                <p className="text-sm text-gray-500">班级总数</p>
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
                <p className="text-2xl font-semibold">{statsData.totalEssays}</p>
                <p className="text-sm text-gray-500">作文总数</p>
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
                <p className="text-2xl font-semibold">{statsData.totalSubmissions}</p>
                <p className="text-sm text-gray-500">投稿总数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Stats */}
      <Card>
        <CardHeader>
          <CardTitle>班级统计</CardTitle>
          <CardDescription>各班级的学生数量和投稿情况</CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">暂无班级</h3>
              <p className="mt-2 text-sm text-gray-500">还没有创建任何班级</p>
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cls.className}</p>
                      <p className="text-sm text-gray-500">
                        {cls.grade ? `年级：${cls.grade}` : "未设置年级"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold">0</p>
                      <p className="text-xs text-gray-500">学生数</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">0</p>
                      <p className="text-xs text-gray-500">作文数</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">0</p>
                      <p className="text-xs text-gray-500">投稿数</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            投稿趋势
          </CardTitle>
          <CardDescription>近6个月的投稿情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {[0, 0, 0, 0, 0, 0].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-lg flex items-end justify-center" style={{ height: '20%' }}>
                  <div className="w-full bg-primary/20 rounded-lg" style={{ height: '20%' }} />
                </div>
                <span className="text-xs text-gray-500">{["1月", "2月", "3月", "4月", "5月", "6月"][i]}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            暂无投稿数据
          </div>
        </CardContent>
      </Card>
    </div>
  );
}