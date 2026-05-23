"use client";

import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace } from "@/lib/permissions";
import { getMockStudentById } from "@/lib/mock/students";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, User, Edit, FileText, BookOpen, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
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
  const student = getMockStudentById(studentId);

  if (!student) {
    return (
      <div className="space-y-6">
        <Link href="/workspace/students">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回学生列表
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">学生不存在</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit =
    identityType === "teacher" ||
    identityType === "organization_admin" ||
    identityType === "organization_teacher";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/workspace/students">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-semibold text-primary">
                {student.studentName?.[0] || "?"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{student.studentName}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{student.school || "未设置学校"}</span>
                <span>•</span>
                <Badge variant="secondary">{student.grade || "未设置年级"}</Badge>
              </div>
            </div>
          </div>
        </div>
        {canEdit && (
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            编辑信息
          </Button>
        )}
      </div>

      {/* Profile Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">性别：</span>
              <span>{student.gender === "male" ? "男" : student.gender === "female" ? "女" : "未设置"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">联系电话：</span>
              <span>{student.parentPhone || "未设置"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">指导老师：</span>
              <span>{student.guideTeacher || "未设置"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">通讯地址：</span>
              <span>{student.address || "未设置"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">作文情况</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-primary">0</p>
                <p className="text-sm text-gray-500">作文总数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">0</p>
                <p className="text-sm text-gray-500">已投稿数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-orange-600">0</p>
                <p className="text-sm text-gray-500">已发表数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Essay List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>作文列表</CardTitle>
              <CardDescription>查看学生的所有作文</CardDescription>
            </div>
            {canEdit && (
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                上传作文
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">暂无作文</h3>
            <p className="mt-2 text-sm text-gray-500">
              {canEdit ? "上传第一篇作文，开始投稿之旅" : "此学生还没有上传任何作文"}
            </p>
            {canEdit && (
              <Button className="mt-4 gap-2">
                <UserPlus className="h-4 w-4" />
                上传作文
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}