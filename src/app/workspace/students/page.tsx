"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace, isOrganizationAdmin, isOrganizationTeacher } from "@/lib/permissions";
import { getMockStudentsByOwner, MOCK_STUDENTS } from "@/lib/mock/students";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Plus, Search, GraduationCap, UserPlus } from "lucide-react";

export default function StudentsPage() {
  const { currentIdentity } = useAuthStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    school: "",
    className: "",
    phone: "",
    guideTeacher: "",
    address: "",
  });

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

  const canManageStudent =
    identityType === "teacher" ||
    identityType === "organization_admin" ||
    identityType === "organization_teacher" ||
    identityType === "parent";

  const identityTypeLabels: Record<string, string> = {
    teacher: "个人老师",
    organization_admin: "机构管理员",
    organization_teacher: "机构老师",
    parent: "家长",
  };

  const handleCreateStudent = () => {
    // TODO: 创建学生逻辑
    console.log("创建学生:", newStudent);
    setNewStudent({
      studentName: "",
      school: "",
      className: "",
      phone: "",
      guideTeacher: "",
      address: "",
    });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">学生管理</h1>
          <p className="text-gray-500 mt-1">
            {currentIdentity && identityTypeLabels[currentIdentity.identityType]}视角
          </p>
        </div>
        {canManageStudent && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新增学生
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>创建学生资料</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <Label htmlFor="studentName">学生姓名 *</Label>
                  <Input
                    id="studentName"
                    value={newStudent.studentName}
                    onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                    placeholder="请输入学生姓名"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="school">学校</Label>
                  <Input
                    id="school"
                    value={newStudent.school}
                    onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
                    placeholder="请输入学校名称"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="className">班级</Label>
                  <Input
                    id="className"
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                    placeholder="如：三年级一班"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">联系电话</Label>
                  <Input
                    id="phone"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="请输入联系电话"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="guideTeacher">指导老师</Label>
                  <Input
                    id="guideTeacher"
                    value={newStudent.guideTeacher}
                    onChange={(e) => setNewStudent({ ...newStudent, guideTeacher: e.target.value })}
                    placeholder="请输入指导老师姓名"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">通讯地址</Label>
                  <Input
                    id="address"
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
                  确认创建
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="搜索学生姓名、学校..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>学生列表</CardTitle>
          <CardDescription>共 {students.length} 名学生</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">暂无学生</h3>
              <p className="mt-2 text-sm text-gray-500">
                {canManageStudent
                  ? "添加您的第一个学生，开始管理作文和投稿"
                  : "您还没有被分配任何学生"}
              </p>
              {canManageStudent && (
                <Button className="mt-4 gap-2" onClick={() => setIsCreating(true)}>
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
                  <TableHead>班级</TableHead>
                  <TableHead>指导老师</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">
                            {student.studentName?.[0] || "?"}
                          </span>
                        </div>
                        <span className="font-medium">{student.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{student.school || "-"}</TableCell>
                    <TableCell className="text-gray-500">{student.classId || "-"}</TableCell>
                    <TableCell className="text-gray-500">{student.guideTeacher || "-"}</TableCell>
                    <TableCell className="text-gray-500">{student.parentPhone || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/workspace/students/${student.id}`}>
                          <Button variant="ghost" size="sm">
                            查看详情
                          </Button>
                        </Link>
                      </div>
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