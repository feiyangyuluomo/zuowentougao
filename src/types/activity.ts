import type {
  PublisherType,
  SubmissionMethod,
  ActivityStatus,
  AuditStatus,
  Timestamps,
} from "./common";

// ============================================================================
// 征稿方相关类型
// ============================================================================

// 征稿方
export interface Publisher extends Timestamps {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  publisherType: PublisherType;
  contactInfo?: string;
}

// ============================================================================
// 活动相关类型
// ============================================================================

// 活动
export interface Activity extends Timestamps {
  id: string;
  publisherId: string;
  publisher?: Publisher;     // 关联征稿方
  title: string;
  activityType?: string;
  gradeScope: string[];       // 适合年级 ["1-2年级", "3-4年级", "5-6年级", "初中", "高中"]
  genre?: string[];           // 文体
  themeTags?: string[];       // 主题标签
  submissionEmail?: string;  // 投稿邮箱（付费可见）
  submissionMethod?: SubmissionMethod;
  submissionFormat?: string; // 投稿格式要求
  emailSubjectFormat?: string; // 邮件标题格式
  deadline?: Date;           // 截止时间
  isLongTerm: boolean;        // 是否长期征稿
  hasPayment: boolean;        // 是否有稿费
  hasBonus: boolean;         // 是否有奖金
  hasCertificate: boolean;   // 是否有证书
  hasSampleIssue: boolean;    // 是否有样刊
  hasTeacherGuide: boolean;   // 是否有教师指导奖
  hasOrgAward: boolean;       // 是否有机构组织奖
  supportSelfSubmission: boolean;  // 是否支持自主投稿
  supportAgentSubmission: boolean; // 是否支持平台代投
  activityStatus: ActivityStatus;
  auditStatus: AuditStatus;
  sourceUrl?: string;         // 来源链接
  originalDetail?: string;    // 原文征稿详情
  publicSummary?: string;     // 公开摘要（游客可见）
  paidDetail?: string;        // 付费详情
  coverImage?: string;       // 封面图
  views?: number;            // 浏览量
  submissions?: number;      // 投稿数
  originalUrl?: string;      // 活动原文链接
  supplementMaterials?: string[]; // 活动补充资料
  writingSuggestions?: string;   // 活动写作建议
}

// 活动筛选条件
export interface ActivityFilters {
  gradeScope?: string[];
  genre?: string[];
  themeTags?: string[];
  hasPayment?: boolean;
  hasCertificate?: boolean;
  hasSampleIssue?: boolean;
  hasBonus?: boolean;
  hasTeacherGuide?: boolean;
  hasOrgAward?: boolean;
  supportSelfSubmission?: boolean;
  supportAgentSubmission?: boolean;
  activityStatus?: ActivityStatus;
  keyword?: string;
}

// 活动列表项（简化版，用于列表展示）
export interface ActivityListItem {
  id: string;
  title: string;
  publisherName: string;
  gradeScope: string[];
  hasPayment: boolean;
  hasCertificate: boolean;
  deadline?: Date;
  isLongTerm: boolean;
  activityStatus: ActivityStatus;
  publicSummary: string;
  coverImage?: string;
}

// AI活动推荐结果
export interface AIRecommendedActivity {
  activity: Activity;
  matchScore: number;        // 匹配度 0-100
  matchReasons: string[];    // 匹配理由
  risks: string[];           // 风险提示
  advice: string;            // 投稿建议
  isSelfSubmissionRecommended: boolean;
  isAgentSubmissionRecommended: boolean;
}