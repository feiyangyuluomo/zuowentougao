// ============================================================================
// Organization Repository
// 机构数据访问层 - 支持 mock/db 双模式
// ============================================================================

import { USE_MOCK } from "@/server/config/data-source";

// Mock 数据
interface MockOrganization {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  studentLimit: number | null;
  teacherLimit: number | null;
  status: string;
  validFrom: Date | null;
  expiredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const mockOrganizationsStore: MockOrganization[] = [
  {
    id: "org-001",
    name: "创意写作工作室",
    description: "专业作文培训机构",
    logo: null,
    website: null,
    studentLimit: 100,
    teacherLimit: 10,
    status: "active",
    validFrom: new Date("2024-01-01"),
    expiredAt: new Date("2026-12-31"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Repository 接口
export interface IOrganizationRepository {
  findById(id: string): Promise<MockOrganization | null>;
  findAll(): Promise<MockOrganization[]>;
}

// Repository 实现
export class OrganizationRepository implements IOrganizationRepository {
  async findById(id: string): Promise<MockOrganization | null> {
    if (USE_MOCK) {
      return mockOrganizationsStore.find((o) => o.id === id) || null;
    }
    return null;
  }

  async findAll(): Promise<MockOrganization[]> {
    if (USE_MOCK) {
      return mockOrganizationsStore;
    }
    return [];
  }
}

// 单例导出
export const organizationRepository = new OrganizationRepository();