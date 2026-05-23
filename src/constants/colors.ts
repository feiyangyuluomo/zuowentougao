// ============================================================================
// 配色常量 - 设计系统规范
// ============================================================================

export const COLORS = {
  // 教育蓝
  primary: {
    DEFAULT: "#2563EB",
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#2563EB",
    600: "#1D4ED8",
    700: "#1E40AF",
    800: "#1E3A8A",
    900: "#1E3A8A",
  },
  // 青绿色
  teal: {
    DEFAULT: "#0F766E",
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",
    600: "#0F766E",
    700: "#065F46",
    800: "#064E3B",
    900: "#064E3B",
  },
  // 按钮强调色-橙色
  accent: {
    DEFAULT: "#F97316",
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#F97316",
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
  },
  // 米白背景
  cream: {
    DEFAULT: "#FAFAF7",
    50: "#FAFAF7",
    100: "#F5F5F0",
  },
} as const;

// 状态颜色映射
export const STATUS_COLORS = {
  // 活动状态
  recruiting: "bg-green-100 text-green-800",
  closing_soon: "bg-yellow-100 text-yellow-800",
  closed: "bg-gray-100 text-gray-800",
  long_term: "bg-blue-100 text-blue-800",
  // 审核状态
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  // 投稿状态
  published: "bg-green-100 text-green-800",
  submission_rejected: "bg-red-100 text-red-800",
  waiting_reply: "bg-blue-100 text-blue-800",
  shortlisted: "bg-purple-100 text-purple-800",
  planned_publish: "bg-indigo-100 text-indigo-800",
  suspected_published: "bg-orange-100 text-orange-800",
  // 订单状态
  paid: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
  partially_refunded: "bg-yellow-100 text-yellow-800",
} as const;