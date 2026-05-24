// ============================================================================
// Essay Repository
// 作文数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { Essay, EssayVersion, EssayGenre, EssayVersionType } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";
import { prisma } from "@/server/db/prisma";
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
    const essay = await prisma.essay.findUnique({ where: { id } });
    if (!essay) return null;
    return {
      id: essay.id,
      studentId: essay.studentId,
      ownerIdentityId: essay.ownerIdentityId,
      title: essay.title,
      content: essay.content,
      wordCount: essay.wordCount,
      genre: (essay.genre as EssayGenre) ?? undefined,
      themeTags: essay.themeTags,
      status: essay.status as "draft" | "published",
      coverImage: essay.coverImage ?? undefined,
      latestVersionId: essay.latestVersionId ?? undefined,
      createdAt: essay.createdAt,
      updatedAt: essay.updatedAt,
    };
  }

  async findByOwner(ownerIdentityId: string): Promise<Essay[]> {
    if (USE_MOCK) {
      return MOCK_ESSAYS.filter((e) => e.ownerIdentityId === ownerIdentityId);
    }
    const essays = await prisma.essay.findMany({ where: { ownerIdentityId } });
    return essays.map((e) => ({
      id: e.id,
      studentId: e.studentId,
      ownerIdentityId: e.ownerIdentityId,
      title: e.title,
      content: e.content,
      wordCount: e.wordCount,
      genre: (e.genre as EssayGenre) ?? undefined,
      themeTags: e.themeTags,
      status: e.status as "draft" | "published",
      coverImage: e.coverImage ?? undefined,
      latestVersionId: e.latestVersionId ?? undefined,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
  }

  async findByStudent(studentId: string): Promise<Essay[]> {
    if (USE_MOCK) {
      return MOCK_ESSAYS.filter((e) => e.studentId === studentId);
    }
    const essays = await prisma.essay.findMany({ where: { studentId } });
    return essays.map((e) => ({
      id: e.id,
      studentId: e.studentId,
      ownerIdentityId: e.ownerIdentityId,
      title: e.title,
      content: e.content,
      wordCount: e.wordCount,
      genre: (e.genre as EssayGenre) ?? undefined,
      themeTags: e.themeTags,
      status: e.status as "draft" | "published",
      coverImage: e.coverImage ?? undefined,
      latestVersionId: e.latestVersionId ?? undefined,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
  }

  async findVersions(essayId: string): Promise<EssayVersion[]> {
    if (USE_MOCK) {
      return MOCK_ESSAY_VERSIONS.filter((v) => v.essayId === essayId);
    }
    const versions = await prisma.essayVersion.findMany({ where: { essayId } });
    return versions.map((v) => ({
      id: v.id,
      essayId: v.essayId,
      versionType: v.versionType as EssayVersionType,
      content: v.content,
      summary: v.summary ?? undefined,
      createdByIdentityId: v.createdByIdentityId ?? "",
      modelName: v.modelName ?? undefined,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
  }
}

// 单例导出
export const essayRepository = new EssayRepository();