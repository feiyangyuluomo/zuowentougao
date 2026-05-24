"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace } from "@/lib/permissions";
import { getMockStudentsByOwner, MOCK_STUDENTS } from "@/lib/mock/students";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/common";
import { GRADE_LABELS } from "@/constants";
import {
  Award,
  FileText,
  Send,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Trophy,
  Medal,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual data

const mockRecords = [
  {
    id: "rec-001",
    type: "publication" as const,
    title: "《我的植物朋友》发表于《少年文艺》",
    description: "2024年「童心向未来」主题作文征集获奖作品",
    date: new Date("2024-05-15"),
  },
  {
    id: "rec-002",
    type: "submission" as const,
    title: "《春天的小区》投稿成功",
    description: "投递给第十届「春之声」作文大赛",
    date: new Date("2024-04-20"),
  },
  {
    id: "rec-003",
    type: "award" as const,
    title: "获得「春之声」作文大赛二等奖",
    description: "第十届「春之声」作文大赛",
    date: new Date("2024-05-01"),
  },
  {
    id: "rec-004",
    type: "essay" as const,
    title: "新增作文《记一次有趣的科学实验》",
    description: "记叙文，320字",
    date: new Date("2024-04-10"),
  },
];

export default function WorkspaceGrowthRecordsPage() {
  const { currentIdentity } = useAuthStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // 获取当前身份下的学生
  const students = currentIdentity ? getMockStudentsByOwner(currentIdentity.id) : [];

  useEffect(() => {
    // 默认选中第一个学生
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

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

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // 计算统计数据
  const stats = {
    totalEssays: 12,
    totalSubmissions: 8,
    totalPublications: 2,
    totalAwards: 1,
  };

  const recordTypeConfig = {
    publication: {
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
      label: "发表",
    },
    submission: {
      icon: Send,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      label: "投稿",
    },
    award: {
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      label: "获奖",
    },
    essay: {
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      label: "作文",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">成长档案</h1>
        <p className="text-gray-600 mt-1">
          记录学生的写作历程，沉淀投稿和发表成果
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Selector */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>选择学生</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {students.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>暂无学生资料</p>
                  <Link href="/workspace/students">
                    <Button variant="outline" className="mt-4">
                      去添加学生
                    </Button>
                  </Link>
                </div>
              ) : (
                students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                      selectedStudentId === student.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{student.studentName?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{student.studentName}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {student.school || "未填写学校"}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>数据统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-purple-50">
                  <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalEssays}</div>
                  <div className="text-xs text-gray-500">作文</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <Send className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                  <div className="text-xs text-gray-500">投稿</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50">
                  <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalPublications}</div>
                  <div className="text-xs text-gray-500">发表</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-50">
                  <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalAwards}</div>
                  <div className="text-xs text-gray-500">获奖</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>成长时间线</CardTitle>
                <Button variant="outline" size="sm">
                  导出档案
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="publication">发表</TabsTrigger>
                  <TabsTrigger value="submission">投稿</TabsTrigger>
                  <TabsTrigger value="award">获奖</TabsTrigger>
                </TabsList>
              </Tabs>

              {mockRecords.length === 0 ? (
                <EmptyState
                  variant="no-data"
                  className="mt-8"
                  title="暂无记录"
                  description="开始上传作文和记录投稿，积累成长档案"
                  action={{
                    label: "上传作文",
                    href: "/workspace/essays",
                  }}
                />
              ) : (
                <div className="relative mt-6">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-6">
                    {mockRecords.map((record) => {
                      const config = recordTypeConfig[record.type];
                      const Icon = config.icon;

                      return (
                        <div key={record.id} className="relative flex gap-4">
                          {/* Timeline dot */}
                          <div
                            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${config.bgColor}`}
                          >
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {config.label}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(record.date).toLocaleDateString("zh-CN")}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900">
                              {record.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {record.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}