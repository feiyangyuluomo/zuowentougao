// ============================================================================
// 数据源配置
// 支持 mock/db 双模式切换
// ============================================================================

export const dataSourceConfig = {
  // USE_MOCK=true 使用 Mock 数据（默认）
  // USE_MOCK=false 使用真实数据库
  useMock: process.env.USE_MOCK !== "false",

  // 数据库连接 URL（当 useMock=false 时使用）
  databaseUrl: process.env.DATABASE_URL,

  // 环境
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};

// 便捷导出
export const USE_MOCK = dataSourceConfig.useMock;
export const DATABASE_URL = dataSourceConfig.databaseUrl;