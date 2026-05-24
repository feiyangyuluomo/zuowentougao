"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace, isOrganizationAdmin } from "@/lib/permissions";
import { getMockTeacherById } from "@/lib/mock/teachers";
import { MOCK_STUDENTS } from "@/lib/mock/students";
import { MOCK_ESSAYS } from "@/lib/mock/essays";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common";
import { ArrowLeft, User, Phone, MessageSquare, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import type { TeacherRecord } from "@/lib/mock/teachers";
import type { Student } from "@/types";

export default function TeacherDetailPage() {
  const params = useParams();
  const teacherId = params.id as string;
  const { currentIdentity } = useAuthStore();
  const [teacher, setTeacher] = useState<TeacherRecord | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (teacherId) {
      const teacherData = getMockTeacherById(teacherId);
      setTeacher(teacherData);

      // 获取该老师下的学生
      // 这里暂时用mock数据模拟，实际应该通过teacherId关联学生
      const teacherStudents = MOCK_STUDENTS.filter((s) => s.grade); // 简化逻辑
      setStudents(teacherStudents);
    }
  }, [teacherId]);

  if (!canAccessWorkspace(currentIdentity)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">您没有权限访问此页面</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isOrganizationAdmin(currentIdentity)) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">只有机构管理员可以访问此页面</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">老师不存在</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 获取学生的作文列表
  const getStudentEssays = (studentId: string) => {
    return MOCK_ESSAYS.filter((e) => e.studentId === studentId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回链接 */}
      <Link
        href="/workspace/teachers"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回老师管理
      </Link>

      {/* 老师信息卡片 */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {teacher.teacherName || "未知"}
                </h1>
                <Badge
                  variant={teacher.status === "active" ? "default" : "secondary"}
                >
                  {teacher.status === "active" ? "正常" : "已停用"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {teacher.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    {teacher.phone}
                  </div>
                )}
                {teacher.wechat && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    {teacher.wechat}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <GraduationCap className="h-4 w-4" />
                  学生：{teacher.studentCount}人
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="h-4 w-4" />
                  作文：{teacher.essayCount}篇
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学生列表及作文 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">学生列表</h2>
        {students.length === 0 ? (
          <EmptyState
            variant="no-data"
            title="暂无学生"
            description="该老师还没有添加任何学生"
          />
        ) : (
          <div className="space-y-6">
            {students.map((student) => {
              const essays = getStudentEssays(student.id);
              return (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {student.studentName}
                          </CardTitle>
                          <div className="text-sm text-gray-500">
                            {student.school || "未设置学校"} |{" "}
                            {student.grade ? `${student.grade}年级` : "未设置年级"}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{essays.length} 篇作文</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {essays.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        暂无作文
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {essays.map((essay) => (
                          <div
                            key={essay.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {essay.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {essay.wordCount}字 |{" "}
                                {essay.genre === "narrative"
                                  ? "记叙文"
                                  : essay.genre === "prose"
                                  ? "散文"
                                  : "其他"}
                              </p>
                            </div>
                            <Badge
                              variant={
                                essay.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {essay.status === "published"
                                ? "已发布"
                                : "草稿"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}