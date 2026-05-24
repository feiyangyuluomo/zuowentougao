// ============================================================================
// Class Repository
// 班级数据访问层 - 支持 mock/db 双模式
// ============================================================================

import { USE_MOCK } from "@/server/config/data-source";
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
    return null;
  }

  async findByOrganization(organizationId: string) {
    if (USE_MOCK) {
      return MOCK_CLASSES.filter((c) => c.organizationId === organizationId);
    }
    return [];
  }

  async findByTeacher(teacherIdentityId: string) {
    if (USE_MOCK) {
      return MOCK_CLASSES.filter((c) => c.teacherIdentityId === teacherIdentityId);
    }
    return [];
  }
}

// 单例导出
export const classRepository = new ClassRepository();