// ============================================================================
// 自主投稿表单组件
// ============================================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { createMockSelfSubmission, getMockSelfSubmissionsByIdentity } from "@/lib/mock/self-submissions";
import { MOCK_ESSAYS, createMockEssay } from "@/lib/mock/essays";
import { getMockStudentsByOwner, MOCK_STUDENTS } from "@/lib/mock/students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Check, Send, Plus, Search, UserPlus, FileText } from "lucide-react";
import type { Activity, SubmissionMethod, Essay, Student } from "@/types";

interface SelfSubmissionFormProps {
  activity: Activity;
  essayId?: string;
  onSuccess?: () => void;
}

export function SelfSubmissionForm({ activity, essayId, onSuccess }: SelfSubmissionFormProps) {
  const router = useRouter();
  const { currentIdentity, isAuthenticated } = useAuthStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedEssayId, setSelectedEssayId] = useState<string>(essayId || "");
  const [submissionEmail, setSubmissionEmail] = useState("");
  const [submissionMethod, setSubmissionMethod] = useState<SubmissionMethod>(activity.submissionMethod || "email");
  const [userNote, setUserNote] = useState("");
  const [riskConfirmed, setRiskConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户已有的作文列表（用于下拉选择）
  const [availableEssays, setAvailableEssays] = useState<Essay[]>([]);
  // 获取用户的学生列表
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);

  // 学生搜索
  const [studentSearch, setStudentSearch] = useState("");
  // 新建学生弹窗
  const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    school: "",
    className: "",
    phone: "",
    guideTeacher: "",
    address: "",
  });
  // 新建作文弹窗
  const [isCreateEssayOpen, setIsCreateEssayOpen] = useState(false);
  const [newEssayTitle, setNewEssayTitle] = useState("");
  const [newEssayContent, setNewEssayContent] = useState("");
  // 作文搜索
  const [essaySearch, setEssaySearch] = useState("");

  // 内存中学生列表（新建后更新）
  const [studentsStore, setStudentsStore] = useState<Student[]>(MOCK_STUDENTS);

  useEffect(() => {
    if (isAuthenticated() && currentIdentity) {
      // 获取用户已提交的作文ID列表
      const submittedSubs = getMockSelfSubmissionsByIdentity(currentIdentity.id);
      const submittedEssayIds = new Set(submittedSubs.map(s => s.essayId));

      // 获取用户的学生列表
      const ownerStudents = studentsStore.filter(s => s.ownerIdentityId === currentIdentity.id);
      setAvailableStudents(ownerStudents);
      if (ownerStudents.length > 0 && !selectedStudentId) {
        setSelectedStudentId(ownerStudents[0].id);
      }

      // 获取用户未投稿的作文列表
      const essays = MOCK_ESSAYS.filter(e =>
        e.ownerIdentityId === currentIdentity.id && !submittedEssayIds.has(e.id)
      );
      setAvailableEssays(essays);
    }
  }, [isAuthenticated, currentIdentity, selectedStudentId, studentsStore]);

  // 根据学生筛选作文
  const filteredEssaysByStudent = selectedStudentId
    ? availableEssays.filter(e => e.studentId === selectedStudentId)
    : availableEssays;

  // 根据搜索过滤作文
  const displayedEssays = essaySearch
    ? filteredEssaysByStudent.filter(e => e.title.toLowerCase().includes(essaySearch.toLowerCase()))
    : filteredEssaysByStudent;

  // 根据搜索过滤学生
  const displayedStudents = studentSearch
    ? studentsStore.filter(s =>
        s.ownerIdentityId === currentIdentity?.id &&
        s.studentName.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : studentsStore.filter(s => s.ownerIdentityId === currentIdentity?.id);

  // 创建学生
  const handleCreateStudent = () => {
    if (!currentIdentity || !newStudent.studentName) return;

    const created: Student = {
      id: `stu-${Date.now()}`,
      ownerIdentityId: currentIdentity.id,
      organizationId: undefined,
      classId: newStudent.className || undefined,
      studentName: newStudent.studentName,
      school: newStudent.school || undefined,
      grade: undefined,
      gender: undefined,
      avatar: undefined,
      phone: newStudent.phone || undefined,
      parentPhone: newStudent.phone || undefined,
      guideTeacher: newStudent.guideTeacher || undefined,
      address: newStudent.address || undefined,
      birthday: undefined,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setStudentsStore([...studentsStore, created]);
    setSelectedStudentId(created.id);
    setNewStudent({ studentName: "", school: "", className: "", phone: "", guideTeacher: "", address: "" });
    setIsCreateStudentOpen(false);
  };

  // 创建作文
  const handleCreateEssay = () => {
    if (!currentIdentity || !newEssayTitle.trim() || !newEssayContent.trim()) return;

    const created = createMockEssay({
      title: newEssayTitle.trim(),
      content: newEssayContent.trim(),
      grade: "",
      ownerIdentityId: currentIdentity.id,
      studentId: selectedStudentId || undefined,
    });

    setAvailableEssays([...availableEssays, created]);
    setSelectedEssayId(created.id);
    setNewEssayTitle("");
    setNewEssayContent("");
    setIsCreateEssayOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentIdentity) {
      setError("请先登录");
      return;
    }

    if (!selectedStudentId) {
      setError("请选择要投稿的学生");
      return;
    }

    if (!selectedEssayId) {
      setError("请选择要投稿的作文");
      return;
    }

    if (!riskConfirmed) {
      setError("请确认一稿多投提示");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 调用 mock 创建投稿记录
      createMockSelfSubmission(
        {
          essayId: selectedEssayId,
          activityId: activity.id,
          submissionEmail,
          submissionMethod,
          userNote,
        },
        currentIdentity.id,
        selectedStudentId
      );

      setSubmitted(true);
      setIsSubmitting(false);

      // 触发成功回调
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("提交失败，请重试");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            自主投稿记录已保存
          </h3>
          <p className="text-gray-600 mb-4">
            您可以前往活动详情页查看投稿信息，并自行完成邮箱投稿
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button onClick={() => router.push(`/activities/${activity.id}`)}>
              查看活动详情
            </Button>
            <Button variant="outline" onClick={() => router.push("/workspace/essays")}>
              作文管理
            </Button>
            <Button variant="outline" onClick={() => router.push("/workspace/submissions")}>
              投稿记录
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>记录自主投稿</CardTitle>
        <CardDescription>
          记录您的投稿信息，便于后续跟踪投稿状态
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 活动信息 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">当前活动</div>
            <div className="font-medium">{activity.title}</div>
            <div className="text-sm text-gray-500">{activity.publisher?.name}</div>
          </div>

          {/* 学生选择 + 作文选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 学生选择 */}
            <div className="space-y-2">
              <Label>选择要投稿的学生</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索学生姓名..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={isCreateStudentOpen} onOpenChange={setIsCreateStudentOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <UserPlus className="h-4 w-4" />
                      新建
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>创建学生资料</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div>
                        <Label htmlFor="stuName">学生姓名 *</Label>
                        <Input
                          id="stuName"
                          value={newStudent.studentName}
                          onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                          placeholder="请输入学生姓名"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stuSchool">学校</Label>
                        <Input
                          id="stuSchool"
                          value={newStudent.school}
                          onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
                          placeholder="请输入学校名称"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stuClass">班级</Label>
                        <Input
                          id="stuClass"
                          value={newStudent.className}
                          onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                          placeholder="如：三年级一班"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stuPhone">联系电话</Label>
                        <Input
                          id="stuPhone"
                          value={newStudent.phone}
                          onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                          placeholder="请输入联系电话"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stuTeacher">指导老师</Label>
                        <Input
                          id="stuTeacher"
                          value={newStudent.guideTeacher}
                          onChange={(e) => setNewStudent({ ...newStudent, guideTeacher: e.target.value })}
                          placeholder="请输入指导老师姓名"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stuAddr">通讯地址</Label>
                        <Input
                          id="stuAddr"
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
              </div>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择学生" />
                </SelectTrigger>
                <SelectContent>
                  {displayedStudents.length > 0 ? (
                    displayedStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.studentName} {student.school ? `- ${student.school}` : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">暂无学生，请先创建学生资料</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 作文选择 */}
            <div className="space-y-2">
              <Label>选择要投稿的作文</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索作文标题..."
                    value={essaySearch}
                    onChange={(e) => setEssaySearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={isCreateEssayOpen} onOpenChange={setIsCreateEssayOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <FileText className="h-4 w-4" />
                      新建
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>新建作文</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div>
                        <Label htmlFor="essayTitle">作文标题 *</Label>
                        <Input
                          id="essayTitle"
                          value={newEssayTitle}
                          onChange={(e) => setNewEssayTitle(e.target.value)}
                          placeholder="请输入作文标题"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="essayContent">作文正文 *</Label>
                        <Textarea
                          id="essayContent"
                          value={newEssayContent}
                          onChange={(e) => setNewEssayContent(e.target.value)}
                          placeholder="请输入作文正文..."
                          className="mt-1 min-h-[200px]"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCreateEssay}
                        disabled={!newEssayTitle.trim() || !newEssayContent.trim()}
                      >
                        确认创建
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Select value={selectedEssayId} onValueChange={setSelectedEssayId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择作文" />
                </SelectTrigger>
                <SelectContent>
                  {displayedEssays.length > 0 ? (
                    displayedEssays.map((essay) => (
                      <SelectItem key={essay.id} value={essay.id}>
                        {essay.title}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">暂无可投稿的作文，请先创建作文</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 投稿邮箱 */}
          <div>
            <Label htmlFor="submissionEmail">您的投稿邮箱</Label>
            <Input
              id="submissionEmail"
              type="email"
              placeholder="请输入您用于投稿的邮箱"
              value={submissionEmail}
              onChange={(e) => setSubmissionEmail(e.target.value)}
              className="mt-2"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              用于记录您投稿时使用的邮箱地址
            </p>
          </div>

          {/* 投稿方式 */}
          <div>
            <Label>投稿方式</Label>
            <Select
              value={submissionMethod}
              onValueChange={(value) => setSubmissionMethod(value as SubmissionMethod)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">邮箱投稿</SelectItem>
                <SelectItem value="website">官网投稿</SelectItem>
                <SelectItem value="wechat">微信投稿</SelectItem>
                <SelectItem value="mini_program">小程序投稿</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 备注 */}
          <div>
            <Label htmlFor="userNote">备注（可选）</Label>
            <Textarea
              id="userNote"
              placeholder="如：已按照格式要求发送，等待回复中..."
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {/* 风险确认 */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-2">一稿多投提示</h4>
                <p className="text-sm text-amber-800 mb-3">
                  部分活动可能存在一稿多投限制，请在投稿前确认：
                </p>
                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1 mb-3">
                  <li>该作文是否已投其他活动</li>
                  <li>该活动是否接受一稿多投</li>
                  <li>同一作文多次投稿可能影响录用结果</li>
                </ul>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="riskConfirm"
                    checked={riskConfirmed}
                    onCheckedChange={(checked) => setRiskConfirmed(checked as boolean)}
                  />
                  <Label htmlFor="riskConfirm" className="text-sm font-medium cursor-pointer">
                    我已确认上述提示，理解投稿风险
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={!riskConfirmed || isSubmitting}
            className="w-full gap-2 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "保存中..." : "保存投稿记录"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}