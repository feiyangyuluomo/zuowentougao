"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/common";
import { getMockStudentList } from "@/lib/mock";
import { GRADE_LABELS } from "@/constants";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Send,
  Award,
  Edit,
} from "lucide-react";
import Link from "next/link";

// TODO: Replace with actual auth and data

export default function StudentsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const students = getMockStudentList();

  const filteredStudents = students.filter((student) =>
    student.studentName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的学生</h1>
          <p className="text-gray-600 mt-1">
            管理学生信息，查看作文和投稿情况
          </p>
        </div>
        <Link href="/students/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            添加学生
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索学生姓名..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
          />
        </div>
      </div>

      {/* Student List */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          variant="no-students"
          className="mt-8"
          action={{
            label: "添加第一个学生",
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>
                        {student.studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{student.studentName}</CardTitle>
                      <CardDescription>
                        {student.school} | {student.grade ? GRADE_LABELS[student.grade] || student.grade : ""}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {student.essayCount}
                    </div>
                    <div className="text-xs text-gray-500">作文</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {student.submissionCount}
                    </div>
                    <div className="text-xs text-gray-500">投稿</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {student.publishedCount}
                    </div>
                    <div className="text-xs text-gray-500">发表</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/essays?student=${student.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <FileText className="h-3 w-3" />
                      作文
                    </Button>
                  </Link>
                  <Link href={`/self-submissions?student=${student.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Send className="h-3 w-3" />
                      投稿
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