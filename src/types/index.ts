// 统一导出所有类型

export * from "./common";
export * from "./user";
export * from "./activity";
export * from "./essay";
export * from "./student";
export * from "./submission";
export * from "./membership";
export * from "./ai";

// Re-export commonly used types at top level for convenience
export type {
  User,
  UserIdentity,
  Student,
} from "./user";

export type {
  Activity,
  ActivityListItem,
  ActivityFilters,
  AIRecommendedActivity,
} from "./activity";

export type {
  Essay,
  EssayVersion,
  EssayListItem,
  EssayUploadParams,
} from "./essay";

export type {
  SelfSubmission,
  SelfSubmissionListItem,
  CreateSelfSubmissionParams,
  AgentSubmissionTask,
  AgentSubmissionListItem,
} from "./submission";