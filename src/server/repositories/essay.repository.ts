// ============================================================================
// Essay Repository
// 作文数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Essay, EssayVersion } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
import { MOCK_ESSAYS, MOCK_ESSAY_VERSIONS } from "@/lib/mock/essays";

// Repository 接口
export interface IEssayRepository {
  findById(id: string): Promise<Essay | null>;
  findByOwner(ownerIdentityId: string): Promise<Essay[]>;
  findByStudent(studentId: string): Promise<Essay[]>;
  findVersions(essayId: string): Promise<EssayVersion[]>;
}

// Repository 实现
export class EssayRepository implements IEssayRepository {
  async findById(id: string): Promise<Essay | null> {
    if (USE_MOCK) {
      return MOCK_ESSAYS.find((e) => e.id === id) || null;
    }
    return null;
  }

  async findByOwner(ownerIdentityId: string): Promise<Essay[]> {
    if (USE_MOCK) {
      return MOCK_ESSAYS.filter((e) => e.ownerIdentityId === ownerIdentityId);
    }
    return [];
  }

  async findByStudent(studentId: string): Promise<Essay[]> {
    if (USE_MOCK) {
      return MOCK_ESSAYS.filter((e) => e.studentId === studentId);
    }
    return [];
  }

  async findVersions(essayId: string): Promise<EssayVersion[]> {
    if (USE_MOCK) {
      return MOCK_ESSAY_VERSIONS.filter((v) => v.essayId === essayId);
    }
    return [];
  }
}

// 单例导出
export const essayRepository = new EssayRepository();