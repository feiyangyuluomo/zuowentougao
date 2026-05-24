// ============================================================================
// Student Repository
// 学生数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Student } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
import { MOCK_STUDENTS } from "@/lib/mock/students";

// Repository 接口
export interface IStudentRepository {
  findById(id: string): Promise<Student | null>;
  findByOwner(ownerIdentityId: string): Promise<Student[]>;
  findByOrganization(organizationId: string): Promise<Student[]>;
  findByClass(classId: string): Promise<Student[]>;
}

// Repository 实现
export class StudentRepository implements IStudentRepository {
  async findById(id: string): Promise<Student | null> {
    if (USE_MOCK) {
      return MOCK_STUDENTS.find((s) => s.id === id) || null;
    }
    return null;
  }

  async findByOwner(ownerIdentityId: string): Promise<Student[]> {
    if (USE_MOCK) {
      return MOCK_STUDENTS.filter((s) => s.ownerIdentityId === ownerIdentityId);
    }
    return [];
  }

  async findByOrganization(organizationId: string): Promise<Student[]> {
    if (USE_MOCK) {
      return MOCK_STUDENTS.filter((s) => s.organizationId === organizationId);
    }
    return [];
  }

  async findByClass(classId: string): Promise<Student[]> {
    if (USE_MOCK) {
      return MOCK_STUDENTS.filter((s) => s.classId === classId);
    }
    return [];
  }
}

// 单例导出
export const studentRepository = new StudentRepository();