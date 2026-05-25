// ============================================================================
// 认证状态管理 - Phase 4A.4 Auth 数据源切换
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  UserIdentity,
  Entitlement,
  Membership,
} from "@/types";
import { mockLoginByPhone, mockSwitchIdentity } from "@/lib/auth/auth-client";

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
      login: async (phone?: string, _wxCode?: string) => {
        set({ isLoading: true });
        try {
          // 使用 auth-client 的 mock 登录
          const result = await mockLoginByPhone(phone || "13800138000");

          set({
            user: result.user,
            identities: result.identities,
            currentIdentity: result.currentIdentity,
            entitlements: result.entitlements,
            membership: result.membership,
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
        const result = mockSwitchIdentity(identities, identityId);
        if (result) {
          set({
            currentIdentity: result.identity,
            entitlements: result.entitlements,
            membership: result.membership,
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