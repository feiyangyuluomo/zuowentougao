import type {
  SelfSubmissionStatus,
  AgentSubmissionFrontendStatus,
  AgentSubmissionBackendStatus,
  SubmissionMethod,
  PriorityLevel,
  ScreenshotType,
  Timestamps,
} from "./common";

// ============================================================================
// 自主投稿相关类型
// ============================================================================

// 自主投稿记录
export interface SelfSubmission extends Timestamps {
  id: string;
  essayId: string;
  activityId: string;
  identityId: string;
  studentId: string;
  submissionEmail?: string;  // 投稿邮箱
  submissionMethod?: SubmissionMethod;
  userSubmissionTime?: Date; // 用户投稿时间
  userNote?: string;         // 用户备注
  submissionStatus: SelfSubmissionStatus;
  resultStatus?: SelfSubmissionStatus; // 最终结果状态
  riskConfirmed: boolean;    // 是否已确认一稿多投风险
  riskConfirmedAt?: Date;
}

// 自主投稿列表项
export interface SelfSubmissionListItem {
  id: string;
  essayId: string;
  essayTitle: string;
  activityId: string;
  activityTitle: string;
  activityPublisher: string;
  submissionStatus: SelfSubmissionStatus;
  userSubmissionTime?: Date;
  createdAt: Date;
}

// 创建自主投稿参数
export interface CreateSelfSubmissionParams {
  essayId: string;
  activityId: string;
  submissionEmail?: string;
  submissionMethod?: SubmissionMethod;
  userNote?: string;
}

// ============================================================================
// 平台代投相关类型
// ============================================================================

// 平台代投任务
export interface AgentSubmissionTask extends Timestamps {
  id: string;
  essayId: string;
  activityId: string;
  identityId: string;
  studentId: string;
  orderId?: string;
  operatorIdentityId?: string; // 运营身份ID
  platformSubmissionEmail?: string; // 平台投稿邮箱
  frontendStatus: AgentSubmissionFrontendStatus;
  backendStatus: AgentSubmissionBackendStatus;
  priorityLevel: PriorityLevel;
  submissionTime?: Date;      // 实际投稿时间
  failureReason?: string;      // 失败原因
  operatorNote?: string;       // 运营备注（内部）
  userVisibleNote?: string;   // 用户可见备注
  riskConfirmed: boolean;
  riskConfirmedAt?: Date;
}

// 代投状态日志
export interface AgentSubmissionLog extends Timestamps {
  id: string;
  taskId: string;
  operatorIdentityId?: string;
  oldFrontendStatus?: AgentSubmissionFrontendStatus;
  newFrontendStatus?: AgentSubmissionFrontendStatus;
  oldBackendStatus?: AgentSubmissionBackendStatus;
  newBackendStatus?: AgentSubmissionBackendStatus;
  note?: string;
}

// 投稿截图表
export interface AgentSubmissionScreenshot extends Timestamps {
  id: string;
  taskId: string;
  screenshotType: ScreenshotType;
  fileUrl: string;
  visibleToUser: boolean;
  uploadedByIdentityId: string;
}

// 代投列表项
export interface AgentSubmissionListItem {
  id: string;
  essayTitle: string;
  activityTitle: string;
  studentName: string;
  frontendStatus: AgentSubmissionFrontendStatus;
  priorityLevel: PriorityLevel;
  createdAt: Date;
  submissionTime?: Date;
}

// 申请代投参数
export interface ApplyAgentSubmissionParams {
  essayId: string;
  activityId: string;
  riskConfirmed: boolean;
}

// ============================================================================
// 成长档案相关类型
// ============================================================================

// 成长记录
export interface GrowthRecord extends Timestamps {
  id: string;
  studentId: string;
  recordType: RecordType;
  relatedSelfSubmissionId?: string;
  relatedAgentSubmissionTaskId?: string;
  title: string;
  description?: string;
  evidenceUrl?: string;
}

// 记录类型
export type RecordType = "essay" | "submission" | "publication" | "award" | "certificate";

// 成长档案
export interface GrowthRecordSummary {
  studentId: string;
  studentName: string;
  totalEssays: number;
  totalSubmissions: number;
  totalPublications: number;
  totalAwards: number;
  records: GrowthRecord[];
}