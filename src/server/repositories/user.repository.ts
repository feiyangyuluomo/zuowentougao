// ============================================================================
// User Repository
// 用户数据访问层 - 支持 mock/db 双模式
// ============================================================================

import type { User } from "@/types";
import { USE_MOCK } from "@/server/config/data-source";

// Mock 数据
interface MockUser extends User {}

const mockUsersStore: MockUser[] = [
  {
    id: "user-parent-001",
    nickname: "付费家长小明",
    phone: "13800138001",
    avatar: undefined,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "user-operator-001",
    nickname: "运营小王",
    phone: "13800138002",
    avatar: undefined,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "user-teacher-001",
    nickname: "张老师",
    phone: "13800138003",
    avatar: undefined,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "user-org-admin-001",
    nickname: "李管理员",
    phone: "13800138004",
    avatar: undefined,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "user-org-teacher-001",
    nickname: "王老师",
    phone: "13800138005",
    avatar: undefined,
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

// Repository 接口
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
}

// Repository 实现 - 当前仅支持 Mock
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return mockUsersStore.find((u) => u.id === id) || null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return mockUsersStore.find((u) => u.phone === phone) || null;
  }
}

// 单例导出
export const userRepository = new UserRepository();