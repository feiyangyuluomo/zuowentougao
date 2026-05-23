// ============================================================================
// Mock 用户数据
// ============================================================================

import type { User } from "@/types";

export const MOCK_USERS: User[] = [
  {
    id: "user-001",
    nickname: "小明同学",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-001",
    phone: "13800138000",
    status: "active",
    registerSource: "phone",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "user-002",
    nickname: "小红同学",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-002",
    phone: "13800138001",
    status: "active",
    registerSource: "wechat",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "user-003",
    nickname: "李老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-003",
    phone: "13900139000",
    status: "active",
    registerSource: "phone",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
];

// 获取用户
export function getMockUserById(id: string): User | null {
  return MOCK_USERS.find((u) => u.id === id) || null;
}

// 获取用户手机号（用于登录）
export function getMockUserByPhone(phone: string): User | null {
  return MOCK_USERS.find((u) => u.phone === phone) || null;
}