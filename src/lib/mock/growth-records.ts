// ============================================================================
// 成长档案Mock数据
// ============================================================================

import type { GrowthRecord, RecordType } from "@/types";

export const MOCK_GROWTH_RECORDS: GrowthRecord[] = [
  {
    id: "gr-001",
    studentId: "stu-001",
    recordType: "publication",
    title: "《春天的小区》在《少年文艺》发表",
    description: "作文《春天的小区》成功在《少年文艺》杂志2024年第5期发表",
    relatedSelfSubmissionId: "self-001",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "gr-002",
    studentId: "stu-001",
    recordType: "essay",
    title: "完成作文《我的植物朋友》",
    description: "在老师指导下完成作文《我的植物朋友》，描写与绿萝的故事",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "gr-003",
    studentId: "stu-001",
    recordType: "award",
    title: "获得第十届'春之声'作文大赛二等奖",
    description: "凭借作文《春天的小区》获得小学高年级组二等奖",
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date("2024-06-20"),
  },
];

/**
 * 获取某个学生的成长记录
 */
export function getMockGrowthRecordsByStudentId(studentId: string): GrowthRecord[] {
  return MOCK_GROWTH_RECORDS.filter((r) => r.studentId === studentId).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

/**
 * 获取成长记录类型标签
 */
export function getRecordTypeLabel(type: RecordType): string {
  const labels: Record<RecordType, string> = {
    essay: "作文",
    submission: "投稿",
    publication: "刊登",
    award: "获奖",
    certificate: "证书",
  };
  return labels[type] || "其他";
}