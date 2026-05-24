// ============================================================================
// 路由路径常量
// ============================================================================

// 前台路由
export const ROUTES = {
  // 首页
  HOME: "/",

  // 活动相关
  ACTIVITIES: "/activities",
  ACTIVITY_DETAIL: (id: string) => `/activities/${id}`,

  // AI助手
  AI_ASSISTANT: "/ai-assistant",

  // 作文与学生
  ESSAYS: "/essays",
  STUDENTS: "/students",

  // 投稿记录
  SELF_SUBMISSIONS: "/self-submissions",
  AGENT_SUBMISSIONS: "/agent-submissions",

  // 成长档案
  GROWTH_RECORDS: "/workspace/workspace/growth-records",

  // 会员服务
  MEMBERSHIP: "/membership",

  // 媒体库（征稿方展示）
  MEDIA_LIBRARY: "/media-library",
  MEDIA_PUBLISHER_DETAIL: (id: string) => `/media-library/publishers/${id}`,

  // 作文批改
  ESSAY_REVISION: "/essay-revision",

  // 身份切换
  IDENTITY_SWITCH: "/identity-switch",

  // 工作台
  WORKSPACE: "/workspace",
  WORKSPACE_CLASSES: "/workspace/classes",
  WORKSPACE_STUDENTS: "/workspace/students",
  WORKSPACE_BATCH: "/workspace/batch",
  WORKSPACE_ORDERS: "/workspace/orders",
  WORKSPACE_ORG_ORDERS: "/workspace/organization-orders",

  // 编辑工作台
  EDITOR: "/editor",
  EDITOR_ACTIVITIES: "/editor/activities",
  EDITOR_SUBMISSIONS: "/editor/submissions",

  // 管理后台
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_ACTIVITIES: "/admin/activities",
  ADMIN_AGENT_TASKS: "/admin/agent-tasks",
  ADMIN_ORDERS: "/admin/orders",

  // 登录
  LOGIN: "/login",
} as const;

// 菜单配置
export const MAIN_MENU = [
  {
    title: "首页",
    href: ROUTES.HOME,
    icon: "home",
  },
  {
    title: "活动库",
    href: ROUTES.ACTIVITIES,
    icon: "book-open",
  },
  {
    title: "媒体库",
    href: ROUTES.MEDIA_LIBRARY,
    icon: "library",
  },
  {
    title: "AI投稿助手",
    href: ROUTES.AI_ASSISTANT,
    icon: "sparkles",
  },
  {
    title: "作文批改",
    href: ROUTES.ESSAY_REVISION,
    icon: "pencil",
  },
  {
    title: "会员服务",
    href: ROUTES.MEMBERSHIP,
    icon: "credit-card",
  },
] as const;

// 平台代投申请 CTA
export const AGENT_SUBMISSION_CTA = {
  title: "申请平台代投",
  href: "/agent-submissions/new",
  subtitle: "省时投稿",
} as const;

// 我的工作台菜单项（按角色区分）
export const WORKSPACE_MENU_ITEMS = {
  // 家长角色看到的菜单
  parent: [
    { title: "工作台首页", href: ROUTES.WORKSPACE, icon: "layout-dashboard" },
    { title: "我的孩子", href: ROUTES.WORKSPACE_STUDENTS, icon: "heart" },
    { title: "作文管理", href: "/workspace/essays", icon: "file-text" },
    { title: "投稿记录", href: "/workspace/submissions", icon: "send" },
    { title: "成长档案", href: "/workspace/growth-records", icon: "archive" },
    { title: "我的订单", href: ROUTES.WORKSPACE_ORDERS, icon: "receipt" },
  ],
  // 个人老师看到的菜单
  teacher: [
    { title: "工作台首页", href: ROUTES.WORKSPACE, icon: "layout-dashboard" },
    { title: "班级管理", href: ROUTES.WORKSPACE_CLASSES, icon: "users" },
    { title: "学生管理", href: ROUTES.WORKSPACE_STUDENTS, icon: "book-open" },
    { title: "作文管理", href: "/workspace/essays", icon: "file-text" },
    { title: "投稿记录", href: "/workspace/submissions", icon: "send" },
    { title: "批量上传", href: "/workspace/essays/batch", icon: "upload" },
    { title: "成长档案", href: "/workspace/growth-records", icon: "archive" },
    { title: "数据统计", href: "/workspace/statistics", icon: "bar-chart" },
    { title: "我的订单", href: ROUTES.WORKSPACE_ORDERS, icon: "receipt" },
  ],
  // 机构老师看到的菜单（无订单入口）
  organization_teacher: [
    { title: "工作台首页", href: ROUTES.WORKSPACE, icon: "layout-dashboard" },
    { title: "班级管理", href: ROUTES.WORKSPACE_CLASSES, icon: "users" },
    { title: "授权学生", href: ROUTES.WORKSPACE_STUDENTS, icon: "book-open" },
    { title: "作文管理", href: "/workspace/essays", icon: "file-text" },
    { title: "投稿记录", href: "/workspace/submissions", icon: "send" },
    { title: "批量上传", href: "/workspace/essays/batch", icon: "upload" },
    { title: "成长档案", href: "/workspace/growth-records", icon: "archive" },
    { title: "数据统计", href: "/workspace/statistics", icon: "bar-chart" },
  ],
  // 机构管理员看到的菜单
  organization_admin: [
    { title: "工作台首页", href: ROUTES.WORKSPACE, icon: "layout-dashboard" },
    { title: "班级管理", href: ROUTES.WORKSPACE_CLASSES, icon: "users" },
    { title: "学生管理", href: ROUTES.WORKSPACE_STUDENTS, icon: "book-open" },
    { title: "老师管理", href: "/workspace/teachers", icon: "user-cog" },
    { title: "作文管理", href: "/workspace/essays", icon: "file-text" },
    { title: "投稿记录", href: "/workspace/submissions", icon: "send" },
    { title: "批量上传", href: "/workspace/essays/batch", icon: "upload" },
    { title: "成长档案", href: "/workspace/growth-records", icon: "archive" },
    { title: "数据统计", href: "/workspace/statistics", icon: "bar-chart" },
    { title: "机构订单", href: ROUTES.WORKSPACE_ORG_ORDERS, icon: "receipt" },
  ],
  // 运营角色看到的菜单
  operator: [
    { title: "工作台首页", href: ROUTES.WORKSPACE, icon: "layout-dashboard" },
    { title: "平台代投任务池", href: ROUTES.ADMIN_AGENT_TASKS, icon: "list-todo" },
    { title: "成长档案", href: "/workspace/growth-records", icon: "archive" },
  ],
} as const;

export const USER_MENU = [
  {
    title: "我的工作台",
    href: null, // 下拉菜单，无直接链接
    icon: "layout-dashboard",
    isWorkspace: true,
  },
  {
    title: "身份切换",
    href: ROUTES.IDENTITY_SWITCH,
    icon: "switch-account",
  },
] as const;

// 年级选项
export const GRADE_OPTIONS = [
  { label: "1年级", value: "1" },
  { label: "2年级", value: "2" },
  { label: "3年级", value: "3" },
  { label: "4年级", value: "4" },
  { label: "5年级", value: "5" },
  { label: "6年级", value: "6" },
  { label: "初一", value: "7" },
  { label: "初二", value: "8" },
  { label: "初三", value: "9" },
  { label: "高一", value: "10" },
  { label: "高二", value: "11" },
  { label: "高三", value: "12" },
] as const;

// 年级分组
export const GRADE_GROUPS = {
  PRIMARY: ["1", "2", "3", "4", "5", "6"],
  MIDDLE: ["7", "8", "9"],
  HIGH: ["10", "11", "12"],
} as const;

// 年级标签
export const GRADE_LABELS: Record<string, string> = {
  "1": "1年级",
  "2": "2年级",
  "3": "3年级",
  "4": "4年级",
  "5": "5年级",
  "6": "6年级",
  "7": "初一",
  "8": "初二",
  "9": "初三",
  "10": "高一",
  "11": "高二",
  "12": "高三",
} as const;