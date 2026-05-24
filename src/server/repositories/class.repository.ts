// ============================================================================
// Class Repository
// 班级数据访问层 - 支持 mock/db 双模式
// ============================================================================

import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";
import { MOCK_CLASSES } from "@/lib/mock/classes";

// Repository 接口
export interface IClassRepository {
  findById(id: string): Promise<typeof MOCK_CLASSES[0] | null>;
  findByOrganization(organizationId: string): Promise<typeof MOCK_CLASSES>;
  findByTeacher(teacherIdentityId: string): Promise<typeof MOCK_CLASSES>;
}

// Repository 实现
export class ClassRepository implements IClassRepository {
  async findById(id: string) {
    if (USE_MOCK) {
      return MOCK_CLASSES.find((c) => c.id === id) || null;
    }
    const cls = await prisma.class.findUnique({ where: { id } });
    if (!cls) return null;
    return {
      id: cls.id,
      organizationId: cls.organizationId ?? undefined,
      teacherIdentityId: cls.teacherIdentityId ?? "",
      className: cls.className,
      grade: cls.grade ?? undefined,
      status: cls.status as "active" | "inactive",
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    };
  }

  async findByOrganization(organizationId: string) {
    if (USE_MOCK) {
      return MOCK_CLASSES.filter((c) => c.organizationId === organizationId);
    }
    const classes = await prisma.class.findMany({ where: { organizationId } });
    return classes.map((c) => ({
      id: c.id,
      organizationId: c.organizationId ?? undefined,
      teacherIdentityId: c.teacherIdentityId ?? "",
      className: c.className,
      grade: c.grade ?? undefined,
      status: c.status as "active" | "inactive",
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  async findByTeacher(teacherIdentityId: string) {
    if (USE_MOCK) {
      return MOCK_CLASSES.filter((c) => c.teacherIdentityId === teacherIdentityId);
    }
    const classes = await prisma.class.findMany({ where: { teacherIdentityId } });
    return classes.map((c) => ({
      id: c.id,
      organizationId: c.organizationId ?? undefined,
      teacherIdentityId: c.teacherIdentityId ?? "",
      className: c.className,
      grade: c.grade ?? undefined,
      status: c.status as "active" | "inactive",
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }
}

// 单例导出
export const classRepository = new ClassRepository();