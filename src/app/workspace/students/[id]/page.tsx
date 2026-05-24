"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace, canAccessStudent } from "@/lib/permissions";
import { getMockStudentById } from "@/lib/mock/students";
import { getMockEssaysByStudentId } from "@/lib/mock/essays";
import { getMockGrowthRecordsByStudentId, getRecordTypeLabel } from "@/lib/mock/growth-records";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, User, Edit, FileText, BookOpen, UserPlus, Calendar, Award, Send, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GrowthRecord, EssayListItem } from "@/types";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const { currentIdentity } = useAuthStore();
  const [essays, setEssays] = useState<EssayListItem[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);

  // 检查是否可以访问工作台
  if (!canAccessWorkspace(currentIdentity)) {
    return <AccessDenied message="您没有权限访问工作台" redirectTo="/" />;
  }

  // 检查资源归属权限
  if (!canAccessStudent(currentIdentity, studentId)) {
    return <AccessDenied message="您没有权限访问此学生" redirectTo="/workspace/students" />;
  }

  const identityType = currentIdentity?.identityType;
  const student = getMockStudentById(studentId);

  useEffect(() => {
    if (studentId) {
      const studentEssays = getMockEssaysByStudentId(studentId);
      setEssays(studentEssays);
      const records = getMockGrowthRecordsByStudentId(studentId);
      setGrowthRecords(records);
    }
  }, [studentId]);

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

      {/* 作文情况统计 - 动态数据 */}
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
                <p className="text-2xl font-semibold text-primary">{essays.length}</p>
                <p className="text-sm text-gray-500">作文总数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">{growthRecords.filter(r => r.recordType === "submission").length}</p>
                <p className="text-sm text-gray-500">已投稿数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-orange-600">{growthRecords.filter(r => r.recordType === "publication").length}</p>
                <p className="text-sm text-gray-500">已发表数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: 作文列表 / 成长档案 */}
      <Tabs defaultValue="essays">
        <TabsList>
          <TabsTrigger value="essays">作文列表 ({essays.length})</TabsTrigger>
          <TabsTrigger value="growth">成长档案 ({growthRecords.length})</TabsTrigger>
        </TabsList>

        {/* 作文列表 */}
        <TabsContent value="essays">
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
              {essays.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">暂无作文</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {canEdit ? "上传第一篇作文，开始投稿之旅" : "此学生还没有上传任何作文"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {essays.map((essay) => (
                    <div key={essay.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{essay.title}</p>
                          <p className="text-sm text-gray-500">
                            {essay.wordCount}字 | {essay.genre || "未分类"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={essay.status === "published" ? "default" : "outline"}>
                          {essay.status === "published" ? "已发布" : "草稿"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 成长档案 */}
        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>成长档案</CardTitle>
              <CardDescription>记录学生的成长历程，包括投稿、发表和获奖记录</CardDescription>
            </CardHeader>
            <CardContent>
              {growthRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">暂无成长记录</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    学生的投稿、发表和获奖记录将显示在这里
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* 时间线 */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {growthRecords.map((record) => (
                      <div key={record.id} className="relative flex items-start gap-4 pl-12">
                        {/* 时间线节点 */}
                        <div className={`absolute left-4 flex h-8 w-8 items-center justify-center rounded-full ${
                          record.recordType === "publication" ? "bg-green-100" :
                          record.recordType === "award" ? "bg-orange-100" :
                          record.recordType === "essay" ? "bg-purple-100" :
                          "bg-blue-100"
                        }`}>
                          {record.recordType === "publication" && <Award className="h-4 w-4 text-green-600" />}
                          {record.recordType === "award" && <Award className="h-4 w-4 text-orange-600" />}
                          {record.recordType === "essay" && <BookOpen className="h-4 w-4 text-purple-600" />}
                          {(record.recordType === "submission" || record.recordType === "certificate") && <Send className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1 border rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={
                                  record.recordType === "publication" ? "default" :
                                  record.recordType === "award" ? "destructive" :
                                  "secondary"
                                } className="text-xs">
                                  {getRecordTypeLabel(record.recordType)}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  {new Date(record.createdAt).toLocaleDateString("zh-CN")}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900">{record.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}