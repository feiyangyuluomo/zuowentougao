"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common";
import { getMockEssaysByOwner } from "@/lib/mock/essays";
import { MOCK_STUDENTS } from "@/lib/mock/students";
import { Search, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Essay } from "@/types";

export default function WorkspaceEssaysPage() {
  const { currentIdentity } = useAuthStore();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (currentIdentity) {
      const allEssays = getMockEssaysByOwner(currentIdentity.id);
      setEssays(allEssays);
    }
  }, [currentIdentity]);

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

  // 筛选
  const filteredEssays = essays.filter((essay) => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      essay.title.toLowerCase().includes(keyword) ||
      essay.content.toLowerCase().includes(keyword)
    );
  });

  // 获取学生姓名
  const getStudentName = (studentId: string) => {
    const student = MOCK_STUDENTS.find((s) => s.id === studentId);
    return student?.studentName || "未知学生";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">作文管理</h1>
        <p className="text-gray-500 mt-1">管理机构下所有学生的作文</p>
      </div>

      {/* 搜索 */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="搜索作文标题或内容..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 作文列表 */}
      {filteredEssays.length === 0 ? (
        <EmptyState
          variant="no-data"
          title="暂无作文"
          description="还没有任何作文记录"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEssays.map((essay) => (
            <Card key={essay.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {essay.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      学生：{getStudentName(essay.studentId)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {essay.wordCount}字
                      </Badge>
                      <Badge
                        variant={essay.status === "published" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {essay.status === "published" ? "已发布" : "草稿"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/essays/${essay.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      查看详情
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}