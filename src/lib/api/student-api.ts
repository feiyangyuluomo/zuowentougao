// ============================================================================
// Student API Client
// 学生相关 API 调用封装
// ============================================================================

import { apiGet, apiPost } from "./client";

/**
 * 学生基础信息
 */
export interface StudentInfo {
  id: string;
  ownerIdentityId: string;
  organizationId?: string;
  classId?: string;
  studentName: string;
  school?: string;
  grade?: string;
  gender?: string;
  avatar?: string;
  phone?: string;
  parentPhone?: string;
  guideTeacher?: string;
  address?: string;
  birthday?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建学生参数
 */
export interface CreateStudentParams {
  studentName: string;
  school?: string;
  grade?: string;
  gender?: string;
  phone?: string;
  parentPhone?: string;
  guideTeacher?: string;
  address?: string;
  birthday?: string;
  organizationId?: string;
  classId?: string;
}

/**
 * 获取学生的作文列表
 */
export async function getStudents(): Promise<StudentInfo[]> {
  return apiGet<StudentInfo[]>("/students");
}

/**
 * 创建学生
 */
export async function createStudent(data: CreateStudentParams): Promise<StudentInfo> {
  return apiPost<StudentInfo>("/students", data);
}