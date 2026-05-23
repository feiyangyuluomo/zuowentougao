"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace, isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockStudentsByOwner } from "@/lib/mock/students";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Upload, Search, Check, X, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BatchEssayUploadPage() {
  const { currentIdentity } = useAuthStore();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // 获取学生列表
  const students = getMockStudentsByOwner(identityId);

  const canBatchUpload =
    identityType === "teacher" || identityType === "organization_admin";

  // 过滤学生
  const filteredStudents = students.filter(
    (s) =>
      s.studentName.includes(searchQuery) ||
      (s.school && s.school.includes(searchQuery))
  );

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
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
            <h1 className="text-2xl font-semibold text-gray-900">批量上传作文</h1>
            <p className="text-gray-500 mt-1">
              选择学生后批量上传他们的作文
            </p>
          </div>
        </div>
        {selectedStudents.length > 0 && canBatchUpload && (
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            为 {selectedStudents.length} 名学生上传作文
          </Button>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">批量上传说明</p>
              <p className="mt-1">
                选择多个学生，然后上传他们各自的作文。系统将支持批量 AI 改稿和批量推荐活动。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索学生姓名、学校..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Student Selection */}
      <Card>
        <CardHeader>
          <CardTitle>选择学生</CardTitle>
          <CardDescription>
            已选择 {selectedStudents.length} 名学生
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">暂无学生</h3>
              <p className="mt-2 text-sm text-gray-500">没有找到匹配的学生</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>学校</TableHead>
                  <TableHead>年级</TableHead>
                  <TableHead>指导老师</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{student.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {student.school || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {student.grade || "未设置"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {student.guideTeacher || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>批量上传作文</DialogTitle>
            <DialogDescription>
              为 {selectedStudents.length} 名学生上传作文
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-600">
                点击或拖拽文件上传
              </p>
              <p className="text-xs text-gray-400 mt-1">
                支持 PDF、Word、图片格式
              </p>
            </div>

            <div className="space-y-2">
              {selectedStudents.map((id) => {
                const student = students.find((s) => s.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{student?.studentName}</span>
                    </div>
                    <Badge variant="secondary">未上传</Badge>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              取消
            </Button>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              开始上传
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}