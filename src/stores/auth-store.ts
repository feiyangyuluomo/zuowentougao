// ============================================================================
// 认证状态管理
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  UserIdentity,
  Entitlement,
  Membership,
  AuthState,
} from "@/types";

// TODO: Replace with actual API calls

interface AuthStore extends AuthState {
  // Actions
  login: (phone?: string, wxCode?: string) => Promise<void>;
  logout: () => void;
  switchIdentity: (identityId: string) => void;
  refreshUser: () => Promise<void>;
  refreshEntitlements: () => Promise<void>;
  refreshMembership: () => Promise<void>;

  // Setters
  setUser: (user: User | null) => void;
  setIdentities: (identities: UserIdentity[]) => void;
  setCurrentIdentity: (identity: UserIdentity | null) => void;
  setEntitlements: (entitlements: Entitlement[]) => void;
  setMembership: (membership: Membership | null) => void;
  setLoading: (loading: boolean) => void;

  // Selectors / Computed
  isAuthenticated: () => boolean;
  isMember: () => boolean;
  canUseAIRewrite: () => boolean;
  canUseAIRecommend: () => boolean;
  canViewFullActivity: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      currentIdentity: null,
      identities: [],
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (phone?: string, wxCode?: string) => {
        set({ isLoading: true });
        try {
          // TODO: Implement actual login logic
          // 1. Call API to login with phone or wxCode
          // 2. Get user info
          // 3. Get identities
          // 4. Set default identity

          // Mock login for now
          const mockUser: User = {
            id: "user-001",
            nickname: "测试用户",
            phone: phone || "13800138000",
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const mockIdentities: UserIdentity[] = [
            {
              id: "id-001",
              userId: mockUser.id,
              identityType: "parent",
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "id-002",
              userId: mockUser.id,
              identityType: "teacher",
              organizationId: "org-001",
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];

          set({
            user: mockUser,
            identities: mockIdentities,
            currentIdentity: mockIdentities[0],
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          currentIdentity: null,
          identities: [],
          isAuthenticated: false,
        });
      },

      switchIdentity: (identityId: string) => {
        const { identities } = get();
        const newIdentity = identities.find((i) => i.id === identityId);
        if (newIdentity) {
          set({ currentIdentity: newIdentity });
          // TODO: Refresh entitlements and membership for new identity
        }
      },

      refreshUser: async () => {
        // TODO: Fetch latest user info
      },

      refreshEntitlements: async () => {
        // TODO: Fetch entitlements for current identity
      },

      refreshMembership: async () => {
        // TODO: Fetch membership for current identity
      },

      // Setters
      setUser: (user) => set({ user }),
      setIdentities: (identities) => set({ identities }),
      setCurrentIdentity: (identity) => set({ currentIdentity: identity }),
      setEntitlements: () => {
        // TODO: Store entitlements
      },
      setMembership: () => {
        // TODO: Store membership
      },
      setLoading: (isLoading) => set({ isLoading }),

      // Selectors / Computed
      isAuthenticated: () => get().isAuthenticated,
      isMember: () => {
        // TODO: Check if current identity has valid membership
        return false;
      },
      canUseAIRewrite: () => {
        // TODO: Check entitlements
        return true;
      },
      canUseAIRecommend: () => {
        // TODO: Check entitlements
        return true;
      },
      canViewFullActivity: () => {
        // TODO: Check if can view full activity details
        return true;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        identities: state.identities,
        currentIdentity: state.currentIdentity,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);