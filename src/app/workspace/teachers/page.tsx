"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import { canAccessWorkspace, isOrganizationAdmin } from "@/lib/permissions";
import {
  getMockTeachersByOrganization,
  createMockTeacher,
  updateMockTeacher,
  deleteMockTeacher,
  type TeacherRecord,
} from "@/lib/mock/teachers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common";
import { Search, Plus, Edit, Trash2, Phone, MessageSquare, User, Eye } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function WorkspaceTeachersPage() {
  const { currentIdentity } = useAuthStore();
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);
  const [formData, setFormData] = useState({
    teacherName: "",
    phone: "",
    wechat: "",
  });

  useEffect(() => {
    if (currentIdentity?.organizationId) {
      const list = getMockTeachersByOrganization(currentIdentity.organizationId);
      setTeachers(list);
    }
  }, [currentIdentity]);

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

  // 筛选
  const filteredTeachers = teachers.filter((teacher) => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      teacher.teacherName?.toLowerCase().includes(keyword) ||
      teacher.phone?.includes(keyword) ||
      teacher.wechat?.toLowerCase().includes(keyword)
    );
  });

  // 添加老师
  const handleAdd = () => {
    if (!currentIdentity?.organizationId || !formData.teacherName.trim()) return;
    const newTeacher = createMockTeacher({
      organizationId: currentIdentity.organizationId,
      teacherName: formData.teacherName,
      phone: formData.phone,
      wechat: formData.wechat,
    });
    setTeachers([...teachers, newTeacher]);
    setShowAddDialog(false);
    setFormData({ teacherName: "", phone: "", wechat: "" });
  };

  // 编辑老师
  const handleEdit = () => {
    if (!selectedTeacher || !formData.teacherName.trim()) return;
    const updated = updateMockTeacher(selectedTeacher.id, {
      teacherName: formData.teacherName,
      phone: formData.phone,
      wechat: formData.wechat,
    });
    if (updated) {
      setTeachers(teachers.map((t) => (t.id === updated.id ? updated : t)));
    }
    setShowEditDialog(false);
    setSelectedTeacher(null);
    setFormData({ teacherName: "", phone: "", wechat: "" });
  };

  // 删除老师 - 改为停止使用
  const handleToggleStatus = () => {
    if (!selectedTeacher) return;
    const newStatus = selectedTeacher.status === "active" ? "frozen" : "active";
    updateMockTeacher(selectedTeacher.id, { status: newStatus });
    setTeachers(
      teachers.map((t) =>
        t.id === selectedTeacher.id ? { ...t, status: newStatus } : t
      )
    );
    setShowDeleteDialog(false);
    setSelectedTeacher(null);
  };

  const openEditDialog = (teacher: TeacherRecord) => {
    setSelectedTeacher(teacher);
    setFormData({
      teacherName: teacher.teacherName || "",
      phone: teacher.phone || "",
      wechat: teacher.wechat || "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (teacher: TeacherRecord) => {
    setSelectedTeacher(teacher);
    setShowDeleteDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">老师管理</h1>
        <p className="text-gray-500 mt-1">管理机构下的老师账号</p>
      </div>

      {/* 操作栏 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索老师姓名、手机号或微信..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            setFormData({ teacherName: "", phone: "", wechat: "" });
            setShowAddDialog(true);
          }}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          添加老师
        </Button>
      </div>

      {/* 老师列表 */}
      {filteredTeachers.length === 0 ? (
        <EmptyState
          variant="no-data"
          title="暂无老师"
          description="还没有添加任何老师"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className={`hover:shadow-md transition-shadow ${
                teacher.status === "closed" ? "opacity-60" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {teacher.teacherName || "未知"}
                        </h3>
                        <Badge
                          variant={teacher.status === "active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {teacher.status === "active" ? "正常" : "已停用"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        {teacher.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {teacher.phone}
                          </span>
                        )}
                        {teacher.wechat && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {teacher.wechat}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-500">
                  <Link href={`/workspace/teachers/${teacher.id}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Eye className="h-4 w-4" />
                    查看详情
                  </Link>
                  <span>学生：{teacher.studentCount}人</span>
                  <span>作文：{teacher.essayCount}篇</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => openEditDialog(teacher)}
                  >
                    <Edit className="h-4 w-4" />
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 gap-1 ${teacher.status === "active" ? "text-amber-500 hover:text-amber-600 hover:border-amber-300" : "text-green-500 hover:text-green-600 hover:border-green-300"}`}
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    {teacher.status === "active" ? "停止使用" : "启用"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 添加老师弹窗 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加老师</DialogTitle>
            <DialogDescription>为机构添加新的老师账号</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>老师姓名 *</Label>
              <Input
                placeholder="请输入老师姓名"
                value={formData.teacherName}
                onChange={(e) =>
                  setFormData({ ...formData, teacherName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>手机号</Label>
              <Input
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>微信号</Label>
              <Input
                placeholder="请输入微信号"
                value={formData.wechat}
                onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAdd} disabled={!formData.teacherName.trim()}>
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑老师弹窗 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑老师</DialogTitle>
            <DialogDescription>修改老师的基本信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>老师姓名 *</Label>
              <Input
                placeholder="请输入老师姓名"
                value={formData.teacherName}
                onChange={(e) =>
                  setFormData({ ...formData, teacherName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>手机号</Label>
              <Input
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>微信号</Label>
              <Input
                placeholder="请输入微信号"
                value={formData.wechat}
                onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleEdit} disabled={!formData.teacherName.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 状态切换确认弹窗 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTeacher?.status === "active" ? "停止使用" : "启用"}老师账号</DialogTitle>
            <DialogDescription>
              {selectedTeacher?.status === "active"
                ? `确定要停止老师 ${selectedTeacher?.teacherName} 的账号使用？该老师将无法登录平台，但保留其名下学生和作文数据。`
                : `确定要启用老师 ${selectedTeacher?.teacherName} 的账号？启用后该老师可以正常登录平台。`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button onClick={handleToggleStatus}>
              {selectedTeacher?.status === "active" ? "停止使用" : "启用"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}