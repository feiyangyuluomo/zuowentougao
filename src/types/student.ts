import type { Gender, AccountStatus, Timestamps } from "./common";

// ============================================================================
// 学生相关类型
// ============================================================================

// 学生
export interface Student extends Timestamps {
  id: string;
  ownerIdentityId: string;   // 归属身份ID
  organizationId?: string;
  classId?: string;
  studentName: string;
  school?: string;
  grade?: string;
  gender?: Gender;
  avatar?: string;
  phone?: string;
  parentPhone?: string;
  birthday?: Date;
  status: AccountStatus;
}

// 学生列表项
export interface StudentListItem {
  id: string;
  studentName: string;
  school?: string;
  grade?: string;
  gender?: Gender;
  essayCount: number;       // 作文数量
  submissionCount: number;  // 投稿数量
  publishedCount: number;   // 发表数量
  avatar?: string;
}

// 学生详情
export interface StudentDetail extends Student {
  essays: EssayListItem[];
  growthRecordCount: number;
}

// 导入学生参数
export interface ImportStudentParams {
  studentName: string;
  school?: string;
  grade?: string;
  gender?: Gender;
  parentPhone?: string;
  birthday?: Date;
}

// 批量导入学生结果
export interface ImportStudentResult {
  successCount: number;
  failCount: number;
  failedRows: { row: number; reason: string }[];
}

// ============================================================================
// 作文相关类型（引用）
// ============================================================================

import type { EssayListItem } from "./essay";