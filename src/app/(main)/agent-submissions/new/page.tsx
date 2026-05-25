"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import Link from "next/link";
import { ArrowLeft, FileText, Send, Shield, Zap, AlertTriangle, User, LogIn, Plus, UserPlus } from "lucide-react";
import { getMockActivityById } from "@/lib/mock";
import { AGENT_SUBMISSION_CREATED, trackEvent } from "@/lib/analytics";
import { getStudents, createStudent, type StudentInfo } from "@/lib/api/student-api";
import { getEssays, createEssay, getEssayById, type EssayInfo } from "@/lib/api/essay-api";

function PricingSection() {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <Badge className="mb-2 bg-primary">平台代投服务</Badge>
        <h1 className="text-3xl font-bold text-gray-900">作文代投服务</h1>
        <p className="text-gray-600">
          专业团队协助投稿，省时省力，提升投稿成功率
        </p>
      </div>

      {/* 价格卡片 */}
      <Card className="border-2 border-primary">
        <CardHeader className="text-center pb-2">
          <Badge className="mb-2 bg-primary">限时优惠</Badge>
          <CardTitle className="text-2xl">平台代投</CardTitle>
          <CardDescription>单次服务</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <span className="text-5xl font-bold text-primary">¥9.9</span>
            <span className="text-gray-500">/次/篇</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            一次多篇 = 9.9元 × 篇数
          </p>
          <ul className="text-left space-y-3 text-sm mb-6 max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>专业团队协助投稿</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>节省时间和精力</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>提升投稿成功率</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>全程追踪投稿状态</span>
            </li>
          </ul>
          <div className="space-y-3">
            <Link href="/login">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                <LogIn className="h-4 w-4 mr-2" />
                登录后申请代投
              </Button>
            </Link>
            <p className="text-xs text-gray-500">
              登录后将引导您完成代投申请流程
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 其他服务入口 */}
      <div className="flex justify-center gap-4">
        <Link href="/membership">
          <Button variant="outline">查看更多服务</Button>
        </Link>
        <Link href="/activities">
          <Button variant="outline">浏览征稿活动</Button>
        </Link>
      </div>
    </div>
  );
}

function StudentSelectOrCreate({
  selectedStudentId,
  onSelect,
  students,
  onCreateStudent,
}: {
  selectedStudentId: string | null;
  onSelect: (id: string) => void;
  students: StudentInfo[];
  onCreateStudent: (data: { studentName: string; school?: string; className?: string; phone?: string; guideTeacher?: string; address?: string }) => Promise<void>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    school: "",
    className: "",
    phone: "",
    guideTeacher: "",
    address: "",
  });

  const handleCreateStudent = async () => {
    if (!newStudent.studentName) return;
    await onCreateStudent({
      studentName: newStudent.studentName,
      school: newStudent.school || undefined,
      className: newStudent.className || undefined,
      phone: newStudent.phone || undefined,
      guideTeacher: newStudent.guideTeacher || undefined,
      address: newStudent.address || undefined,
    });
    setNewStudent({ studentName: "", school: "", className: "", phone: "", guideTeacher: "", address: "" });
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>选择学生</Label>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
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
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {students.map((student) => (
            <div
              key={student.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedStudentId === student.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50"
              }`}
              onClick={() => onSelect(student.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{student.studentName}</p>
                  <p className="text-xs text-gray-500">
                    {student.school || "未填写学校"} {student.classId ? `| ${student.classId}` : ""}
                  </p>
                  {student.phone && (
                    <p className="text-xs text-gray-400">{student.phone}</p>
                  )}
                </div>
                {selectedStudentId === student.id && (
                  <Check className="h-5 w-5 text-primary ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>暂无学生资料</p>
          <p className="text-sm">请点击"新增学生"创建</p>
        </div>
      )}
    </div>
  );
}

function EssaySelectOrCreate({
  selectedEssayId,
  onSelect,
  essays,
  onCreateEssay,
}: {
  selectedEssayId: string | null;
  onSelect: (id: string) => void;
  essays: EssayInfo[];
  onCreateEssay: (data: { title: string; content: string }) => Promise<void>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newEssay, setNewEssay] = useState({
    title: "",
    content: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  const selectedEssay = essays.find((e) => e.id === selectedEssayId);

  const handleCreateEssay = async () => {
    if (!newEssay.title || !newEssay.content) return;
    await onCreateEssay({
      title: newEssay.title,
      content: newEssay.content,
    });
    setNewEssay({ title: "", content: "" });
    setIsCreating(false);
  };

  // 按标题搜索作文
  const filteredEssays = searchKeyword
    ? essays.filter((e) => e.title.toLowerCase().includes(searchKeyword.toLowerCase()))
    : essays;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>选择作文</Label>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => setIsCreating(!isCreating)}
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "收起" : "上传新作文"}
        </Button>
      </div>

      {isCreating ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="essayTitle">作文标题 *</Label>
                <Input
                  id="essayTitle"
                  value={newEssay.title}
                  onChange={(e) => setNewEssay({ ...newEssay, title: e.target.value })}
                  placeholder="请输入作文标题"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="essayContent">作文正文 *</Label>
                <Textarea
                  id="essayContent"
                  value={newEssay.content}
                  onChange={(e) => setNewEssay({ ...newEssay, content: e.target.value })}
                  placeholder="请粘贴或输入作文内容..."
                  className="mt-1 min-h-[200px]"
                />
              </div>
              <div className="text-xs text-gray-500">
                字数：{newEssay.content.replace(/\s/g, "").length}
              </div>
              <Button
                className="w-full"
                onClick={handleCreateEssay}
                disabled={!newEssay.title || !newEssay.content}
              >
                确认创建作文
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 搜索框 */}
          {essays.length > 0 && (
            <div className="relative">
              <Input
                placeholder="搜索作文标题..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pr-8"
              />
              {searchKeyword && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchKeyword("")}
                >
                  ×
                </button>
              )}
            </div>
          )}
          {filteredEssays.length > 0 ? (
            <div className="space-y-2">
              {filteredEssays.map((essay) => (
                <div
                  key={essay.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedEssayId === essay.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                  onClick={() => onSelect(essay.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{essay.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {essay.wordCount}字 | {essay.genre || "未分类"}
                      </p>
                    </div>
                    {selectedEssayId === essay.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : essays.length > 0 && filteredEssays.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>未找到匹配的作文</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>暂无作文</p>
              <p className="text-sm">请点击上方"上传新作文"创建</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ApplicationFlow({
  activityId,
  prefilledTitle,
  prefilledContent,
  essayIdFromUrl,
}: {
  activityId: string | null;
  prefilledTitle: string;
  prefilledContent: string;
  essayIdFromUrl: string | null;
}) {
  const [step, setStep] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedEssayId, setSelectedEssayId] = useState<string | null>(null);
  const [riskConfirmed, setRiskConfirmed] = useState(false);
  const { currentIdentity } = useAuthStore();
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [essays, setEssays] = useState<EssayInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingUrl, setIsProcessingUrl] = useState(false);

  // 加载学生和作文列表
  const loadData = useCallback(async () => {
    if (!currentIdentity) return;
    setIsLoading(true);
    try {
      const [studentsData, essaysData] = await Promise.all([
        getStudents(),
        getEssays(),
      ]);
      setStudents(studentsData);
      setEssays(essaysData);
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentIdentity]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 处理 URL 参数中的 essayId 或 title/content
  useEffect(() => {
    if (isLoading || isProcessingUrl) return;

    const processUrlParams = async () => {
      setIsProcessingUrl(true);

      try {
        // 优先处理 essayId - 从 API 获取作文
        if (essayIdFromUrl) {
          const essay = await getEssayById(essayIdFromUrl);
          if (essay) {
            setSelectedEssayId(essay.id);
            // 如果列表中没有这个作文，添加进去
            if (!essays.find((e) => e.id === essay.id)) {
              setEssays((prev) => [...prev, essay]);
            }
            setIsProcessingUrl(false);
            return;
          }
        }

        // 如果没有 essayId 但有 title/content，创建作文
        if (prefilledTitle && prefilledContent && currentIdentity) {
          // 检查是否已有相同标题和内容的作文
          const existing = essays.find(
            (e) => e.title === prefilledTitle && e.content === prefilledContent
          );
          if (existing) {
            setSelectedEssayId(existing.id);
          } else {
            // 创建新作文
            const newEssay = await createEssay({
              title: prefilledTitle,
              content: prefilledContent,
            });
            setEssays((prev) => [...prev, newEssay]);
            setSelectedEssayId(newEssay.id);
          }
        }
      } catch (error) {
        console.error("处理 URL 参数失败:", error);
      } finally {
        setIsProcessingUrl(false);
      }
    };

    processUrlParams();
  }, [isLoading, essayIdFromUrl, prefilledTitle, prefilledContent, currentIdentity]);

  // 获取当前身份下的学生
  const ownerStudents = students.filter((s) => s.ownerIdentityId === currentIdentity?.id);

  // 如果有预填的活动，显示活动信息
  const activity = activityId ? getMockActivityById(activityId) : null;

  // 筛选与活动匹配的学生作文
  const userEssays = currentIdentity
    ? essays.filter((e) => e.ownerIdentityId === currentIdentity.id)
    : [];

  const canProceedStep1 = selectedStudentId !== null;
  const canProceedStep2 = selectedEssayId !== null;
  const canProceedStep3 = riskConfirmed;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={activityId ? "/ai-assistant" : "/activities"}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">申请平台代投</h1>
          <p className="text-gray-600">平台运营人员将为您完成投稿</p>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}>
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">选择学生</span>
        </div>
        <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}>
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">选择作文</span>
        </div>
        <div className={`w-12 h-0.5 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`} />
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}>
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">确认并支付</span>
        </div>
      </div>

      {/* 步骤内容 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {step === 1 && "步骤1：选择要代投的学生"}
            {step === 2 && "步骤2：选择要投稿的作文"}
            {step === 3 && "步骤3：确认投稿信息并支付"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "请选择要投稿的学生，如无学生请先创建"}
            {step === 2 && "请选择您想要投稿的作文，可以上传新作文或选择已有作文"}
            {step === 3 && "请确认投稿信息并完成支付"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              {activity && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium mb-1">已选择活动</div>
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-gray-500">{activity.publisher?.name}</div>
                </div>
              )}
              <StudentSelectOrCreate
                selectedStudentId={selectedStudentId}
                onSelect={setSelectedStudentId}
                students={ownerStudents}
                onCreateStudent={async (data) => {
                  const created = await createStudent({
                    studentName: data.studentName,
                    school: data.school,
                    phone: data.phone,
                    guideTeacher: data.guideTeacher,
                    address: data.address,
                  });
                  setStudents([...students, created]);
                  setSelectedStudentId(created.id);
                }}
              />
              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={!canProceedStep1}>
                  下一步
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <EssaySelectOrCreate
                selectedEssayId={selectedEssayId}
                onSelect={setSelectedEssayId}
                essays={userEssays}
                onCreateEssay={async (data) => {
                  const created = await createEssay({
                    title: data.title,
                    content: data.content,
                  });
                  setEssays([...essays, created]);
                  setSelectedEssayId(created.id);
                }}
              />
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrev}>上一步</Button>
                <Button onClick={handleNext} disabled={!canProceedStep2}>
                  下一步
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {/* 已选信息确认 */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                {activity && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">活动</span>
                    <span className="font-medium">{activity.title}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">学生</span>
                  <span className="font-medium">
                    {students.find((s) => s.id === selectedStudentId)?.studentName || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">作文</span>
                  <span className="font-medium">
                    {essays.find((e) => e.id === selectedEssayId)?.title || "-"}
                  </span>
                </div>
              </div>

              {/* 风险提示 */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-2">投稿风险提示</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• 代投服务仅协助投稿，不保证100%录用</li>
                      <li>• 录用结果取决于稿件质量与活动要求匹配度</li>
                      <li>• 部分活动可能需要较长审核周期，请耐心等待</li>
                      <li>• 如投稿失败，将退还代投费用（特殊说明的活动除外）</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 费用确认 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">平台代投费用</span>
                  <span className="font-medium">¥9.9/篇</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">预计总计</span>
                  <span className="text-2xl font-bold text-primary">¥9.9</span>
                </div>
              </div>

              {/* 确认勾选 */}
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Checkbox
                  id="agree"
                  checked={riskConfirmed}
                  onCheckedChange={(checked) => setRiskConfirmed(checked as boolean)}
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  我已阅读并同意《平台代投服务协议》和上述风险提示
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrev}>上一步</Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  disabled={!canProceedStep3}
                  onClick={() => {
                    // 埋点：代投申请完成
                    trackEvent(AGENT_SUBMISSION_CREATED, {
                      taskId: `task-${Date.now()}`,
                      essayId: selectedEssayId || "",
                      activityId: activityId || "",
                      studentId: selectedStudentId || "",
                    });
                  }}
                >
                  确认并支付 ¥9.9
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NewAgentSubmissionContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activity");
  const essayIdFromUrl = searchParams.get("essayId");
  const prefilledTitle = searchParams.get("title") || "";
  const prefilledContent = searchParams.get("content") || "";

  // 未登录：展示价格引导
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PricingSection />
      </div>
    );
  }

  // 登录后：展示申请流程
  return (
    <div className="container mx-auto px-4 py-8">
      <ApplicationFlow
        activityId={activityId}
        essayIdFromUrl={essayIdFromUrl}
        prefilledTitle={prefilledTitle}
        prefilledContent={prefilledContent}
      />
    </div>
  );
}

function LoadingContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    </div>
  );
}

export default function NewAgentSubmissionPage() {
  return (
    <Suspense fallback={<LoadingContent />}>
      <NewAgentSubmissionContent />
    </Suspense>
  );
}