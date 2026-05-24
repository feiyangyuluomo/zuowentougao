"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common";
import { getMockEssaysByOwner } from "@/lib/mock/essays";
import { getMockStudentsByOwner, MOCK_STUDENTS } from "@/lib/mock/students";
import { Search, FileText, BookOpen, Plus, User, UserPlus } from "lucide-react";
import Link from "next/link";
import type { Essay } from "@/types";

export default function WorkspaceEssaysPage() {
  const { currentIdentity } = useAuthStore();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState<"student" | "essay">("student");

  // 新建作文表单状态
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    school: "",
    className: "",
    phone: "",
    guideTeacher: "",
    address: "",
  });
  const [essayTitle, setEssayTitle] = useState("");
  const [essayContent, setEssayContent] = useState("");

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

  // 获取当前身份下的学生
  const students = currentIdentity ? getMockStudentsByOwner(currentIdentity.id) : [];

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

  // 重置表单
  const resetForm = () => {
    setSelectedStudentId(null);
    setNewStudent({
      studentName: "",
      school: "",
      className: "",
      phone: "",
      guideTeacher: "",
      address: "",
    });
    setEssayTitle("");
    setEssayContent("");
    setStep("student");
    setIsCreating(false);
  };

  // 创建学生
  const handleCreateStudent = () => {
    // TODO: 调用创建学生API
    console.log("创建学生:", newStudent);
    // 模拟创建成功后，选择该学生
    const tempStudentId = "temp-" + Date.now();
    setSelectedStudentId(tempStudentId);
    setStep("essay");
  };

  // 创建作文
  const handleCreateEssay = () => {
    // TODO: 调用创建作文API
    console.log("创建作文:", {
      studentId: selectedStudentId,
      title: essayTitle,
      content: essayContent,
      wordCount: essayContent.replace(/\s/g, "").length,
    });
    resetForm();
    // 刷新列表
    if (currentIdentity) {
      const allEssays = getMockEssaysByOwner(currentIdentity.id);
      setEssays(allEssays);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">作文管理</h1>
          <p className="text-gray-500 mt-1">管理名下所有学生的作文</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新建作文
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {step === "student" ? "选择或创建学生" : "填写作文信息"}
              </DialogTitle>
            </DialogHeader>

            {step === "student" ? (
              // 步骤1：选择或创建学生
              <div className="space-y-4 py-4">
                {students.length > 0 ? (
                  <div className="space-y-3">
                    <Label>选择已有学生</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedStudentId === student.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                          onClick={() => {
                            setSelectedStudentId(student.id);
                            setStep("essay");
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{student.studentName}</p>
                              <p className="text-xs text-gray-500">
                                {student.school || "未填写学校"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>暂无学生资料</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Label className="mb-2 block">或创建新学生</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="newStudentName" className="text-sm">学生姓名 *</Label>
                      <Input
                        id="newStudentName"
                        value={newStudent.studentName}
                        onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                        placeholder="请输入学生姓名"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="newSchool" className="text-sm">学校</Label>
                        <Input
                          id="newSchool"
                          value={newStudent.school}
                          onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
                          placeholder="请输入学校"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newClass" className="text-sm">班级</Label>
                        <Input
                          id="newClass"
                          value={newStudent.className}
                          onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                          placeholder="如：三年级一班"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="newPhone" className="text-sm">联系电话</Label>
                        <Input
                          id="newPhone"
                          value={newStudent.phone}
                          onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                          placeholder="请输入电话"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newTeacher" className="text-sm">指导老师</Label>
                        <Input
                          id="newTeacher"
                          value={newStudent.guideTeacher}
                          onChange={(e) => setNewStudent({ ...newStudent, guideTeacher: e.target.value })}
                          placeholder="请输入老师姓名"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newAddress" className="text-sm">通讯地址</Label>
                      <Input
                        id="newAddress"
                        value={newStudent.address}
                        onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                        placeholder="请输入通讯地址"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleCreateStudent}
                      disabled={!newStudent.studentName}
                    >
                      创建学生并继续
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // 步骤2：填写作文信息
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">
                      {students.find((s) => s.id === selectedStudentId)?.studentName || "新创建学生"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep("student")}
                  >
                    重新选择
                  </Button>
                </div>

                <div>
                  <Label htmlFor="essayTitle">作文标题 *</Label>
                  <Input
                    id="essayTitle"
                    value={essayTitle}
                    onChange={(e) => setEssayTitle(e.target.value)}
                    placeholder="请输入作文标题"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="essayContent">作文正文 *</Label>
                  <Textarea
                    id="essayContent"
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                    placeholder="请粘贴或输入作文内容..."
                    className="mt-1 min-h-[300px]"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  字数：{essayContent.replace(/\s/g, "").length}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetForm}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateEssay}
                    disabled={!essayTitle || !essayContent}
                  >
                    保存作文
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
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
          action={{
            label: "新建作文",
            onClick: () => setIsCreating(true),
          }}
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