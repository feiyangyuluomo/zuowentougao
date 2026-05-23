import type {
  IdentityType,
  AuthType,
  AccountStatus,
  Gender,
  MembershipType,
  Timestamps,
} from "./common";

// ============================================================================
// 用户相关类型
// ============================================================================

// 用户
export interface User extends Timestamps {
  id: string;
  nickname: string;
  avatar?: string;
  phone?: string;
  status: AccountStatus;
  registerSource?: string;
}

// 登录凭证
export interface AuthIdentity {
  id: string;
  userId: string;
  authType: AuthType;
  openid?: string;
  unionid?: string;
  phone?: string;
  status: AccountStatus;
  boundAt?: Date;
}

// ============================================================================
// 身份相关类型
// ============================================================================

// 用户身份
export interface UserIdentity extends Timestamps {
  id: string;
  userId: string;
  identityType: IdentityType;
  organizationId?: string;  // 如果是机构身份
  status: AccountStatus;
}

// 权益项
export interface Entitlement {
  id: string;
  identityId: string;
  entitlementType: EntitlementType;
  gradeScope?: string[];    // 年级范围
  aiQuota?: number;         // AI次数
  agentSubmissionQuota?: number; // 代投次数
  selfSubmissionLimit?: number;  // 自主投稿限制
  expiredAt?: Date;
}

// 权益类型
export type EntitlementType =
  | "view_activity_detail"      // 查看活动详情
  | "view_submission_email"     // 查看投稿邮箱
  | "ai_rewrite"                // AI改稿
  | "ai_recommend"              // AI推荐活动
  | "agent_submission"          // 平台代投
  | "organization_student_limit"; // 机构学生限制

// ============================================================================
// 会员相关类型
// ============================================================================

// 会员信息
export interface Membership extends Timestamps {
  id: string;
  identityId: string;
  membershipType: MembershipType;
  gradeScope?: string[];    // 年级范围
  validFrom: Date;
  validTo: Date;
  isLifetime: boolean;
  status: AccountStatus;
}

// ============================================================================
// 学生相关类型
// ============================================================================

// 学生
export interface Student extends Timestamps {
  id: string;
  ownerIdentityId: string;   // 归属身份ID
  organizationId?: string;
  classId?: string;
  studentName: string;
  school?: string;
  grade?: string;
  gender?: Gender;
  avatar?: string;
  phone?: string;
  parentPhone?: string;
  birthday?: Date;
  status: AccountStatus;
}

// ============================================================================
// 机构相关类型
// ============================================================================

// 机构
export interface Organization extends Timestamps {
  id: string;
  name: string;
  studentLimit: number;
  teacherLimit: number;
  status: AccountStatus;
  validFrom: Date;
  expiredAt?: Date;
  logo?: string;
  description?: string;
}

// 班级
export interface Class extends Timestamps {
  id: string;
  organizationId: string;
  teacherIdentityId: string;
  className: string;
  grade?: string;
}

// ============================================================================
// 认证状态
// ============================================================================

// 当前认证状态
export interface AuthState {
  user: User | null;
  currentIdentity: UserIdentity | null;
  identities: UserIdentity[];
  isAuthenticated: boolean;
  isLoading: boolean;
}