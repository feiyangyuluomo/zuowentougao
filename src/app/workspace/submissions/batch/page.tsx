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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Search, Send, ArrowLeft, Users, Sparkles, Mail } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BatchSubmissionsPage() {
  const { currentIdentity } = useAuthStore();
  const [selectedEssays, setSelectedEssays] = useState<string[]>([]);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
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

  // 获取学生列表（简化处理，实际应该获取作文列表）
  const students = getMockStudentsByOwner(identityId);

  const canBatchSubmit =
    identityType === "teacher" || identityType === "organization_admin";

  // 模拟作文列表（实际应该从 API 获取）
  const mockEssays = students.map((s) => ({
    id: `essay-${s.id}`,
    studentId: s.id,
    studentName: s.studentName,
    title: `${s.studentName}的作文`,
    school: s.school,
    grade: s.grade,
    status: "draft",
  }));

  // 过滤
  const filteredEssays = mockEssays.filter(
    (e) =>
      e.studentName.includes(searchQuery) ||
      (e.title && e.title.includes(searchQuery))
  );

  const toggleEssay = (essayId: string) => {
    setSelectedEssays((prev) =>
      prev.includes(essayId)
        ? prev.filter((id) => id !== essayId)
        : [...prev, essayId]
    );
  };

  const toggleAll = () => {
    if (selectedEssays.length === filteredEssays.length) {
      setSelectedEssays([]);
    } else {
      setSelectedEssays(filteredEssays.map((e) => e.id));
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
            <h1 className="text-2xl font-semibold text-gray-900">批量投稿</h1>
            <p className="text-gray-500 mt-1">
              选择作文后批量进行 AI 推荐或自主投稿
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedEssays.length > 0 && canBatchSubmit && (
            <>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                批量 AI 推荐
              </Button>
              <Button
                onClick={() => setShowSubmissionDialog(true)}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                批量自主投稿
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">批量投稿说明</p>
              <p className="mt-1">
                选择作文后，可以批量进行 AI 推荐活动，或者批量创建自主投稿记录。请确保作文已上传完成。
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
              placeholder="搜索学生姓名、作文标题..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Essay List */}
      <Card>
        <CardHeader>
          <CardTitle>选择作文</CardTitle>
          <CardDescription>
            已选择 {selectedEssays.length} 篇作文
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEssays.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">暂无作文</h3>
              <p className="mt-2 text-sm text-gray-500">
                先上传作文后再进行投稿操作
              </p>
              <Link href="/workspace/essays/batch">
                <Button className="mt-4 gap-2">
                  <Users className="h-4 w-4" />
                  去上传作文
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEssays.length === filteredEssays.length && filteredEssays.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>作文标题</TableHead>
                  <TableHead>学生</TableHead>
                  <TableHead>学校</TableHead>
                  <TableHead>年级</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEssays.map((essay) => (
                  <TableRow key={essay.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEssays.includes(essay.id)}
                        onCheckedChange={() => toggleEssay(essay.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{essay.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{essay.studentName}</TableCell>
                    <TableCell className="text-gray-500">
                      {essay.school || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {essay.grade || "未设置"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={essay.status === "draft" ? "secondary" : "default"}
                      >
                        {essay.status === "draft" ? "草稿" : "已投稿"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Submission Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>批量自主投稿</DialogTitle>
            <DialogDescription>
              为 {selectedEssays.length} 篇作文创建自主投稿记录
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              确定要为选中的 {selectedEssays.length} 篇作文创建自主投稿记录吗？
            </p>
            <p className="text-sm text-gray-500">
              后续您可以在自主投稿记录页面查看和管理这些投稿。
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmissionDialog(false)}
            >
              取消
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              确认创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}