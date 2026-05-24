// ============================================================================
// Student Repository
// 学生数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Student, Gender, AccountStatus } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";
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
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return null;
    return {
      id: student.id,
      ownerIdentityId: student.ownerIdentityId,
      organizationId: student.organizationId ?? undefined,
      classId: student.classId ?? undefined,
      studentName: student.studentName,
      school: student.school ?? undefined,
      grade: student.grade ?? undefined,
      gender: (student.gender as Gender) ?? undefined,
      avatar: student.avatar ?? undefined,
      phone: student.phone ?? undefined,
      parentPhone: student.parentPhone ?? undefined,
      guideTeacher: student.guideTeacher ?? undefined,
      address: student.address ?? undefined,
      birthday: student.birthday ?? undefined,
      status: student.status as AccountStatus,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }

  async findByOwner(ownerIdentityId: string): Promise<Student[]> {
    if (USE_MOCK) {
      return MOCK_STUDENTS.filter((s) => s.ownerIdentityId === ownerIdentityId);
    }
    const students = await prisma.student.findMany({ where: { ownerIdentityId } });
    return students.map((s) => ({
      id: s.id,
      ownerIdentityId: s.ownerIdentityId,
      organizationId: s.organizationId ?? undefined,
      classId: s.classId ?? undefined,
      studentName: s.studentName,
      school: s.school ?? undefined,
      grade: s.grade ?? undefined,
      gender: (s.gender as Gender) ?? undefined,
      avatar: s.avatar ?? undefined,
      phone: s.phone ?? undefined,
      parentPhone: s.parentPhone ?? undefined,
      guideTeacher: s.guideTeacher ?? undefined,
      address: s.address ?? undefined,
      birthday: s.birthday ?? undefined,
      status: s.status as AccountStatus,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  async findByOrganization(organizationId: string): Promise<Student[]> {
    if (USE_MOCK) {
      return MOCK_STUDENTS.filter((s) => s.organizationId === organizationId);
    }
    const students = await prisma.student.findMany({ where: { organizationId } });
    return students.map((s) => ({
      id: s.id,
      ownerIdentityId: s.ownerIdentityId,
      organizationId: s.organizationId ?? undefined,
      classId: s.classId ?? undefined,
      studentName: s.studentName,
      school: s.school ?? undefined,
      grade: s.grade ?? undefined,
      gender: (s.gender as Gender) ?? undefined,
      avatar: s.avatar ?? undefined,
      phone: s.phone ?? undefined,
      parentPhone: s.parentPhone ?? undefined,
      guideTeacher: s.guideTeacher ?? undefined,
      address: s.address ?? undefined,
      birthday: s.birthday ?? undefined,
      status: s.status as AccountStatus,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  async findByClass(classId: string): Promise<Student[]> {
    if (USE_MOCK) {
      return MOCK_STUDENTS.filter((s) => s.classId === classId);
    }
    const students = await prisma.student.findMany({ where: { classId } });
    return students.map((s) => ({
      id: s.id,
      ownerIdentityId: s.ownerIdentityId,
      organizationId: s.organizationId ?? undefined,
      classId: s.classId ?? undefined,
      studentName: s.studentName,
      school: s.school ?? undefined,
      grade: s.grade ?? undefined,
      gender: (s.gender as Gender) ?? undefined,
      avatar: s.avatar ?? undefined,
      phone: s.phone ?? undefined,
      parentPhone: s.parentPhone ?? undefined,
      guideTeacher: s.guideTeacher ?? undefined,
      address: s.address ?? undefined,
      birthday: s.birthday ?? undefined,
      status: s.status as AccountStatus,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }
}

// 单例导出
export const studentRepository = new StudentRepository();