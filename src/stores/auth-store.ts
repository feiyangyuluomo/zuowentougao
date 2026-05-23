// ============================================================================
// 认证状态管理 - Phase 1 自主投稿闭环
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  UserIdentity,
  Entitlement,
  Membership,
} from "@/types";

// ============================================================================
// Mock 权益数据
// ============================================================================

// 模拟会员权益
const MOCK_ENTITLEMENTS: Entitlement[] = [
  {
    id: "ent-001",
    identityId: "id-001",
    entitlementType: "view_activity_detail",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    expiredAt: new Date("2026-12-31"),
  },
  {
    id: "ent-002",
    identityId: "id-001",
    entitlementType: "view_submission_email",
    gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    expiredAt: new Date("2026-12-31"),
  },
  {
    id: "ent-003",
    identityId: "id-001",
    entitlementType: "ai_rewrite",
    aiQuota: 10,
    expiredAt: new Date("2026-12-31"),
  },
  {
    id: "ent-004",
    identityId: "id-001",
    entitlementType: "ai_recommend",
    aiQuota: 20,
    expiredAt: new Date("2026-12-31"),
  },
];

// 模拟会员信息
const MOCK_MEMBERSHIP: Membership = {
  id: "mem-001",
  identityId: "id-001",
  membershipType: "yearly",
  gradeScope: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  validFrom: new Date("2025-01-01"),
  validTo: new Date("2026-12-31"),
  isLifetime: false,
  status: "active",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

// 游客权益（无权益）
const EMPTY_ENTITLEMENTS: Entitlement[] = [];

interface AuthStore {
  // Data
  user: User | null;
  currentIdentity: UserIdentity | null;
  identities: UserIdentity[];
  entitlements: Entitlement[];
  membership: Membership | null;
  isLoading: boolean;
  _isAuthenticated: boolean; // stored state

  // Actions
  login: (phone?: string, wxCode?: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  switchIdentity: (identityId: string) => void;
  refreshUser: () => Promise<void>;

  // Setters
  setUser: (user: User | null) => void;
  setIdentities: (identities: UserIdentity[]) => void;
  setCurrentIdentity: (identity: UserIdentity | null) => void;
  setLoading: (loading: boolean) => void;

  // Selectors / Computed
  isAuthenticated: () => boolean;
  isMember: () => boolean;
  hasEntitlement: (type: Entitlement["entitlementType"]) => boolean;
  getEntitlements: () => Entitlement[];
  getMembership: () => Membership | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      currentIdentity: null,
      identities: [],
      entitlements: [],
      membership: null,
      isLoading: false,
      _isAuthenticated: false,

      // Actions
      login: async (phone?: string, wxCode?: string) => {
        set({ isLoading: true });
        try {
          // Mock 登录成功
          const mockUser: User = {
            id: "user-001",
            nickname: "小明同学",
            phone: phone || "13800138000",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-001",
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // 根据手机号判断身份类型
          const isOperator = phone === "13800138002";
          const mockIdentities: UserIdentity[] = [
            {
              id: isOperator ? "id-operator-001" : "id-001",
              userId: mockUser.id,
              identityType: isOperator ? "operator" : "parent",
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];

          // 运营人员没有会员权益
          const entitlements = isOperator ? [] : MOCK_ENTITLEMENTS;
          const membership = isOperator ? null : MOCK_MEMBERSHIP;

          set({
            user: mockUser,
            identities: mockIdentities,
            currentIdentity: mockIdentities[0],
            entitlements,
            membership,
            _isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      // 游客模式（不登录但可浏览部分内容）
      loginAsGuest: () => {
        set({
          user: null,
          currentIdentity: null,
          identities: [],
          entitlements: EMPTY_ENTITLEMENTS,
          membership: null,
          isLoading: false,
          _isAuthenticated: false,
        });
      },

      logout: () => {
        set({
          user: null,
          currentIdentity: null,
          identities: [],
          entitlements: [],
          membership: null,
          _isAuthenticated: false,
        });
      },

      switchIdentity: (identityId: string) => {
        const { identities } = get();
        const newIdentity = identities.find((i) => i.id === identityId);
        if (newIdentity) {
          set({ currentIdentity: newIdentity });
          // TODO: 刷新新身份的权益和会员信息
        }
      },

      refreshUser: async () => {
        // TODO: 获取最新用户信息
      },

      // Setters
      setUser: (user) => set({ user }),
      setIdentities: (identities) => set({ identities }),
      setCurrentIdentity: (identity) => set({ currentIdentity: identity }),
      setLoading: (isLoading) => set({ isLoading }),

      // Selectors / Computed
      isAuthenticated: () => get()._isAuthenticated,

      isMember: () => {
        const { membership } = get();
        if (!membership) return false;
        return membership.status === "active" && new Date(membership.validTo) > new Date();
      },

      hasEntitlement: (type: Entitlement["entitlementType"]) => {
        const { entitlements } = get();
        return entitlements.some((e) => e.entitlementType === type);
      },

      getEntitlements: () => get().entitlements,

      getMembership: () => get().membership,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        identities: state.identities,
        currentIdentity: state.currentIdentity,
        entitlements: state.entitlements,
        membership: state.membership,
      }),
    }
  )
);