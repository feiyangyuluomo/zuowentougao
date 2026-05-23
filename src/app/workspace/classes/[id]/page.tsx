"use client";

import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace } from "@/lib/permissions";
import { getMockClassById, getMockClassesByTeacher, getMockClassesByOrganization } from "@/lib/mock/classes";
import { getMockStudentsByOwner } from "@/lib/mock/students";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Users, GraduationCap, Edit, FileText, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;
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
  const orgId = currentIdentity?.organizationId;

  // 获取班级信息
  const cls = getMockClassById(classId);

  // 如果是机构管理员，获取该机构的所有班级来验证权限
  if (identityType === "organization_admin" && orgId) {
    const orgClasses = getMockClassesByOrganization(orgId);
    if (!orgClasses.find((c) => c.id === classId)) {
      return (
        <div className="flex items-center justify-center h-96">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                您没有权限查看此班级
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // 获取班级学生（这里简化处理，实际应按班级关联学生）
  const students = getMockStudentsByOwner(identityId);

  if (!cls) {
    return (
      <div className="space-y-6">
        <Link href="/workspace/classes">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回班级列表
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">班级不存在</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = identityType === "teacher" || identityType === "organization_admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/workspace/classes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{cls.className}</h1>
            <p className="text-gray-500 mt-1">
              {cls.grade ? `年级：${cls.grade}` : "未设置年级"}
              <span className="mx-2">•</span>
              {students.length} 名学生
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              编辑班级
            </Button>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              添加学生
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{students.length}</p>
                <p className="text-sm text-gray-500">学生数量</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">0</p>
                <p className="text-sm text-gray-500">作文数量</p>
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
                <p className="text-2xl font-semibold">0</p>
                <p className="text-sm text-gray-500">已投稿数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>班级学生</CardTitle>
          <CardDescription>查看班级内的所有学生</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">暂无学生</h3>
              <p className="mt-2 text-sm text-gray-500">
                在此班级中添加您的第一个学生
              </p>
              {canEdit && (
                <Button className="mt-4 gap-2">
                  <UserPlus className="h-4 w-4" />
                  添加学生
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>学校</TableHead>
                  <TableHead>年级</TableHead>
                  <TableHead>作文数</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentName}</TableCell>
                    <TableCell className="text-gray-500">{student.school || "-"}</TableCell>
                    <TableCell>{student.grade || "-"}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <Link href={`/workspace/students/${student.id}`}>
                        <Button variant="ghost" size="sm">
                          查看详情
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}