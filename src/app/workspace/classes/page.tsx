"use client";

import { useAuthStore } from "@/stores";
import { canAccessWorkspace, isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockClassesByTeacher, getMockClassesByOrganization } from "@/lib/mock/classes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, ArrowRight, Users, GraduationCap } from "lucide-react";

export default function ClassesPage() {
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
  const identityId = currentIdentity?.id || "";

  // 获取班级列表
  let classes: any[] = [];
  if (identityType === "teacher" || identityType === "organization_admin") {
    if (identityType === "organization_admin") {
      const orgId = currentIdentity?.organizationId;
      if (orgId) {
        classes = getMockClassesByOrganization(orgId);
      }
    } else {
      classes = getMockClassesByTeacher(identityId);
    }
  }

  const canManageClass = identityType === "teacher" || identityType === "organization_admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">班级管理</h1>
          <p className="text-gray-500 mt-1">管理您的班级和学生</p>
        </div>
        {canManageClass && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            新建班级
          </Button>
        )}
      </div>

      {/* Empty State */}
      {classes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">暂无班级</h3>
              <p className="mt-2 text-sm text-gray-500">
                {canManageClass
                  ? "创建您的第一个班级，开始管理学生"
                  : "您还没有被分配任何班级"}
              </p>
              {canManageClass && (
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  创建班级
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls.id} className="hover:shadow-md transition-shadow">
              <Link href={`/workspace/classes/${cls.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary">{cls.grade || "未设置"}</Badge>
                  </div>
                  <CardTitle className="mt-4">{cls.className}</CardTitle>
                  <CardDescription>
                    {cls.organizationId ? "机构班级" : "个人班级"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        0 名学生
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}