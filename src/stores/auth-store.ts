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
import { getMockAccountByPhone, getMockIdentitiesByPhone } from "@/lib/mock/accounts";
import { getEntitlementsByIdentityId, getMembershipByIdentityId, isNoEntitlementIdentity } from "@/lib/mock/entitlements";

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

// 内部函数：根据身份加载权益和会员信息
function loadEntitlementsForIdentity(identity: UserIdentity): { entitlements: Entitlement[], membership: Membership | null } {
  // 运营人员和管理员没有权益
  if (isNoEntitlementIdentity(identity.identityType)) {
    return { entitlements: EMPTY_ENTITLEMENTS, membership: null };
  }
  return {
    entitlements: getEntitlementsByIdentityId(identity.id),
    membership: getMembershipByIdentityId(identity.id),
  };
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
          // 根据手机号获取账号信息
          const account = getMockAccountByPhone(phone || "13800138000");
          const mockNickname = account?.nickname || "游客";
          const mockUserId = account?.userId || `user-${Date.now()}`;

          const mockUser: User = {
            id: mockUserId,
            nickname: mockNickname,
            phone: phone || "13800138000",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUserId}`,
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // 根据手机号获取身份列表
          const mockIdentities = getMockIdentitiesByPhone(phone || "13800138000");

          // 如果没有身份，创建一个默认身份
          if (mockIdentities.length === 0) {
            const isOperator = phone === "13800138002";
            const isTeacher = phone === "13800138003";
            const isOrgAdmin = phone === "13800138004";

            let identityType: "parent" | "operator" | "teacher" | "organization_admin";
            if (isOperator) {
              identityType = "operator";
            } else if (isTeacher) {
              identityType = "teacher";
            } else if (isOrgAdmin) {
              identityType = "organization_admin";
            } else {
              identityType = "parent";
            }

            const defaultIdentity: UserIdentity = {
              id: `id-${identityType}-${Date.now()}`,
              userId: mockUser.id,
              identityType,
              organizationId: isOrgAdmin ? "org-001" : undefined,
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockIdentities.push(defaultIdentity);
          }

          const firstIdentity = mockIdentities[0];
          const { entitlements, membership } = loadEntitlementsForIdentity(firstIdentity);

          set({
            user: mockUser,
            identities: mockIdentities,
            currentIdentity: firstIdentity,
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
          // 重新加载新身份的权益和会员信息
          const { entitlements, membership } = loadEntitlementsForIdentity(newIdentity);
          set({
            currentIdentity: newIdentity,
            entitlements,
            membership,
          });
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
        _isAuthenticated: state._isAuthenticated,
      }),
    }
  )
);